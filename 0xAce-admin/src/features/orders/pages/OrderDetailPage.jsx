import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { cloneOrderDraft } from "../lib/ordersState";
import OrderCustomerSummaryCard from "../components/OrderCustomerSummaryCard";
import OrderFulfillmentCard from "../components/OrderFulfillmentCard";
import OrderItemsCard from "../components/OrderItemsCard";
import { useOrders } from "../providers/OrdersProvider";
import "./styles/OrderDetailPage.css";

function OrderDetailPage() {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const { getOrderById, updateOrder, removeOrder } = useOrders();
  const order = getOrderById(orderId);
  const [draftOrder, setDraftOrder] = useState(() => (order ? cloneOrderDraft(order) : null));
  const [isAmendingCustomer, setIsAmendingCustomer] = useState(false);

  useEffect(() => {
    setDraftOrder(order ? cloneOrderDraft(order) : null);
    setIsAmendingCustomer(false);
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
    setIsAmendingCustomer(false);
  };

  const handleSaveChanges = async () => {
    await updateOrder(orderId, draftOrder);
    setIsAmendingCustomer(false);
  };

  const handleRemoveOrder = async () => {
    const confirmed = window.confirm(
      `Delete order #${order.shortId}? This will also remove its line items.`
    );

    if (!confirmed) {
      return;
    }

    await removeOrder(orderId);
    navigate("/orders");
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
            <div className="order-workspace__title-row">
              <h2 className="order-workspace__title">#{order.shortId}</h2>
              <span className={`status-pill status-pill--${order.fulfillment_status}`}>{order.statusLabel}</span>
            </div>
            <p className="order-workspace__copy">{order.shipping_name} · {order.createdAtFormatted}</p>
          </div>
        </div>

        <div className="order-workspace__actions">
          <button type="button" className="utility-button utility-button--danger" onClick={handleRemoveOrder}>
            Delete Order
          </button>
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
        <OrderFulfillmentCard
          order={order}
          draftOrder={draftOrder}
          onOrderFieldChange={handleOrderFieldChange}
        />

        <OrderCustomerSummaryCard
          order={order}
          draftOrder={draftOrder}
          isAmending={isAmendingCustomer}
          onToggleAmend={() => setIsAmendingCustomer((currentValue) => !currentValue)}
          onOrderFieldChange={handleOrderFieldChange}
          onAddressFieldChange={handleAddressFieldChange}
        />

        <OrderItemsCard order={order} />
      </section>
    </div>
  );
}

export default OrderDetailPage;