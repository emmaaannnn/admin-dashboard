import "./styles/OrderQuickView.css";

function OrderQuickView({ order }) {
  return (
    <div className="order-quick-view">
      <section className="order-quick-view__section">
        <div className="order-quick-view__section-header">
          <h6>Items</h6>
          <span>{order.itemCount} total</span>
        </div>

        <div className="order-quick-view__items">
          {order.items.map((item) => (
            <article key={item.id} className="order-quick-view__item">
              <div>
                <strong>{item.product_name}</strong>
                <p>{item.variant_label} · {item.sku}</p>
              </div>
              <div className="order-quick-view__item-meta">
                <span>x{item.quantity}</span>
                <strong>{item.lineTotalFormatted}</strong>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="order-quick-view__section">
        <div className="order-quick-view__section-header">
          <h6>Delivery</h6>
          <span>{order.statusLabel}</span>
        </div>
        <p className="order-quick-view__address">{order.shippingAddressFull}</p>
        <p className="order-quick-view__customer">{order.customer_email}</p>
      </section>
    </div>
  );
}

export default OrderQuickView;