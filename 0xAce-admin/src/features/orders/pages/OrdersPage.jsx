import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAdminShell } from "../../../app/providers/AdminShellProvider";
import FilterStats from "../../../shared/components/FilterStats";
import ViewModeToggle from "../../../shared/components/ViewModeToggle";
import {
  ORDER_STATUSES,
  getStatusLabel,
  matchesOrderSearch,
} from "../lib/ordersState";
import OrderList from "../components/OrderList";
import { useOrders } from "../providers/OrdersProvider";
import "./styles/OrdersPage.css";

function OrdersPage() {
  const { searchQuery } = useAdminShell();
  const { orders } = useOrders();
  const [activeFilter, setActiveFilter] = useState("all");
  const [viewMode, setViewMode] = useState("full");
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredOrders = orders.filter((order) => {
    const matchesQuery = normalizedQuery ? matchesOrderSearch(order, normalizedQuery) : true;
    const matchesFilter = activeFilter === "all" ? true : order.fulfillment_status === activeFilter;

    return matchesQuery && matchesFilter;
  });

  useEffect(() => {
    if (viewMode !== "quick") {
      return;
    }

    if (!filteredOrders.length) {
      setSelectedOrderId(null);
      return;
    }

     if (!selectedOrderId) {
      return;
    }

    const selectionStillVisible = filteredOrders.some((order) => order.id === selectedOrderId);

    if (!selectionStillVisible) {
      setSelectedOrderId(null);
    }
  }, [filteredOrders, selectedOrderId, viewMode]);

  const orderedVisibleOrders = useMemo(() => [...filteredOrders].sort((left, right) => {
    const leftIndex = ORDER_STATUSES.indexOf(left.fulfillment_status);
    const rightIndex = ORDER_STATUSES.indexOf(right.fulfillment_status);

    if (leftIndex !== rightIndex) {
      return leftIndex - rightIndex;
    }

    return new Date(right.created_at) - new Date(left.created_at);
  }), [filteredOrders]);
  const statCards = [
    {
      id: "all",
      label: "All orders",
      value: orders.length,
      meta: `${filteredOrders.length} visible now`,
    },
    ...ORDER_STATUSES.map((status) => ({
      id: status,
      label: getStatusLabel(status),
      value: orders.filter((order) => order.fulfillment_status === status).length,
      meta: `${filteredOrders.filter((order) => order.fulfillment_status === status).length} in view`,
      tone: status === "returned" ? "warning" : undefined,
    })),
  ];

  return (
    <div className="page-stack orders-overview-page">
      <section className="orders-overview-toolbar">
        <div>
          <p className="section-kicker">Orders overview</p>
          <h2 className="orders-overview-toolbar__title">Fulfillment workspace</h2>
          <p className="page-copy orders-overview-toolbar__copy">
            {searchQuery
              ? `${filteredOrders.length} orders matched the current search across customers, item names, and status.`
              : "Review the order queue by fulfillment stage, inspect line items in a quick drawer, and jump into a dedicated order page when you need the full record."}
          </p>
        </div>

        <div className="orders-overview-toolbar__actions">
          <span className="orders-overview-toolbar__summary">{orders.length} total orders</span>
          <Link to="/orders/new" className="primary-button products-button--compact">
            New Order
          </Link>
        </div>
      </section>

      <FilterStats cards={statCards} activeFilter={activeFilter} onSelectFilter={setActiveFilter} />

      <section className="data-card orders-overview-section">
        <div className="data-card__header orders-overview-section__header">
          <div>
            <p className="data-card__eyebrow">List</p>
            <h3>Orders grouped by status</h3>
          </div>
          <div className="orders-overview-section__controls">
            <span className="orders-overview-section__meta">{filteredOrders.length} visible</span>
            <ViewModeToggle
              ariaLabel="Order row mode"
              options={[
                { id: "full", label: "Full Page" },
                { id: "quick", label: "Quick View" },
              ]}
              activeMode={viewMode}
              onChange={(nextMode) => {
                if (nextMode === "full") {
                  setSelectedOrderId(null);
                }

                setViewMode(nextMode);
              }}
            />
            {activeFilter !== "all" ? (
              <button
                type="button"
                className="utility-button orders-overview-section__clear"
                onClick={() => setActiveFilter("all")}
              >
                Show all statuses
              </button>
            ) : null}
          </div>
        </div>

        {!filteredOrders.length ? (
          <article className="data-card orders-empty-state">
            <div className="data-card__header">
              <div>
                <p className="data-card__eyebrow">No matches</p>
                <h3>No orders matched your current view</h3>
              </div>
            </div>
          </article>
        ) : (
          <OrderList
            orders={orderedVisibleOrders}
            viewMode={viewMode}
            selectedOrderId={selectedOrderId}
            onSelectOrder={setSelectedOrderId}
          />
        )}
      </section>
    </div>
  );
}

export default OrdersPage;