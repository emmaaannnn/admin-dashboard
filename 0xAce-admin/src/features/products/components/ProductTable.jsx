import { formatMoney } from "../../../shared/lib/formatters";
import "./ProductTable.css";

function ProductTable({ products }) {
  return (
    <section className="product-catalog">
      <header className="product-catalog__header">
        <span>Product detail</span>
        <span>SKU</span>
        <span>Price</span>
        <span>Status</span>
      </header>

      {products.map((product) => (
        <article key={product.id} className="product-row">
          <div className="product-row__detail">
            <div className="product-row__image-frame">
              {product.images[0] ? (
                <img src={product.images[0].image_url} alt={product.name} className="product-row__image" />
              ) : (
                <div className="product-row__image product-row__image--placeholder" />
              )}
            </div>

            <div>
              <h3>{product.name}</h3>
              <p>
                {product.dropName} / {product.size_guide.fit}
              </p>
            </div>
          </div>

          <div>{product.variants[0]?.sku ?? "No SKU"}</div>
          <div>{product.variants[0] ? formatMoney(product.variants[0].price_aud) : "N/A"}</div>
          <div>
            <span className={`status-pill status-pill--${product.status}`}>
              {product.status === "active" ? "In stock" : product.status}
            </span>
          </div>
        </article>
      ))}
    </section>
  );
}

export default ProductTable;