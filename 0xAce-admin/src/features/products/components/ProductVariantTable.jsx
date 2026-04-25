import { isVariantOnSale } from "../lib/productsState";
import "./styles/ProductVariantTable.css";

function ProductVariantTable({ variants, onVariantChange, onAddVariant }) {
  return (
    <section className="variants-card">
      <div className="variants-card__header">
        <div>
          <h3>Product Variants</h3>
          <span className="variants-card__copy">Inventory and pricing</span>
        </div>
        <button type="button" className="utility-button" onClick={onAddVariant}>
          Add Variant
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
            <input
              className="variant-table__text-input variant-table__text-input--strong"
              type="text"
              value={variant.sku}
              onChange={(event) => onVariantChange(variant.id, "sku", event.target.value)}
            />
            <input
              className="variant-table__text-input"
              type="text"
              value={variant.color}
              onChange={(event) => onVariantChange(variant.id, "color", event.target.value)}
            />
            <input
              className="variant-table__text-input"
              type="text"
              value={variant.size}
              onChange={(event) => onVariantChange(variant.id, "size", event.target.value)}
            />
            <label className="variant-table__input-shell">
              <span className="variant-table__input-prefix">$</span>
              <input
                className="variant-table__input"
                type="number"
                min="0"
                step="1"
                value={variant.price_aud}
                onChange={(event) =>
                  onVariantChange(variant.id, "price_aud", event.target.value)
                }
              />
            </label>
            <label className="variant-table__input-shell">
              <span className="variant-table__input-prefix">$</span>
              <input
                className="variant-table__input"
                type="number"
                min="0"
                step="1"
                value={variant.compare_at_price_aud ?? ""}
                placeholder="-"
                onChange={(event) =>
                  onVariantChange(variant.id, "compare_at_price_aud", event.target.value)
                }
              />
            </label>
            <div className="variant-stepper">
              <button
                type="button"
                className="variant-stepper__button"
                onClick={() =>
                  onVariantChange(
                    variant.id,
                    "inventory_quantity",
                    Math.max(0, variant.inventory_quantity - 1)
                  )
                }
              >
                -
              </button>
              <input
                className="variant-stepper__input"
                type="number"
                min="0"
                value={variant.inventory_quantity}
                onChange={(event) =>
                  onVariantChange(variant.id, "inventory_quantity", event.target.value)
                }
              />
              <button
                type="button"
                className="variant-stepper__button"
                onClick={() =>
                  onVariantChange(
                    variant.id,
                    "inventory_quantity",
                    variant.inventory_quantity + 1
                  )
                }
              >
                +
              </button>
            </div>
            <div className="variant-table__status">
              {isVariantOnSale(variant) ? <span className="status-pill status-pill--sale">Sale</span> : null}
              <span className={`status-pill status-pill--${variant.inventory_status}`}>
                {variant.inventory_status.replace("_", " ")}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ProductVariantTable;