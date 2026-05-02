import "./styles/OrderItemsCard.css";

function OrderItemsCard({ order }) {
  return (
    <article className="variants-card order-workspace__card order-workspace__card--wide">
      <div className="detail-panel__header">
        <div>
          <p className="data-card__eyebrow">Items</p>
          <h3>Order contents</h3>
        </div>
        <span>{order.itemCount} total items</span>
      </div>

      <div className="order-workspace__items">
        {order.items.map((item) => (
          <article key={item.id} className="order-workspace__item-row">
            <div>
              <strong>{item.product_name}</strong>
              <p>{item.variant_label} · {item.sku}</p>
            </div>
            <div className="order-workspace__item-values">
              <span>{item.quantity} × {item.unitPriceFormatted}</span>
              <strong>{item.lineTotalFormatted}</strong>
            </div>
          </article>
        ))}
      </div>
    </article>
  );
}

export default OrderItemsCard;