import { Link, useNavigate } from "react-router-dom";
import { formatMoney } from "../../../shared/lib/formatters";
import "./styles/ProductTable.css";

function getPriceLabel(variants) {
  const prices = variants.map((variant) => variant.price_aud);
  const minimum = Math.min(...prices);
  const maximum = Math.max(...prices);

  if (minimum === maximum) {
    return formatMoney(minimum);
  }

  return `${formatMoney(minimum)} - ${formatMoney(maximum)}`;
}

function ProductTable({
  products,
  drops,
  viewMode,
  selectedProductId,
  onSelectProduct,
  onQuickProductChange,
  onQuickVariantChange,
  onRemoveProduct,
}) {
  const navigate = useNavigate();

  if (!products.length) {
    return (
      <section className="product-catalog product-catalog--empty">
        <p className="page-copy">No products match the current search or filter.</p>
      </section>
    );
  }

  return (
    <section className="product-catalog">
      <header className="product-catalog__header">
        <span>Product detail</span>
        <span>Drop</span>
        <span>Variants</span>
        <span>Price</span>
        <span>Status</span>
        <span />
      </header>

      {products.map((product) => (
        <article key={product.id} className="product-row">
          <button
            type="button"
            className={`product-row__summary${selectedProductId === product.id ? " is-selected" : ""}`}
            onClick={() => {
              if (viewMode === "quick") {
                onSelectProduct(selectedProductId === product.id ? null : product.id);
                return;
              }

              navigate(`/products/${product.id}`);
            }}
            aria-expanded={viewMode === "quick" && selectedProductId === product.id}
          >
            <div className="product-row__detail">
              <div className="product-row__image-frame">
                {product.images[0] ? (
                  <img src={product.images[0].image_url} alt={product.name} className="product-row__image" />
                ) : (
                  <div className="product-row__image product-row__image--placeholder" />
                )}
              </div>

              <div className="product-row__copy">
                <div className="product-row__copy-top">
                  <h3>{product.name}</h3>
                  <span className="product-row__slug">/{product.slug}</span>
                </div>
                <div className="product-row__meta-line">
                  <span>{product.size_guide.fit}</span>
                  <span>{product.inventoryCount} units</span>
                </div>
              </div>
            </div>

            <div>{product.dropName}</div>
            <div className="product-row__variant-preview">
              {product.variants.map((variant) => (
                <span key={variant.id} className="product-row__variant-chip">
                  {variant.size} {variant.inventory_quantity}
                </span>
              ))}
            </div>
            <div>{product.variants.length ? getPriceLabel(product.variants) : "N/A"}</div>
            <div>
              <span className={`status-pill status-pill--${product.inventoryState === "out_of_stock" ? "sold_out" : product.inventoryState === "in_stock" ? "in_stock" : product.status}`}>
                {product.inventoryState.replace("_", " ")}
              </span>
            </div>
            <div className="product-row__indicator">
              {viewMode === "quick" ? (selectedProductId === product.id ? "-" : "+") : ">"}
            </div>
          </button>

          {viewMode === "quick" && selectedProductId === product.id ? (
            <div className="product-row__expanded">
              <div className="product-row__expanded-top">
                <label className="product-row__field">
                  <span>Status</span>
                  <select
                    value={product.status}
                    onChange={(event) =>
                      onQuickProductChange(product.id, "status", event.target.value)
                    }
                  >
                    <option value="active">Active</option>
                    <option value="archived">Archived</option>
                  </select>
                </label>

                <label className="product-row__field">
                  <span>Drop</span>
                  <select
                    value={product.drop_id}
                    onChange={(event) =>
                      onQuickProductChange(product.id, "drop_id", event.target.value)
                    }
                  >
                    {drops.map((drop) => (
                      <option key={drop.id} value={drop.id}>
                        {drop.name}
                      </option>
                    ))}
                  </select>
                </label>

                <div className="product-row__expanded-actions">
                  <Link to={`/products/${product.id}`} className="utility-button">
                    Full page
                  </Link>
                  <button
                    type="button"
                    className="utility-button utility-button--danger"
                    onClick={() => onRemoveProduct(product.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>

              <div className="product-row__quick-grid">
                <div className="product-row__quick-head">
                  <span>Variant</span>
                  <span>Price</span>
                  <span>Compare</span>
                  <span>Stock</span>
                  <span>Status</span>
                </div>

                {product.variants.map((variant) => (
                  <div key={variant.id} className="product-row__quick-item">
                    <div className="product-row__quick-label">
                      <strong>{variant.color}</strong>
                      <span>{variant.size} / {variant.sku}</span>
                    </div>

                    <label className="product-row__money-field">
                      <span>$</span>
                      <input
                        type="number"
                        min="0"
                        value={variant.price_aud}
                        onChange={(event) =>
                          onQuickVariantChange(product.id, variant.id, "price_aud", event.target.value)
                        }
                      />
                    </label>

                    <label className="product-row__money-field">
                      <span>$</span>
                      <input
                        type="number"
                        min="0"
                        value={variant.compare_at_price_aud ?? ""}
                        placeholder="-"
                        onChange={(event) =>
                          onQuickVariantChange(
                            product.id,
                            variant.id,
                            "compare_at_price_aud",
                            event.target.value
                          )
                        }
                      />
                    </label>

                    <div className="product-row__stock-stepper">
                      <button
                        type="button"
                        onClick={() =>
                          onQuickVariantChange(
                            product.id,
                            variant.id,
                            "inventory_quantity",
                            Math.max(0, variant.inventory_quantity - 1)
                          )
                        }
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="0"
                        value={variant.inventory_quantity}
                        onChange={(event) =>
                          onQuickVariantChange(
                            product.id,
                            variant.id,
                            "inventory_quantity",
                            event.target.value
                          )
                        }
                      />
                      <button
                        type="button"
                        onClick={() =>
                          onQuickVariantChange(
                            product.id,
                            variant.id,
                            "inventory_quantity",
                            variant.inventory_quantity + 1
                          )
                        }
                      >
                        +
                      </button>
                    </div>

                    <span className={`status-pill status-pill--${variant.inventory_status}`}>
                      {variant.inventory_status.replace("_", " ")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </article>
      ))}
    </section>
  );
}

export default ProductTable;