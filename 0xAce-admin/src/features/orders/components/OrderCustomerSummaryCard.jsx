import "./styles/OrderCustomerSummaryCard.css";

function OrderCustomerSummaryCard({
  order,
  draftOrder,
  isAmending,
  onToggleAmend,
  onOrderFieldChange,
  onAddressFieldChange,
}) {
  return (
    <article className="editor-card order-workspace__card order-customer-summary-card">
      <div className="detail-panel__header order-customer-summary-card__header">
        <div>
          <p className="data-card__eyebrow">Customer and summary</p>
          <h3>Customer record</h3>
        </div>
        <button type="button" className="utility-button" onClick={onToggleAmend}>
          {isAmending ? "Lock" : "Amend"}
        </button>
      </div>

      {isAmending ? (
        <div className="order-workspace__form-grid">
          <label className="field-stack">
            <span>Name</span>
            <input
              className="editor-input"
              value={draftOrder.shipping_name}
              onChange={(event) => onOrderFieldChange("shipping_name", event.target.value)}
            />
          </label>
          <label className="field-stack">
            <span>Email</span>
            <input
              className="editor-input"
              type="email"
              value={draftOrder.customer_email}
              onChange={(event) => onOrderFieldChange("customer_email", event.target.value)}
            />
          </label>
          <label className="field-stack field-stack--wide">
            <span>Address line 1</span>
            <input
              className="editor-input"
              value={draftOrder.shippingAddress.line1}
              onChange={(event) => onAddressFieldChange("line1", event.target.value)}
            />
          </label>
          <label className="field-stack field-stack--wide">
            <span>Address line 2</span>
            <input
              className="editor-input"
              value={draftOrder.shippingAddress.line2}
              onChange={(event) => onAddressFieldChange("line2", event.target.value)}
            />
          </label>
          <label className="field-stack">
            <span>City</span>
            <input
              className="editor-input"
              value={draftOrder.shippingAddress.city}
              onChange={(event) => onAddressFieldChange("city", event.target.value)}
            />
          </label>
          <label className="field-stack">
            <span>State</span>
            <input
              className="editor-input"
              value={draftOrder.shippingAddress.state}
              onChange={(event) => onAddressFieldChange("state", event.target.value)}
            />
          </label>
          <label className="field-stack">
            <span>Postcode</span>
            <input
              className="editor-input"
              value={draftOrder.shippingAddress.postal_code}
              onChange={(event) => onAddressFieldChange("postal_code", event.target.value)}
            />
          </label>
          <label className="field-stack">
            <span>Country</span>
            <input
              className="editor-input"
              value={draftOrder.shippingAddress.country}
              onChange={(event) => onAddressFieldChange("country", event.target.value)}
            />
          </label>
        </div>
      ) : (
        <div className="order-customer-summary-card__grid">
          <div className="order-customer-summary-card__block">
            <span>Customer</span>
            <strong>{order.shipping_name}</strong>
            <p>{order.customer_email}</p>
            <p>{order.shippingAddressFull}</p>
          </div>

          <div className="order-customer-summary-card__block">
            <span>Payment</span>
            <strong>{order.payment_status}</strong>
            <p>Subtotal {order.subtotalFormatted}</p>
            <p>Shipping {order.shippingFormatted}</p>
            <p>Total {order.totalFormatted}</p>
          </div>
        </div>
      )}
    </article>
  );
}

export default OrderCustomerSummaryCard;