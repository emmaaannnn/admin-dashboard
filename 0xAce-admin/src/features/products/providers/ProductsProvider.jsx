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

  const updateProduct = useCallback((productId, productDraft) => {
    const nextProduct = hydrateProduct(cloneProduct(productDraft), drops);

    setProducts((currentProducts) =>
      currentProducts.map((product) =>
        product.id === productId ? nextProduct : product
      )
    );

    return nextProduct;
  }, [drops]);

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