import { Link, useNavigate, useParams } from "react-router-dom";
import { getOrderById } from "../lib/ordersState";
import "./styles/OrderDetailPage.css";

function OrderDetailPage() {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const order = getOrderById(orderId);

  if (!order) {
    return (
      <section className="page-header-card">
        <p className="section-kicker">Missing order</p>
        <h2>This order no longer exists</h2>
        <p className="page-copy">
          Return to the orders overview to choose another record.
        </p>
        <div className="order-workspace__actions">
          <Link to="/orders" className="primary-button">
            Back to Orders
          </Link>
        </div>
      </section>
    );
  }

  return (
    <div className="page-stack order-workspace">
      <section className="order-workspace__toolbar order-workspace__toolbar--leading-back">
        <div className="order-workspace__leading">
          <button type="button" className="utility-button order-back-button" onClick={() => navigate("/orders")}>
            Back
          </button>
          <div>
            <p className="section-kicker">Order page</p>
            <h2 className="order-workspace__title">#{order.shortId}</h2>
            <p className="order-workspace__copy">{order.shipping_name} · {order.createdAtFormatted}</p>
          </div>
        </div>

        <div className="order-workspace__actions">
          <span className={`status-pill status-pill--${order.fulfillment_status}`}>{order.statusLabel}</span>
          <Link to="/orders" className="secondary-button">
            Orders board
          </Link>
        </div>
      </section>

      <section className="order-workspace__grid">
        <article className="editor-card order-workspace__card">
          <div className="detail-panel__header">
            <div>
              <p className="data-card__eyebrow">Summary</p>
              <h3>Order totals</h3>
            </div>
            <strong>{order.totalFormatted}</strong>
          </div>

          <div className="data-grid data-grid--three">
            <div>
              <span>Subtotal</span>
              <strong>{order.subtotalFormatted}</strong>
            </div>
            <div>
              <span>Shipping</span>
              <strong>{order.shippingFormatted}</strong>
            </div>
            <div>
              <span>Payment</span>
              <strong>{order.payment_status}</strong>
            </div>
          </div>
        </article>

        <article className="editor-card order-workspace__card">
          <div className="detail-panel__header">
            <div>
              <p className="data-card__eyebrow">Customer</p>
              <h3>Shipping details</h3>
            </div>
          </div>

          <div className="order-workspace__stack">
            <div>
              <span>Name</span>
              <strong>{order.shipping_name}</strong>
            </div>
            <div>
              <span>Email</span>
              <strong>{order.customer_email}</strong>
            </div>
            <div>
              <span>Address</span>
              <strong>{order.shippingAddressFull}</strong>
            </div>
          </div>
        </article>

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

        <article className="editor-card order-workspace__card">
          <div className="detail-panel__header">
            <div>
              <p className="data-card__eyebrow">Fulfillment</p>
              <h3>Shipment record</h3>
            </div>
          </div>

          <div className="order-workspace__stack">
            <div>
              <span>Status</span>
              <strong>{order.statusLabel}</strong>
            </div>
            <div>
              <span>Receipt sent</span>
              <strong>{order.receiptSentAtFormatted}</strong>
            </div>
            <div>
              <span>Shipped</span>
              <strong>{order.shippedAtFormatted}</strong>
            </div>
            <div>
              <span>Tracking</span>
              <strong>{order.tracking_number ?? "Awaiting label"}</strong>
            </div>
            {order.tracking_url ? (
              <div>
                <span>Tracking link</span>
                <a className="order-workspace__tracking-link" href={order.tracking_url} target="_blank" rel="noreferrer">
                  Open carrier page
                </a>
              </div>
            ) : null}
          </div>
        </article>
      </section>
    </div>
  );
}

export default OrderDetailPage;