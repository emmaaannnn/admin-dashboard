import "./styles/OrderFulfillmentCard.css";

function OrderFulfillmentCard({ order, draftOrder, onOrderFieldChange }) {
  return (
    <article className="editor-card order-workspace__card order-fulfillment-card">
      <div className="detail-panel__header">
        <div>
          <p className="data-card__eyebrow">Fulfillment</p>
          <h3>Fulfillment workspace</h3>
        </div>
        <strong>{order.statusLabel}</strong>
      </div>

      <div className="order-workspace__form-grid">
        <label className="field-stack">
          <span>Status</span>
          <select
            className="editor-select"
            value={draftOrder.fulfillment_status}
            onChange={(event) => onOrderFieldChange("fulfillment_status", event.target.value)}
          >
            <option value="unfulfilled">Unfulfilled</option>
            <option value="packed">Packed</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="returned">Returned</option>
          </select>
        </label>
        <label className="field-stack">
          <span>Tracking number</span>
          <input
            className="editor-input"
            value={draftOrder.tracking_number}
            onChange={(event) => onOrderFieldChange("tracking_number", event.target.value)}
          />
        </label>
        <label className="field-stack field-stack--wide">
          <span>Tracking URL</span>
          <input
            className="editor-input"
            value={draftOrder.tracking_url}
            onChange={(event) => onOrderFieldChange("tracking_url", event.target.value)}
          />
        </label>
        <label className="field-stack">
          <span>Receipt sent</span>
          <input
            className="editor-input"
            value={draftOrder.receipt_sent_at}
            onChange={(event) => onOrderFieldChange("receipt_sent_at", event.target.value)}
          />
        </label>
        <label className="field-stack">
          <span>Shipped at</span>
          <input
            className="editor-input"
            value={draftOrder.shipped_at}
            onChange={(event) => onOrderFieldChange("shipped_at", event.target.value)}
          />
        </label>
      </div>
    </article>
  );
}

export default OrderFulfillmentCard;