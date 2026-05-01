import OrderListRow from "./OrderListRow";
import "./styles/OrderList.css";

function OrderList({ orders, viewMode, selectedOrderId, onSelectOrder }) {
  return (
    <section className="order-list" aria-label="Order status list">
      <header className="order-list__header" aria-hidden="true">
        <span>Order detail</span>
        <span>Items</span>
        <span>Shipping</span>
        <span>Total</span>
        <span>Status</span>
        <span />
      </header>

      <div className="order-list__rows">
        {orders.map((order) => (
          <OrderListRow
            key={order.id}
            order={order}
            viewMode={viewMode}
            isSelected={selectedOrderId === order.id}
            isPriority={order.fulfillment_status === "unfulfilled"}
            onSelectOrder={onSelectOrder}
          />
        ))}
      </div>
    </section>
  );
}

export default OrderList;