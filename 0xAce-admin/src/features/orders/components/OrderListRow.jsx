import { Link, useNavigate } from "react-router-dom";
import OrderQuickView from "./OrderQuickView";
import "./styles/OrderListRow.css";

function OrderListRow({ order, viewMode, isPriority, isSelected, onSelectOrder, onRemoveOrder }) {
  const navigate = useNavigate();

  const handleRemoveOrder = async () => {
    const confirmed = window.confirm(
      `Delete order #${order.shortId}? This will also remove its line items.`
    );

    if (!confirmed) {
      return;
    }

    await onRemoveOrder(order.id);
  };

  return (
    <article className={`order-row${isPriority ? " order-row--priority" : ""}`}>
      <button
        type="button"
        className={`order-row__summary${isSelected ? " is-selected" : ""}`}
        onClick={() => {
          if (viewMode === "quick") {
            onSelectOrder(isSelected ? null : order.id);
            return;
          }

          navigate(`/orders/${order.id}`);
        }}
        aria-expanded={viewMode === "quick" && isSelected}
      >
        <div className="order-row__detail">
          <div className="order-row__copy">
            <div className="order-row__copy-top">
              <h5>{order.shipping_name}</h5>
              <span className="order-row__code">#{order.shortId}</span>
            </div>
            <div className="order-row__meta-line">
              <span>{order.customer_email}</span>
              <span>{order.createdAtFormatted}</span>
            </div>
          </div>
        </div>

        <div className="order-row__item-preview">
          <strong>{order.itemCount} items</strong>
          <span>{order.itemPreview}</span>
        </div>

        <div className="order-row__shipping">
          <strong>{order.shipping_name}</strong>
          <span>{order.shippingAddressSummary}</span>
        </div>

        <div className="order-row__total">{order.totalFormatted}</div>

        <div className="order-row__status">
          <span className={`status-pill status-pill--${order.fulfillment_status}`}>{order.statusLabel}</span>
        </div>

        <div className="order-row__indicator">
          {viewMode === "quick" ? (isSelected ? "-" : "+") : ">"}
        </div>
      </button>

      {viewMode === "quick" && isSelected ? (
        <div className="order-row__expanded">
          <div className="order-row__expanded-top">
            <div className="order-row__expanded-meta">
              <span>Payment</span>
              <strong>{order.payment_status}</strong>
            </div>

            <div className="order-row__expanded-meta">
              <span>Tracking</span>
              <strong>{order.tracking_number ?? "Awaiting label"}</strong>
            </div>

            <div className="order-row__expanded-actions">
              <Link to={`/orders/${order.id}`} className="utility-button order-row__action-button">
                Full page
              </Link>
              <button
                type="button"
                className="utility-button utility-button--danger order-row__action-button"
                onClick={handleRemoveOrder}
              >
                Delete
              </button>
            </div>
          </div>

          <OrderQuickView order={order} />
        </div>
      ) : null}
    </article>
  );
}

export default OrderListRow;