import { Outlet } from "react-router-dom";
import OrdersProvider from "../providers/OrdersProvider";

function OrdersLayout() {
  return (
    <OrdersProvider>
      <Outlet />
    </OrdersProvider>
  );
}

export default OrdersLayout;