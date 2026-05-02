import { Outlet } from "react-router-dom";
import OrdersProvider from "../providers/OrdersProvider";
import { useOrders } from "../providers/OrdersProvider";

function OrdersLayoutContent() {
  const { loading, error, refresh } = useOrders();

  if (loading) {
    return (
      <section className="page-header-card">
        <p className="section-kicker">Orders</p>
        <h2>Loading orders</h2>
        <p className="page-copy">Fetching orders and line items from Supabase.</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="page-header-card page-header-card--error">
        <p className="section-kicker">Supabase error</p>
        <h2>Orders could not load</h2>
        <p className="page-copy">{error}</p>
        <div>
          <button type="button" className="primary-button" onClick={refresh}>
            Retry connection
          </button>
        </div>
      </section>
    );
  }

  return <Outlet />;
}

function OrdersLayout() {
  return (
    <OrdersProvider>
      <OrdersLayoutContent />
    </OrdersProvider>
  );
}

export default OrdersLayout;