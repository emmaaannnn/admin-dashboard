import { useState } from "react";
import { useNavigate } from "react-router-dom";
import OrderCustomerSummaryCard from "../components/OrderCustomerSummaryCard";
import OrderFulfillmentCard from "../components/OrderFulfillmentCard";
import { buildOrder } from "../lib/ordersState";
import { useOrders } from "../providers/OrdersProvider";
import "./styles/OrderDetailPage.css";

function NewOrderPage() {
  const navigate = useNavigate();
  const { createOrder, createOrderDraft } = useOrders();
  const [draftOrder, setDraftOrder] = useState(() => createOrderDraft());

  const previewOrder = buildOrder({
    ...draftOrder,
    shipping_address_json: JSON.stringify({
      line1: draftOrder.shippingAddress.line1,
      line2: draftOrder.shippingAddress.line2 || null,
      city: draftOrder.shippingAddress.city,
      state: draftOrder.shippingAddress.state,
      postal_code: draftOrder.shippingAddress.postal_code,
      country: draftOrder.shippingAddress.country,
    }),
  }, new Map());

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

  const handleCreateOrder = () => {
    const nextOrder = createOrder(draftOrder);
    navigate(`/orders/${nextOrder.id}`);
  };

  return (
    <div className="page-stack order-workspace">
      <section className="order-workspace__toolbar order-workspace__toolbar--leading-back">
        <div className="order-workspace__leading">
          <button type="button" className="utility-button order-back-button" onClick={() => navigate("/orders") }>
            Back
          </button>
          <div>
            <p className="section-kicker">New order</p>
            <h2 className="order-workspace__title">Create manual order</h2>
            <p className="order-workspace__copy">Add an order directly to the admin queue for manual fulfillment.</p>
          </div>
        </div>

        <div className="order-workspace__actions">
          <button type="button" className="primary-button" onClick={handleCreateOrder}>
            Create Order
          </button>
        </div>
      </section>

      <section className="order-workspace__grid">
        <OrderFulfillmentCard
          order={previewOrder}
          draftOrder={draftOrder}
          onOrderFieldChange={handleOrderFieldChange}
        />

        <OrderCustomerSummaryCard
          order={previewOrder}
          draftOrder={draftOrder}
          isAmending
          onToggleAmend={() => {}}
          onOrderFieldChange={handleOrderFieldChange}
          onAddressFieldChange={handleAddressFieldChange}
        />
      </section>
    </div>
  );
}

export default NewOrderPage;