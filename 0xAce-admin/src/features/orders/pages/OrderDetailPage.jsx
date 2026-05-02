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
  const { getOrderById, updateOrder } = useOrders();
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

  const handleSaveChanges = () => {
    updateOrder(orderId, draftOrder);
    setIsAmendingCustomer(false);
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