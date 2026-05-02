import { createContext, useContext, useMemo, useState } from "react";
import mockSupabaseData from "../../../data/mock/supabaseData";
import { buildOrders, createEmptyOrderDraft, serializeOrderDraft } from "../lib/ordersState";

const OrdersContext = createContext(null);

function OrdersProvider({ children }) {
  const [rawOrders, setRawOrders] = useState(() => [...mockSupabaseData.orders]);

  const orders = useMemo(() => buildOrders(rawOrders), [rawOrders]);

  const value = useMemo(
    () => ({
      orders,
      getOrderById: (orderId) => orders.find((order) => order.id === orderId) ?? null,
      createOrderDraft: () => createEmptyOrderDraft(rawOrders.length),
      createOrder: (orderDraft) => {
        const nextOrder = serializeOrderDraft(orderDraft);

        setRawOrders((currentOrders) => [nextOrder, ...currentOrders]);

        return nextOrder;
      },
      updateOrder: (orderId, orderDraft) => {
        const nextOrder = serializeOrderDraft(orderDraft);

        setRawOrders((currentOrders) =>
          currentOrders.map((order) => (order.id === orderId ? nextOrder : order))
        );

        return nextOrder;
      },
    }),
    [orders, rawOrders.length]
  );

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
}

export function useOrders() {
  const context = useContext(OrdersContext);

  if (!context) {
    throw new Error("useOrders must be used within OrdersProvider");
  }

  return context;
}

export default OrdersProvider;