import { createContext, useContext, useMemo, useEffect, useState } from "react";
import mockSupabaseData from "../../../data/mock/supabaseData";
import {
  buildDrops,
  buildProducts,
  cloneDrop,
  cloneProduct,
  hydrateProduct,
  refreshProductsWithDrops,
} from "../lib/productsState";
import supabase from "../../../shared/lib/supabaseClient";

const ProductsContext = createContext(null);


function ProductsProvider({ children }) {
  const [drops, setDrops] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      // If supabase is not configured, use mock data
      if (!supabase || !supabase.from) {
        const initialDrops = buildDrops(mockSupabaseData);
        if (isMounted) {
          setDrops(initialDrops);
          setProducts(buildProducts(mockSupabaseData, initialDrops));
          setLoading(false);
        }
        return;
      }

      // Fetch from Supabase
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
          // fallback to mock data if any error
          const initialDrops = buildDrops(mockSupabaseData);
          if (isMounted) {
            setDrops(initialDrops);
            setProducts(buildProducts(mockSupabaseData, initialDrops));
            setLoading(false);
          }
          return;
        }

        // Compose data in the same structure as mockSupabaseData
        const data = {
          drops: dropsRes.data,
          products: productsRes.data,
          product_variants: variantsRes.data,
          product_images: imagesRes.data,
        };
        const initialDrops = buildDrops(data);
        if (isMounted) {
          setDrops(initialDrops);
          setProducts(buildProducts(data, initialDrops));
          setLoading(false);
        }
      } catch (e) {
        // fallback to mock data on error
        const initialDrops = buildDrops(mockSupabaseData);
        if (isMounted) {
          setDrops(initialDrops);
          setProducts(buildProducts(mockSupabaseData, initialDrops));
          setLoading(false);
        }
      }
    }
    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);


  // The following create/update/remove methods only update local state.
  // For full Supabase integration, you would also add DB mutations here.
  const createProduct = (productDraft) => {
    const nextProduct = hydrateProduct(cloneProduct(productDraft), drops);
    setProducts((currentProducts) => [nextProduct, ...currentProducts]);
    return nextProduct;
  };

  const updateProduct = (productId, productDraft) => {
    const nextProduct = hydrateProduct(cloneProduct(productDraft), drops);

    setProducts((currentProducts) =>
      currentProducts.map((product) =>
        product.id === productId ? nextProduct : product
      )
    );

    return nextProduct;
  };

  const removeProduct = (productId) => {
    setProducts((currentProducts) =>
      currentProducts.filter((product) => product.id !== productId)
    );
  };

  const createDrop = (dropDraft) => {
    const nextDrop = cloneDrop(dropDraft);
    setDrops((currentDrops) => [nextDrop, ...currentDrops]);
    return nextDrop;
  };

  const updateDrop = (dropId, dropDraft) => {
    const nextDrop = cloneDrop(dropDraft);

    setDrops((currentDrops) => {
      const nextDrops = currentDrops.map((drop) =>
        drop.id === dropId ? nextDrop : drop
      );

      setProducts((currentProducts) => refreshProductsWithDrops(currentProducts, nextDrops));

      return nextDrops;
    });

    return nextDrop;
  };

  const removeDrop = (dropId) => {
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
  };


  // The create/update/remove functions are stable and do not change between renders
  const value = useMemo(
    () => ({
      products,
      drops,
      loading,
      getProductById: (productId) =>
        products.find((product) => product.id === productId) ?? null,
      getDropById: (dropId) => drops.find((drop) => drop.id === dropId) ?? null,
      createProduct,
      updateProduct,
      removeProduct,
      createDrop,
      updateDrop,
      removeDrop,
    }),
    [drops, products, loading]
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