import { createContext, useContext, useMemo, useState } from "react";
import mockSupabaseData from "../../../data/mock/supabaseData";
import {
  buildDrops,
  buildProducts,
  cloneDrop,
  cloneProduct,
  hydrateProduct,
  refreshProductsWithDrops,
} from "../lib/productsState";

const ProductsContext = createContext(null);

function ProductsProvider({ children }) {
  const [drops, setDrops] = useState(() => buildDrops(mockSupabaseData));
  const [products, setProducts] = useState(() => {
    const initialDrops = buildDrops(mockSupabaseData);
    return buildProducts(mockSupabaseData, initialDrops);
  });

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

  const value = useMemo(
    () => ({
      products,
      drops,
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
    [drops, products]
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