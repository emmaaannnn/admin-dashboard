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
        <div className="variant-table__header">
          <span>SKU</span>
          <span>Color</span>
          <span>Size</span>
          <span className="variant-table__header-price">Price</span>
          <span className="variant-table__header-compare">Compare</span>
          <span className="variant-table__header-stock">Stock</span>
          <span className="variant-table__header-status">Status</span>
          <span className="variant-table__header-delete">Action</span>
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
            <div className="variant-table__status">
              {isVariantOnSale(variant) ? <span className="status-pill status-pill--sale">Sale</span> : null}
              <span className={`status-pill status-pill--${variant.inventory_status}`}>
                {variant.inventory_status.replace("_", " ")}
              </span>
            </div>
            <div className="variant-table__delete-cell">
              <button
                type="button"
                className="danger-button variant-table__delete-button"
                aria-label={`Delete variant ${variant.sku || `${variant.color} ${variant.size}`}`}
                onClick={() => onDeleteVariant(variant.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ProductVariantTable;