import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { cloneOrderDraft } from "../lib/ordersState";
import { useOrders } from "../providers/OrdersProvider";
import "./styles/OrderDetailPage.css";

function OrderDetailPage() {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const { getOrderById, updateOrder } = useOrders();
  const order = getOrderById(orderId);
  const [draftOrder, setDraftOrder] = useState(() => (order ? cloneOrderDraft(order) : null));

  useEffect(() => {
    setDraftOrder(order ? cloneOrderDraft(order) : null);
  }, [order]);

  const hasUnsavedChanges = useMemo(() => {
    if (!order || !draftOrder) {
      return false;
    }

    return JSON.stringify(draftOrder) !== JSON.stringify(cloneOrderDraft(order));
  }, [draftOrder, order]);

  if (!order || !draftOrder) {
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

  const handleOrderFieldChange = (field, value) => {
    setDraftOrder((currentOrder) => ({
      ...currentOrder,
      [field]: value,
    }));
  };

  const handleAddressFieldChange = (field, value) => {
    setDraftOrder((currentOrder) => ({
      ...currentOrder,
      shippingAddress: {
        ...currentOrder.shippingAddress,
        [field]: value,
      },
    }));
  };

  const handleDiscardChanges = () => {
    setDraftOrder(cloneOrderDraft(order));
  };

  const handleSaveChanges = () => {
    updateOrder(orderId, draftOrder);
  };

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
          {hasUnsavedChanges ? (
            <>
              <button type="button" className="utility-button" onClick={handleDiscardChanges}>
                Discard
              </button>
              <button type="button" className="primary-button" onClick={handleSaveChanges}>
                Save Order
              </button>
            </>
          ) : null}
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
            <label className="field-stack">
              <span>Subtotal</span>
              <input
                className="editor-input"
                type="number"
                min="0"
                step="0.01"
                value={draftOrder.subtotal_aud}
                onChange={(event) => handleOrderFieldChange("subtotal_aud", event.target.value)}
              />
            </label>
            <label className="field-stack">
              <span>Shipping</span>
              <input
                className="editor-input"
                type="number"
                min="0"
                step="0.01"
                value={draftOrder.shipping_aud}
                onChange={(event) => handleOrderFieldChange("shipping_aud", event.target.value)}
              />
            </label>
            <label className="field-stack">
              <span>Total</span>
              <input
                className="editor-input"
                type="number"
                min="0"
                step="0.01"
                value={draftOrder.total_aud}
                onChange={(event) => handleOrderFieldChange("total_aud", event.target.value)}
              />
            </label>
            <label className="field-stack field-stack--wide">
              <span>Payment status</span>
              <select
                className="editor-select"
                value={draftOrder.payment_status}
                onChange={(event) => handleOrderFieldChange("payment_status", event.target.value)}
              >
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
            </label>
          </div>
        </article>

        <article className="editor-card order-workspace__card">
          <div className="detail-panel__header">
            <div>
              <p className="data-card__eyebrow">Customer</p>
              <h3>Shipping details</h3>
            </div>
          </div>

          <div className="order-workspace__form-grid">
            <label className="field-stack">
              <span>Name</span>
              <input
                className="editor-input"
                value={draftOrder.shipping_name}
                onChange={(event) => handleOrderFieldChange("shipping_name", event.target.value)}
              />
            </label>
            <label className="field-stack">
              <span>Email</span>
              <input
                className="editor-input"
                type="email"
                value={draftOrder.customer_email}
                onChange={(event) => handleOrderFieldChange("customer_email", event.target.value)}
              />
            </label>
            <label className="field-stack field-stack--wide">
              <span>Address line 1</span>
              <input
                className="editor-input"
                value={draftOrder.shippingAddress.line1}
                onChange={(event) => handleAddressFieldChange("line1", event.target.value)}
              />
            </label>
            <label className="field-stack field-stack--wide">
              <span>Address line 2</span>
              <input
                className="editor-input"
                value={draftOrder.shippingAddress.line2}
                onChange={(event) => handleAddressFieldChange("line2", event.target.value)}
              />
            </label>
            <label className="field-stack">
              <span>City</span>
              <input
                className="editor-input"
                value={draftOrder.shippingAddress.city}
                onChange={(event) => handleAddressFieldChange("city", event.target.value)}
              />
            </label>
            <label className="field-stack">
              <span>State</span>
              <input
                className="editor-input"
                value={draftOrder.shippingAddress.state}
                onChange={(event) => handleAddressFieldChange("state", event.target.value)}
              />
            </label>
            <label className="field-stack">
              <span>Postcode</span>
              <input
                className="editor-input"
                value={draftOrder.shippingAddress.postal_code}
                onChange={(event) => handleAddressFieldChange("postal_code", event.target.value)}
              />
            </label>
            <label className="field-stack">
              <span>Country</span>
              <input
                className="editor-input"
                value={draftOrder.shippingAddress.country}
                onChange={(event) => handleAddressFieldChange("country", event.target.value)}
              />
            </label>
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

          <div className="order-workspace__form-grid">
            <label className="field-stack">
              <span>Status</span>
              <select
                className="editor-select"
                value={draftOrder.fulfillment_status}
                onChange={(event) => handleOrderFieldChange("fulfillment_status", event.target.value)}
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
                onChange={(event) => handleOrderFieldChange("tracking_number", event.target.value)}
              />
            </label>
            <label className="field-stack field-stack--wide">
              <span>Tracking URL</span>
              <input
                className="editor-input"
                value={draftOrder.tracking_url}
                onChange={(event) => handleOrderFieldChange("tracking_url", event.target.value)}
              />
            </label>
            <label className="field-stack">
              <span>Receipt sent</span>
              <input
                className="editor-input"
                value={draftOrder.receipt_sent_at}
                onChange={(event) => handleOrderFieldChange("receipt_sent_at", event.target.value)}
              />
            </label>
            <label className="field-stack">
              <span>Shipped at</span>
              <input
                className="editor-input"
                value={draftOrder.shipped_at}
                onChange={(event) => handleOrderFieldChange("shipped_at", event.target.value)}
              />
            </label>
          </div>
        </article>
      </section>
    </div>
  );
}

export default OrderDetailPage;