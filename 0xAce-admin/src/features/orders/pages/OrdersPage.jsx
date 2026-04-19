import mockSupabaseData from "../../../data/mock/supabaseData";
import { useAdminShell } from "../../../app/providers/AdminShellProvider";
import { formatDate, formatMoney } from "../../../shared/lib/formatters";
import "./OrdersPage.css";

function OrdersPage() {
  const { searchQuery } = useAdminShell();
  const orders = mockSupabaseData.orders.map((order) => {
    const items = mockSupabaseData.order_items.filter((item) => item.order_id === order.id);

    return {
      ...order,
      itemCount: items.reduce((total, item) => total + item.quantity, 0),
      leadItem: items[0]?.product_name ?? "No items",
    };
  });

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredOrders = normalizedQuery
    ? orders.filter((order) =>
        [order.id, order.shipping_name, order.leadItem, order.fulfillment_status]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery)
      )
    : orders;

  return (
    <div className="page-stack orders-page">
      <section className="page-header-card">
        <p className="section-kicker">Orders</p>
        <h2>Order workspace</h2>
        <p className="page-copy">
          {searchQuery
            ? `${filteredOrders.length} matching orders across customers, order ids, and fulfillment status.`
            : "Payment review and fulfillment workflows can live here without mixing with the catalog files."}
        </p>
      </section>

      <section className="data-list">
        {filteredOrders.map((order) => (
          <article key={order.id} className="data-card">
            <div className="data-card__header">
              <div>
                <p className="data-card__eyebrow">{order.id}</p>
                <h3>{order.shipping_name}</h3>
              </div>
              <span className={`status-pill status-pill--${order.fulfillment_status}`}>
                {order.fulfillment_status}
              </span>
            </div>

            <div className="data-grid data-grid--four">
              <div>
                <span>Lead item</span>
                <strong>{order.leadItem}</strong>
              </div>
              <div>
                <span>Items</span>
                <strong>{order.itemCount}</strong>
              </div>
              <div>
                <span>Total</span>
                <strong>{formatMoney(order.total_aud)}</strong>
              </div>
              <div>
                <span>Placed</span>
                <strong>{formatDate(order.created_at)}</strong>
              </div>
            </div>
          </article>
        ))}

        {!filteredOrders.length ? (
          <article className="data-card">
            <div className="data-card__header">
              <div>
                <p className="data-card__eyebrow">No matches</p>
                <h3>No orders matched your search</h3>
              </div>
            </div>
          </article>
        ) : null}
      </section>
    </div>
  );
}

export default OrdersPage;