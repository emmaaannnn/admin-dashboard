import mockSupabaseData from "../../../data/mock/supabaseData";
import { useAdminShell } from "../../../app/providers/AdminShellProvider";
import ProductEditorCard from "../components/ProductEditorCard";
import ProductTable from "../components/ProductTable";
import ProductVariantTable from "../components/ProductVariantTable";
import "./ProductsPage.css";

function ProductsPage() {
  const { searchQuery } = useAdminShell();
  const products = mockSupabaseData.products.map((product) => {
    const drop = mockSupabaseData.drops.find((entry) => entry.id === product.drop_id);
    const variants = mockSupabaseData.product_variants.filter(
      (variant) => variant.product_id === product.id
    );
    const images = mockSupabaseData.product_images.filter(
      (image) => image.product_id === product.id
    );

    return {
      ...product,
      dropName: drop ? drop.name : "Unassigned",
      variants,
      images,
      inventoryCount: variants.reduce(
        (total, variant) => total + variant.inventory_quantity,
        0
      ),
    };
  });

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredProducts = normalizedQuery
    ? products.filter((product) => {
        const searchableText = [
          product.name,
          product.dropName,
          product.size_guide.fit,
          ...product.variants.map((variant) => variant.sku),
        ]
          .join(" ")
          .toLowerCase();

        return searchableText.includes(normalizedQuery);
      })
    : products;

  const selectedProduct = filteredProducts[0] ?? products[0];
  const activeListings = products.filter((product) => product.status === "active").length;
  const totalInventory = mockSupabaseData.product_variants.reduce(
    (total, variant) => total + variant.inventory_quantity,
    0
  );
  const soldOutCount = mockSupabaseData.product_variants.filter(
    (variant) => variant.inventory_status === "sold_out"
  ).length;

  return (
    <div className="page-stack">
      <section className="products-toolbar">
        <div>
          <p className="section-kicker">Collection overview</p>
          <h2 className="products-toolbar__title">
            {searchQuery ? `${filteredProducts.length} results in catalog` : "Spring/Summer Collection"}
          </h2>
        </div>

        <button type="button" className="primary-button">
          Add New Product
        </button>
      </section>

      <section className="products-stat-grid" aria-label="Inventory summary">
        <article className="metric-card">
          <span>Total inventory</span>
          <strong>{totalInventory}</strong>
        </article>
        <article className="metric-card">
          <span>Active listings</span>
          <strong>{activeListings}</strong>
        </article>
        <article className="metric-card metric-card--warning">
          <span>Out of stock</span>
          <strong>{soldOutCount}</strong>
        </article>
      </section>

      <ProductTable products={filteredProducts} />

      {selectedProduct ? (
        <section className="detail-panel">
        <div className="detail-panel__header">
          <div>
            <p className="section-kicker">Active selection</p>
            <h2>{selectedProduct.name}</h2>
          </div>

          <div className="detail-actions">
            <button type="button" className="secondary-button">Preview</button>
            <button type="button" className="primary-button">Save Changes</button>
          </div>
        </div>

        <div className="detail-panel__grid">
          <ProductEditorCard title="General Information">
            <div className="editor-fields">
              <div>
                <span>Product name</span>
                <strong>{selectedProduct.name}</strong>
              </div>
              <div>
                <span>Slug</span>
                <strong>/products/{selectedProduct.slug}</strong>
              </div>
              <div>
                <span>Drop selection</span>
                <strong>{selectedProduct.dropName}</strong>
              </div>
              <div>
                <span>Status</span>
                <strong>{selectedProduct.status}</strong>
              </div>
            </div>
          </ProductEditorCard>

          <ProductEditorCard
            as="aside"
            title="Media"
            actionLabel="Upload New"
            className="editor-card--media"
          >
            <div className="media-grid">
              {selectedProduct.images.map((image) => (
                <div key={image.id} className="media-thumb-frame">
                  <img src={image.image_url} alt={selectedProduct.name} className="media-thumb" />
                </div>
              ))}
              <div className="media-thumb-frame media-thumb-frame--empty">Add More</div>
            </div>
          </ProductEditorCard>

          <ProductEditorCard title="Size Guide">
            <div className="editor-fields">
              <div>
                <span>Fit type</span>
                <strong>{selectedProduct.size_guide.fit}</strong>
              </div>
              <div>
                <span>Detailed fit note</span>
                <strong>{selectedProduct.size_guide.note}</strong>
              </div>
            </div>
          </ProductEditorCard>
        </div>

        <ProductVariantTable variants={selectedProduct.variants} />
        </section>
      ) : (
        <section className="page-header-card">
          <p className="section-kicker">No matching products</p>
          <h2>Try another search term</h2>
          <p className="page-copy">
            Search by product name, SKU, drop name, or fit notes to narrow the catalog.
          </p>
        </section>
      )}
    </div>
  );
}

export default ProductsPage;