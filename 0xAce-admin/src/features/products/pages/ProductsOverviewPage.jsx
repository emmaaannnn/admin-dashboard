import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAdminShell } from "../../../app/providers/AdminShellProvider";
import ProductStats from "../components/ProductStats";
import ProductTable from "../components/ProductTable";
import { cloneProduct, getInventoryStatus } from "../lib/productsState";
import { useProducts } from "../providers/ProductsProvider";
import "./ProductsOverviewPage.css";

function matchesSearch(product, query) {
  return [
    product.name,
    product.slug,
    product.dropName,
    product.inventoryState,
    ...product.variants.map((variant) => variant.sku),
  ]
    .join(" ")
    .toLowerCase()
    .includes(query);
}

function ProductsOverviewPage() {
  const { searchQuery } = useAdminShell();
  const { products, drops, removeProduct, updateProduct } = useProducts();
  const [activeFilter, setActiveFilter] = useState("all");
  const [viewMode, setViewMode] = useState("full");
  const [selectedDropId, setSelectedDropId] = useState("all");
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id ?? null);
  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredProducts = products.filter((product) => {
    const matchesQuery = normalizedQuery ? matchesSearch(product, normalizedQuery) : true;
    const matchesFilter =
      activeFilter === "all" ? true : product.inventoryState === activeFilter;
    const matchesDrop = selectedDropId === "all" ? true : product.drop_id === selectedDropId;

    return matchesQuery && matchesFilter && matchesDrop;
  });

  useEffect(() => {
    if (!filteredProducts.length) {
      setSelectedProductId(null);
      return;
    }

    const selectionStillVisible = filteredProducts.some(
      (product) => product.id === selectedProductId
    );

    if (!selectionStillVisible) {
      setSelectedProductId(filteredProducts[0].id);
    }
  }, [filteredProducts, selectedProductId, viewMode]);

  const totalInventory = products.reduce(
    (total, product) => total + product.inventoryCount,
    0
  );
  const activeListings = products.filter((product) => product.status === "active").length;
  const inStockCount = products.filter(
    (product) => product.inventoryState === "in_stock"
  ).length;
  const soldOutCount = products.filter(
    (product) => product.inventoryState === "out_of_stock"
  ).length;
  const archivedCount = products.filter((product) => product.status === "archived").length;
  const statCards = [
    {
      id: "all",
      label: "All products",
      value: products.length,
      meta: `${totalInventory} total units`,
    },
    {
      id: "in_stock",
      label: "In stock",
      value: inStockCount,
      meta: `${activeListings} active listings`,
    },
    {
      id: "out_of_stock",
      label: "Out of stock",
      value: soldOutCount,
      meta: "Needs attention",
      tone: "warning",
    },
    {
      id: "archived",
      label: "Archived",
      value: archivedCount,
      meta: "Hidden from storefront",
    },
  ];

  const handleQuickProductChange = (productId, field, value) => {
    const sourceProduct = products.find((product) => product.id === productId);

    if (!sourceProduct) {
      return;
    }

    updateProduct(productId, {
      ...cloneProduct(sourceProduct),
      [field]: value,
    });
  };

  const handleQuickVariantChange = (productId, variantId, field, value) => {
    const sourceProduct = products.find((product) => product.id === productId);

    if (!sourceProduct) {
      return;
    }

    updateProduct(productId, {
      ...cloneProduct(sourceProduct),
      variants: sourceProduct.variants.map((variant) => {
        if (variant.id !== variantId) {
          return variant;
        }

        if (field === "inventory_quantity") {
          const quantity = Math.max(0, Number(value) || 0);

          return {
            ...variant,
            inventory_quantity: quantity,
            inventory_status: getInventoryStatus(quantity),
          };
        }

        if (field === "price_aud" || field === "compare_at_price_aud") {
          return {
            ...variant,
            [field]: value === "" ? null : Math.max(0, Number(value) || 0),
          };
        }

        return {
          ...variant,
          [field]: value,
        };
      }),
    });
  };

  return (
    <div className="page-stack products-overview-page">
      <section className="products-overview-toolbar">
        <div>
          <p className="section-kicker">Products overview</p>
          <h2 className="products-overview-toolbar__title">Catalog workspace</h2>
          <p className="page-copy products-overview-toolbar__copy">
            {searchQuery
              ? `${filteredProducts.length} products matched the current search.`
              : "See all products, filter by collection, and move between full-page editing and quick editing without losing context."}
          </p>
        </div>

        <div className="products-overview-toolbar__actions">
          <label className="products-drop-filter" htmlFor="products-drop-filter">
            <span className="products-drop-filter__label">Collection</span>
            <select
              id="products-drop-filter"
              className="products-drop-filter__select"
              value={selectedDropId}
              onChange={(event) => setSelectedDropId(event.target.value)}
            >
              <option value="all">All collections</option>
              {drops.map((drop) => (
                <option key={drop.id} value={drop.id}>
                  {drop.name}
                </option>
              ))}
            </select>
          </label>
          <Link to="/products/drops" className="secondary-button products-button--compact">
            Edit Drops
          </Link>
          <Link to="/products/new" className="primary-button products-button--compact">
            New Product
          </Link>
        </div>
      </section>

      <ProductStats
        cards={statCards}
        activeFilter={activeFilter}
        onSelectFilter={setActiveFilter}
      />

      <section className="data-card products-overview-section">
        <div className="data-card__header products-overview-section__header">
          <div>
            <p className="data-card__eyebrow">Products</p>
            <h3>All products</h3>
          </div>
          <div className="products-overview-section__controls">
            <span className="products-overview-section__meta">{filteredProducts.length} visible</span>
            <div className="products-view-toggle" aria-label="Product row mode">
              <button
                type="button"
                className={`products-view-toggle__button${viewMode === "full" ? " is-active" : ""}`}
                onClick={() => setViewMode("full")}
              >
                Full Page
              </button>
              <button
                type="button"
                className={`products-view-toggle__button${viewMode === "quick" ? " is-active" : ""}`}
                onClick={() => setViewMode("quick")}
              >
                Quick Edit
              </button>
            </div>
          </div>
        </div>

        <ProductTable
          products={filteredProducts}
          drops={drops}
          viewMode={viewMode}
          selectedProductId={selectedProductId}
          onSelectProduct={setSelectedProductId}
          onQuickProductChange={handleQuickProductChange}
          onQuickVariantChange={handleQuickVariantChange}
          onRemoveProduct={removeProduct}
        />
      </section>
    </div>
  );
}

export default ProductsOverviewPage;