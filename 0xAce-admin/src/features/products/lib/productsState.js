export const LOW_STOCK_THRESHOLD = 4;

export function getProductFitLabel(product) {
  const sizes = Array.from(
    new Set(
      (product?.variants ?? [])
        .map((variant) => variant.size)
        .filter(Boolean)
    )
  );

  if (!sizes.length) {
    return "One size";
  }

  return `Available sizes: ${sizes.join(", ")}`;
}

function normalizeSizeGuide(sizeGuide) {
  if (!sizeGuide || sizeGuide === "null") {
    return {
      fit: "One size",
      note: "No size guide provided.",
    };
  }

  if (typeof sizeGuide === "string") {
    try {
      const parsedSizeGuide = JSON.parse(sizeGuide);
      const availableSizes = Array.isArray(parsedSizeGuide?.available_sizes)
        ? parsedSizeGuide.available_sizes.filter(Boolean)
        : [];

      return {
        fit: availableSizes.length ? `Available sizes: ${availableSizes.join(", ")}` : "Size guide available",
        note: availableSizes.length
          ? "Sizing imported from mock data. Edit for detailed fit guidance."
          : "No size guide provided.",
      };
    } catch {
      return {
        fit: "Size guide available",
        note: sizeGuide,
      };
    }
  }

  return {
    fit: sizeGuide.fit ?? "Standard fit",
    note: sizeGuide.note ?? "No size guide provided.",
  };
}

export function getInventoryStatus(quantity) {
  if (quantity <= 0) {
    return "sold_out";
  }

  if (quantity <= LOW_STOCK_THRESHOLD) {
    return "low_stock";
  }

  return "in_stock";
}

export function isVariantOnSale(variant) {
  const price = Number(variant.price_aud);
  const compareAtPrice = Number(variant.compare_at_price_aud);

  return Number.isFinite(price) && Number.isFinite(compareAtPrice) && compareAtPrice > price;
}

export function isProductOnSale(product) {
  return product.variants.some((variant) => isVariantOnSale(variant));
}

export function cloneProduct(product) {
  return {
    ...product,
    subtitle: product.subtitle ?? "",
    description: product.description ?? "",
    size_guide: normalizeSizeGuide(product.size_guide),
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
      subtitle: "",
      description: "",
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

export function createEmptyVariant(productId, variantCount = 0) {
  const timestamp = Date.now();

  return {
    id: `variant-${timestamp}-${variantCount + 1}`,
    product_id: productId,
    sku: `SKU-${variantCount + 1}`,
    color: "Core",
    size: "M",
    price_aud: 0,
    compare_at_price_aud: null,
    inventory_quantity: 0,
    inventory_status: "sold_out",
  };
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