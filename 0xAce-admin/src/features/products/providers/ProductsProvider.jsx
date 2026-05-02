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
  return {
    id: product.id,
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
}

function serializeVariantRecord(variant) {
  return {
    id: variant.id,
    product_id: variant.product_id,
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


  const createProduct = useCallback((productDraft) => {
    const nextProduct = hydrateProduct(cloneProduct(productDraft), drops);
    setProducts((currentProducts) => [nextProduct, ...currentProducts]);
    return nextProduct;
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

        if (nextProduct.variants.length) {
          const { error: variantsError } = await supabase
            .from("product_variants")
            .upsert(nextProduct.variants.map((variant) => serializeVariantRecord(variant)), {
              onConflict: "id",
            });

          if (variantsError) {
            throw variantsError;
          }
        }

        setError("");
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

  const removeProduct = useCallback((productId) => {
    setProducts((currentProducts) =>
      currentProducts.filter((product) => product.id !== productId)
    );
  }, []);

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