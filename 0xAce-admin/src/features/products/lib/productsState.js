export const LOW_STOCK_THRESHOLD = 4;

export function getInventoryStatus(quantity) {
  if (quantity <= 0) {
    return "sold_out";
  }

  if (quantity <= LOW_STOCK_THRESHOLD) {
    return "low_stock";
  }

  return "in_stock";
}

export function cloneProduct(product) {
  return {
    ...product,
    size_guide: { ...product.size_guide },
    variants: product.variants.map((variant) => ({ ...variant })),
    images: product.images.map((image) => ({ ...image })),
  };
}

export function cloneDrop(drop) {
  return {
    ...drop,
  };
}

export function getProductInventoryState(product) {
  if (product.status === "archived") {
    return "archived";
  }

  if (product.inventoryCount <= 0) {
    return "out_of_stock";
  }

  return "in_stock";
}

export function hydrateProduct(product, drops) {
  const drop = drops.find((entry) => entry.id === product.drop_id);
  const inventoryCount = product.variants.reduce(
    (total, variant) => total + variant.inventory_quantity,
    0
  );

  return {
    ...cloneProduct(product),
    dropName: drop ? drop.name : "Unassigned",
    inventoryCount,
    inventoryState: getProductInventoryState({
      ...product,
      inventoryCount,
    }),
  };
}

export function refreshProductsWithDrops(products, drops) {
  return products.map((product) => hydrateProduct(product, drops));
}

export function buildDrops(data) {
  return data.drops.map((drop) => cloneDrop(drop));
}

export function buildProducts(data, drops) {
  return data.products.map((product) => {
    const variants = data.product_variants.filter(
      (variant) => variant.product_id === product.id
    );
    const images = data.product_images.filter(
      (image) => image.product_id === product.id
    );

    return hydrateProduct(
      {
        ...product,
        variants,
        images,
      },
      drops
    );
  });
}

export function createEmptyProduct(drops, productCount) {
  const primaryDrop = drops[0];
  const timestamp = Date.now();
  const productId = `product-${timestamp}`;

  return hydrateProduct(
    {
      id: productId,
      drop_id: primaryDrop?.id ?? "",
      slug: `new-product-${productCount + 1}`,
      name: "New Product",
      status: "archived",
      size_guide: {
        fit: "Relaxed fit",
        note: "Add fit guidance for this product.",
      },
      images: [],
      variants: [
        {
          id: `variant-${timestamp}`,
          product_id: productId,
          sku: `NEW-${productCount + 1}`,
          color: "Core",
          size: "M",
          price_aud: 0,
          compare_at_price_aud: null,
          inventory_quantity: 0,
          inventory_status: "sold_out",
        },
      ],
    },
    drops
  );
}

export function createEmptyDrop(dropCount) {
  const timestamp = Date.now();

  return {
    id: `drop-${timestamp}`,
    slug: `drop-${dropCount + 1}`,
    name: "New Collection",
    state: "coming_soon",
    featured_on_home: false,
    launch_date: new Date().toISOString(),
  };
}