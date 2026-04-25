import ProductEditorCard from "./ProductEditorCard";
import ProductVariantTable from "./ProductVariantTable";
import { isProductOnSale } from "../lib/productsState";
import "./styles/ProductDetailsPane.css";

function ProductDetailsPane({
  product,
  drops,
  onProductChange,
  onSizeGuideChange,
  onVariantChange,
  onAddVariant,
  kicker = "Active selection",
  title = product.name,
}) {
  const productIsOnSale = isProductOnSale(product);

  return (
    <section className="detail-panel">
      <div className="detail-panel__header">
        <div>
          <p className="section-kicker">{kicker}</p>
          <h2>{title}</h2>
        </div>

        <div className="detail-actions">
          {productIsOnSale ? <span className="status-pill status-pill--sale">Sale</span> : null}
          <span className={`status-pill status-pill--${product.status}`}>
            {product.status}
          </span>
        </div>
      </div>

      <div className="detail-panel__grid">
        <ProductEditorCard title="General Information">
          <div className="editor-fields">
            <label className="field-stack">
              <span>Product name</span>
              <input
                className="editor-input"
                type="text"
                value={product.name}
                onChange={(event) => onProductChange("name", event.target.value)}
              />
            </label>

            <label className="field-stack">
              <span>Slug</span>
              <input
                className="editor-input"
                type="text"
                value={product.slug}
                onChange={(event) => onProductChange("slug", event.target.value)}
              />
            </label>

            <label className="field-stack">
              <span>Drop selection</span>
              <select
                className="editor-select"
                value={product.drop_id}
                onChange={(event) => onProductChange("drop_id", event.target.value)}
              >
                {drops.map((drop) => (
                  <option key={drop.id} value={drop.id}>
                    {drop.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="field-stack">
              <span>Status</span>
              <select
                className="editor-select"
                value={product.status}
                onChange={(event) => onProductChange("status", event.target.value)}
              >
                <option value="active">Active</option>
                <option value="archived">Archived</option>
              </select>
            </label>
          </div>
        </ProductEditorCard>

        <ProductEditorCard
          as="aside"
          title="Media"
          actionLabel="Upload New"
          className="editor-card--media"
        >
          <div className="media-grid">
            {product.images.map((image) => (
              <div key={image.id} className="media-thumb-frame">
                <img src={image.image_url} alt={product.name} className="media-thumb" />
              </div>
            ))}
            <div className="media-thumb-frame media-thumb-frame--empty">Add More</div>
          </div>
        </ProductEditorCard>

        <ProductEditorCard title="Size Guide">
          <div className="editor-fields">
            <label className="field-stack">
              <span>Fit type</span>
              <input
                className="editor-input"
                type="text"
                value={product.size_guide.fit}
                onChange={(event) => onSizeGuideChange("fit", event.target.value)}
              />
            </label>

            <label className="field-stack field-stack--wide">
              <span>Detailed fit note</span>
              <textarea
                className="editor-textarea"
                value={product.size_guide.note}
                onChange={(event) => onSizeGuideChange("note", event.target.value)}
                rows={4}
              />
            </label>
          </div>
        </ProductEditorCard>
      </div>

      <ProductVariantTable
        variants={product.variants}
        onVariantChange={onVariantChange}
        onAddVariant={onAddVariant}
      />
    </section>
  );
}

export default ProductDetailsPane;
