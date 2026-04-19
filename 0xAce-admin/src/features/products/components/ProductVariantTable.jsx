import { formatMoney } from "../../../shared/lib/formatters";
import "./ProductVariantTable.css";

function ProductVariantTable({ variants }) {
  return (
    <section className="variants-card">
      <div className="variants-card__header">
        <h3>Product Variants</h3>
        <button type="button" className="text-button">
          Bulk Edit Prices
        </button>
      </div>

      <div className="variant-table">
        <div className="variant-table__header">
          <span>SKU</span>
          <span>Color</span>
          <span>Size</span>
          <span>Price</span>
          <span>Compare</span>
          <span>Stock</span>
          <span>Status</span>
        </div>

        {variants.map((variant) => (
          <div key={variant.id} className="variant-table__row">
            <strong>{variant.sku}</strong>
            <span>{variant.color}</span>
            <span>{variant.size}</span>
            <span>{formatMoney(variant.price_aud)}</span>
            <span>{variant.compare_at_price_aud ? formatMoney(variant.compare_at_price_aud) : "-"}</span>
            <span>{variant.inventory_quantity}</span>
            <span className={`status-pill status-pill--${variant.inventory_status}`}>
              {variant.inventory_status.replace("_", " ")}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ProductVariantTable;