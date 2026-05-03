import { createContext, useCallback, useContext, useMemo, useEffect, useState } from "react";
import {
  buildDrops,
  buildProducts,
  cloneDrop,
  cloneProduct,
  hydrateProduct,
  refreshProductsWithDrops,
} from "../lib/productsState";
import supabase, { isSupabaseConfigured } from "../../../shared/lib/supabaseClient";

const ProductsContext = createContext(null);
const PRODUCT_MEDIA_BUCKET = "product-media";

function formatSupabaseError(error) {
  if (!error) {
    return "Unable to load products from Supabase.";
  }

  if (typeof error.message === "string" && error.message.trim()) {
    return error.message;
  }

  return "Unable to load products from Supabase.";
}

function serializeProductRecord(product) {
  const record = {
    drop_id: product.drop_id || null,
    slug: product.slug,
    name: product.name,
    subtitle: product.subtitle?.trim() || null,
    description: product.description?.trim() || null,
    category: product.category?.trim() || null,
    product_type: product.product_type?.trim() || null,
    status: product.status,
    size_guide: product.size_guide ?? null,
  };

  if (isPersistedRecordId(product.id)) {
    record.id = product.id;
  }

  return record;
}

function serializeVariantRecord(variant, productId, options = {}) {
  const record = {
    product_id: productId ?? variant.product_id,
    sku: variant.sku,
    color: variant.color?.trim() || null,
    size: variant.size?.trim() || null,
    price_aud: Math.max(0, Number(variant.price_aud) || 0),
    compare_at_price_aud:
      variant.compare_at_price_aud === null || variant.compare_at_price_aud === ""
        ? null
        : Math.max(0, Number(variant.compare_at_price_aud) || 0),
    inventory_quantity: Math.max(0, Number(variant.inventory_quantity) || 0),
    inventory_status: variant.inventory_status,
    active: variant.active ?? true,
  };

  if (options.includeId && isPersistedRecordId(variant.id)) {
    record.id = variant.id;
  }

  return record;
}

function isPersistedRecordId(recordId) {
  return typeof recordId === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(recordId);
}

function isPersistedImageId(imageId) {
  return typeof imageId === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(imageId);
}

function getPublicStorageUrl(bucket, path) {
  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}

function getStoragePaths(images) {
  return images
    .map((image) => ({
      bucket: image.storage_bucket || PRODUCT_MEDIA_BUCKET,
      path: image.storage_path || null,
    }))
    .filter((entry) => entry.path);
}

async function deleteStorageObjects(images) {
  const entries = getStoragePaths(images);

  if (!entries.length) {
    return;
  }

  const bucketMap = entries.reduce((result, entry) => {
    const currentPaths = result.get(entry.bucket) ?? [];
    currentPaths.push(entry.path);
    result.set(entry.bucket, currentPaths);
    return result;
  }, new Map());

  for (const [bucket, paths] of bucketMap.entries()) {
    const { error } = await supabase.storage.from(bucket).remove(paths);

    if (error) {
      throw error;
    }
  }
}

async function uploadPendingImages(images, productId) {
  const pendingImages = images.filter((image) => image.uploadBlob);

  if (!pendingImages.length) {
    return [];
  }

  const uploadedImages = [];

  for (const image of pendingImages) {
    const imageId = typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `image-${Date.now()}-${uploadedImages.length + 1}`;
    const storagePath = `products/${productId}/${imageId}.webp`;
    const { error: uploadError } = await supabase.storage
      .from(PRODUCT_MEDIA_BUCKET)
      .upload(storagePath, image.uploadBlob, {
        cacheControl: "3600",
        contentType: image.mime_type || "image/webp",
        upsert: false,
      });

    if (uploadError) {
      throw uploadError;
    }

    uploadedImages.push({
      ...image,
      id: imageId,
      product_id: productId,
      storage_bucket: PRODUCT_MEDIA_BUCKET,
      storage_path: storagePath,
      image_url: getPublicStorageUrl(PRODUCT_MEDIA_BUCKET, storagePath),
    });
  }

  return uploadedImages;
}

function serializeImageRecord(image, productId, sortOrder) {
  const record = {
    product_id: productId,
    image_url: image.image_url,
    alt_text: image.alt_text?.trim() || null,
    image_type: image.image_type || image.mime_type || "image/webp",
    sort_order: sortOrder,
    storage_bucket: image.storage_bucket || null,
    storage_path: image.storage_path || null,
    mime_type: image.mime_type || null,
    file_size: Number(image.file_size) || null,
    width: Number(image.width) || null,
    height: Number(image.height) || null,
  };

  if (isPersistedImageId(image.id)) {
    record.id = image.id;
  }

  return record;
}

async function fetchHydratedProduct(productId, drops) {
  const [productRes, variantsRes, imagesRes] = await Promise.all([
    supabase.from("products").select("*").eq("id", productId).maybeSingle(),
    supabase.from("product_variants").select("*").eq("product_id", productId),
    supabase.from("product_images").select("*").eq("product_id", productId).order("sort_order", { ascending: true }),
  ]);

  if (productRes.error || variantsRes.error || imagesRes.error || !productRes.data) {
    throw productRes.error || variantsRes.error || imagesRes.error || new Error("Unable to reload the saved product.");
  }

  return hydrateProduct(
    {
      ...productRes.data,
      variants: variantsRes.data ?? [],
      images: imagesRes.data ?? [],
    },
    drops
  );
}


function ProductsProvider({ children }) {
  const [drops, setDrops] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      if (isMounted) {
        setLoading(true);
        setError("");
      }

      if (!isSupabaseConfigured || !supabase || !supabase.from) {
        if (isMounted) {
          setDrops([]);
          setProducts([]);
          setError(
            "Supabase is not configured. Set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY to load products."
          );
          setLoading(false);
        }
        return;
      }

      try {
        const [dropsRes, productsRes, variantsRes, imagesRes] = await Promise.all([
          supabase.from("drops").select("*"),
          supabase.from("products").select("*"),
          supabase.from("product_variants").select("*"),
          supabase.from("product_images").select("*"),
        ]);

        if (
          dropsRes.error ||
          productsRes.error ||
          variantsRes.error ||
          imagesRes.error
        ) {
          throw dropsRes.error || productsRes.error || variantsRes.error || imagesRes.error;
        }

        const data = {
          drops: dropsRes.data ?? [],
          products: productsRes.data ?? [],
          product_variants: variantsRes.data ?? [],
          product_images: imagesRes.data ?? [],
        };
        const initialDrops = buildDrops(data);
        if (isMounted) {
          setDrops(initialDrops);
          setProducts(buildProducts(data, initialDrops));
          setError("");
          setLoading(false);
        }
      } catch (e) {
        if (isMounted) {
          setDrops([]);
          setProducts([]);
          setError(formatSupabaseError(e));
          setLoading(false);
        }
      }
    }
    fetchData();
    return () => {
      isMounted = false;
    };
  }, [reloadKey]);

  const refresh = useCallback(() => {
    setReloadKey((currentReloadKey) => currentReloadKey + 1);
  }, []);


  const createProduct = useCallback(async (productDraft) => {
    const nextProduct = hydrateProduct(cloneProduct(productDraft), drops);

    if (!isSupabaseConfigured || !supabase || !supabase.from) {
      setProducts((currentProducts) => [nextProduct, ...currentProducts]);
      return nextProduct;
    }

    try {
      const { data: createdProduct, error: createProductError } = await supabase
        .from("products")
        .insert(serializeProductRecord(nextProduct))
        .select("*")
        .single();

      if (createProductError || !createdProduct) {
        throw createProductError || new Error("Unable to create the product.");
      }

      const createdProductId = createdProduct.id;
      const createdVariants = nextProduct.variants.map((variant) =>
        serializeVariantRecord(variant, createdProductId)
      );

      if (createdVariants.length) {
        const { error: variantsError } = await supabase
          .from("product_variants")
          .insert(createdVariants);

        if (variantsError) {
          throw variantsError;
        }
      }

      const uploadedImages = await uploadPendingImages(nextProduct.images, createdProductId);

      if (uploadedImages.length) {
        const { error: imageInsertError } = await supabase
          .from("product_images")
          .insert(uploadedImages.map((image, index) => serializeImageRecord(image, createdProductId, index)));

        if (imageInsertError) {
          await deleteStorageObjects(uploadedImages);
          throw imageInsertError;
        }
      }

      const persistedProduct = await fetchHydratedProduct(createdProductId, drops);
      setProducts((currentProducts) => [persistedProduct, ...currentProducts]);
      setError("");
      return persistedProduct;
    } catch (persistError) {
      setError(formatSupabaseError(persistError));
      throw persistError;
    }
  }, [drops]);

  const updateProduct = useCallback(async (productId, productDraft) => {
    const sourceProduct = products.find((product) => product.id === productId) ?? null;
    const nextProduct = hydrateProduct(cloneProduct(productDraft), drops);

    setProducts((currentProducts) =>
      currentProducts.map((product) =>
        product.id === productId ? nextProduct : product
      )
    );

    if (isSupabaseConfigured && supabase && supabase.from) {
      try {
        const removedVariantIds = sourceProduct
          ? sourceProduct.variants
              .filter(
                (sourceVariant) =>
                  !nextProduct.variants.some((draftVariant) => draftVariant.id === sourceVariant.id)
              )
              .map((variant) => variant.id)
          : [];
        const removedImageIds = sourceProduct
          ? sourceProduct.images
              .filter(
                (sourceImage) =>
                  isPersistedImageId(sourceImage.id) &&
                  !nextProduct.images.some((draftImage) => draftImage.id === sourceImage.id)
              )
              .map((image) => image.id)
          : [];
        const removedImages = sourceProduct
          ? sourceProduct.images.filter(
              (sourceImage) =>
                isPersistedImageId(sourceImage.id) &&
                !nextProduct.images.some((draftImage) => draftImage.id === sourceImage.id)
            )
          : [];
        const persistedVariants = nextProduct.variants.filter((variant) => isPersistedRecordId(variant.id));
        const newVariants = nextProduct.variants.filter((variant) => !isPersistedRecordId(variant.id));

        const { error: productError } = await supabase
          .from("products")
          .update(serializeProductRecord(nextProduct))
          .eq("id", productId);

        if (productError) {
          throw productError;
        }

        if (removedVariantIds.length) {
          const { error: deleteVariantsError } = await supabase
            .from("product_variants")
            .delete()
            .in("id", removedVariantIds);

          if (deleteVariantsError) {
            throw deleteVariantsError;
          }
        }

        await deleteStorageObjects(removedImages);

        if (removedImageIds.length) {
          const { error: deleteImagesError } = await supabase
            .from("product_images")
            .delete()
            .in("id", removedImageIds);

          if (deleteImagesError) {
            throw deleteImagesError;
          }
        }

        if (persistedVariants.length) {
          const { error: variantsError } = await supabase
            .from("product_variants")
            .upsert(persistedVariants.map((variant) => serializeVariantRecord(variant, productId, { includeId: true })), {
              onConflict: "id",
            });

          if (variantsError) {
            throw variantsError;
          }
        }

        if (newVariants.length) {
          const { error: insertVariantsError } = await supabase
            .from("product_variants")
            .insert(newVariants.map((variant) => serializeVariantRecord(variant, productId)));

          if (insertVariantsError) {
            throw insertVariantsError;
          }
        }

        const uploadedImages = await uploadPendingImages(nextProduct.images, productId);

        if (uploadedImages.length) {
          const persistedImageCount = nextProduct.images.filter((image) => isPersistedImageId(image.id)).length;
          const { error: imageInsertError } = await supabase
            .from("product_images")
            .insert(
              uploadedImages.map((image, index) =>
                serializeImageRecord(image, productId, persistedImageCount + index)
              )
            );

          if (imageInsertError) {
            await deleteStorageObjects(uploadedImages);
            throw imageInsertError;
          }
        }

        const persistedProduct = await fetchHydratedProduct(productId, drops);
        setProducts((currentProducts) =>
          currentProducts.map((product) =>
            product.id === productId ? persistedProduct : product
          )
        );

        setError("");
        return persistedProduct;
      } catch (persistError) {
        if (sourceProduct) {
          setProducts((currentProducts) =>
            currentProducts.map((product) =>
              product.id === productId ? sourceProduct : product
            )
          );
        }

        setError(formatSupabaseError(persistError));
        throw persistError;
      }
    }

    return nextProduct;
  }, [drops, products]);

  const removeProduct = useCallback(async (productId) => {
    const sourceProduct = products.find((product) => product.id === productId) ?? null;

    if (isSupabaseConfigured && supabase && supabase.from) {
      try {
        if (sourceProduct) {
          await deleteStorageObjects(sourceProduct.images);
        }

        const { error: deleteImagesError } = await supabase
          .from("product_images")
          .delete()
          .eq("product_id", productId);

        if (deleteImagesError) {
          throw deleteImagesError;
        }

        const { error: deleteVariantsError } = await supabase
          .from("product_variants")
          .delete()
          .eq("product_id", productId);

        if (deleteVariantsError) {
          throw deleteVariantsError;
        }

        const { error: deleteProductError } = await supabase
          .from("products")
          .delete()
          .eq("id", productId);

        if (deleteProductError) {
          throw deleteProductError;
        }

        setError("");
      } catch (persistError) {
        setError(formatSupabaseError(persistError));
        throw persistError;
      }
    }

    setProducts((currentProducts) =>
      currentProducts.filter((product) => product.id !== productId)
    );
  }, [products]);

  const createDrop = useCallback((dropDraft) => {
    const nextDrop = cloneDrop(dropDraft);
    setDrops((currentDrops) => [nextDrop, ...currentDrops]);
    return nextDrop;
  }, []);

  const updateDrop = useCallback((dropId, dropDraft) => {
    const nextDrop = cloneDrop(dropDraft);

    setDrops((currentDrops) => {
      const nextDrops = currentDrops.map((drop) =>
        drop.id === dropId ? nextDrop : drop
      );

      setProducts((currentProducts) => refreshProductsWithDrops(currentProducts, nextDrops));

      return nextDrops;
    });

    return nextDrop;
  }, []);

  const removeDrop = useCallback(async (dropId) => {
    if (isSupabaseConfigured) {
      const { error: unassignError } = await supabase
        .from("products")
        .update({ drop_id: null })
        .eq("drop_id", dropId);

      if (unassignError) {
        throw unassignError;
      }

      const { error: deleteError } = await supabase.from("drops").delete().eq("id", dropId);

      if (deleteError) {
        throw deleteError;
      }
    }

    setDrops((currentDrops) => {
      const nextDrops = currentDrops.filter((drop) => drop.id !== dropId);

      setProducts((currentProducts) =>
        refreshProductsWithDrops(
          currentProducts.map((product) =>
            product.drop_id === dropId
              ? {
                  ...product,
                  drop_id: "",
                }
              : product
          ),
          nextDrops
        )
      );

      return nextDrops;
    });
  }, []);


  // The create/update/remove functions are stable and do not change between renders
  const value = useMemo(
    () => ({
      products,
      drops,
      loading,
      error,
      getProductById: (productId) =>
        products.find((product) => product.id === productId) ?? null,
      getDropById: (dropId) => drops.find((drop) => drop.id === dropId) ?? null,
      refresh,
      createProduct,
      updateProduct,
      removeProduct,
      createDrop,
      updateDrop,
      removeDrop,
    }),
    [
      createDrop,
      createProduct,
      drops,
      error,
      loading,
      products,
      refresh,
      removeDrop,
      removeProduct,
      updateDrop,
      updateProduct,
    ]
  );

  return (
    <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductsContext);

  if (!context) {
    throw new Error("useProducts must be used within ProductsProvider");
  }

  return context;
}

export default ProductsProvider;