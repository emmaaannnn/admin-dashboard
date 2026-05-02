import { isVariantOnSale } from "../lib/productsState";
import "./styles/ProductVariantTable.css";

function ProductVariantTable({ variants, onVariantChange, onAddVariant, onDeleteVariant }) {
  return (
    <section className="variants-card">
      <div className="variants-card__header">
        <div>
          <h3>Product Variants</h3>
          <span className="variants-card__copy">Inventory and pricing</span>
        </div>
        <button type="button" className="utility-button variant-table__action-button" onClick={onAddVariant}>
          Add Variant
        </button>
      </div>

      <div className="variant-table">
        {variants.map((variant, index) => (
          <div
            key={variant.id}
            className={`variant-table__row ${index === 0 ? "variant-table__row--with-labels" : ""}`.trim()}
          >
            <div className="variant-table__field">
              <span className="variant-table__field-label">SKU</span>
              <input
                className="variant-table__text-input variant-table__text-input--strong"
                type="text"
                value={variant.sku}
                onChange={(event) => onVariantChange(variant.id, "sku", event.target.value)}
              />
            </div>
            <div className="variant-table__field">
              <span className="variant-table__field-label">Color</span>
              <input
                className="variant-table__text-input"
                type="text"
                value={variant.color}
                onChange={(event) => onVariantChange(variant.id, "color", event.target.value)}
              />
            </div>
            <div className="variant-table__field">
              <span className="variant-table__field-label">Size</span>
              <input
                className="variant-table__text-input"
                type="text"
                value={variant.size}
                onChange={(event) => onVariantChange(variant.id, "size", event.target.value)}
              />
            </div>
            <div className="variant-table__field">
              <span className="variant-table__field-label variant-table__field-label--center">Price</span>
              <label className="variant-table__input-shell variant-table__price-cell">
                <span className="variant-table__input-prefix">$</span>
                <input
                  className="variant-table__input variant-table__input--no-spin"
                  type="number"
                  min="0"
                  step="1"
                  value={variant.price_aud}
                  onChange={(event) =>
                    onVariantChange(variant.id, "price_aud", event.target.value)
                  }
                  inputMode="numeric"
                  pattern="[0-9]*"
                />
              </label>
            </div>
            <div className="variant-table__field">
              <span className="variant-table__field-label variant-table__field-label--center">Compare</span>
              <label className="variant-table__input-shell variant-table__compare-cell">
                <span className="variant-table__input-prefix">$</span>
                <input
                  className="variant-table__input variant-table__input--no-spin"
                  type="number"
                  min="0"
                  step="1"
                  value={variant.compare_at_price_aud ?? ""}
                  placeholder="-"
                  onChange={(event) =>
                    onVariantChange(variant.id, "compare_at_price_aud", event.target.value)
                  }
                  inputMode="numeric"
                  pattern="[0-9]*"
                />
              </label>
            </div>
            <div className="variant-table__field">
              <span className="variant-table__field-label variant-table__field-label--center">Stock</span>
              <div className="variant-stepper variant-table__stock-cell">
                <button
                  type="button"
                  className="variant-stepper__button"
                  aria-label={`Decrease stock for ${variant.sku || `${variant.color} ${variant.size}`}`}
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
                  className="variant-stepper__input variant-table__input--no-spin"
                  type="number"
                  min="0"
                  value={variant.inventory_quantity}
                  onChange={(event) =>
                    onVariantChange(variant.id, "inventory_quantity", event.target.value)
                  }
                  inputMode="numeric"
                  pattern="[0-9]*"
                />
                <button
                  type="button"
                  className="variant-stepper__button"
                  aria-label={`Increase stock for ${variant.sku || `${variant.color} ${variant.size}`}`}
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
            </div>
            <div className="variant-table__field">
              <span className="variant-table__field-label">Status</span>
              <div className="variant-table__status">
                {isVariantOnSale(variant) ? <span className="status-pill status-pill--sale">Sale</span> : null}
                <span className={`status-pill status-pill--${variant.inventory_status}`}>
                  {variant.inventory_status.replace("_", " ")}
                </span>
              </div>
            </div>
            <div className="variant-table__field variant-table__field--delete">
              <span className="variant-table__field-label variant-table__field-label--center">Action</span>
              <div className="variant-table__delete-cell">
                <button
                  type="button"
                  className="utility-button utility-button--danger variant-table__delete-button"
                  aria-label={`Delete variant ${variant.sku || `${variant.color} ${variant.size}`}`}
                  onClick={() => onDeleteVariant(variant.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ProductVariantTable;