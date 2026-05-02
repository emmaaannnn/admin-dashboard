import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import supabase, { isSupabaseConfigured } from "../../../shared/lib/supabaseClient";
import { buildOrders, createEmptyOrderDraft, serializeOrderDraft } from "../lib/ordersState";

const OrdersContext = createContext(null);

function formatSupabaseError(error) {
  if (!error) {
    return "Unable to load orders from Supabase.";
  }

  if (typeof error.message === "string" && error.message.trim()) {
    return error.message;
  }

  return "Unable to load orders from Supabase.";
}

function OrdersProvider({ children }) {
  const [rawOrders, setRawOrders] = useState([]);
  const [rawOrderItems, setRawOrderItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let isMounted = true;

    async function fetchOrders() {
      if (isMounted) {
        setLoading(true);
        setError("");
      }

      if (!isSupabaseConfigured || !supabase || !supabase.from) {
        if (isMounted) {
          setRawOrders([]);
          setRawOrderItems([]);
          setError(
            "Supabase is not configured. Set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY to load orders."
          );
          setLoading(false);
        }
        return;
      }

      try {
        const [ordersRes, orderItemsRes] = await Promise.all([
          supabase.from("orders").select("*").order("created_at", { ascending: false }),
          supabase.from("order_items").select("*"),
        ]);

        if (ordersRes.error || orderItemsRes.error) {
          throw ordersRes.error || orderItemsRes.error;
        }

        if (isMounted) {
          setRawOrders(ordersRes.data ?? []);
          setRawOrderItems(orderItemsRes.data ?? []);
          setError("");
          setLoading(false);
        }
      } catch (fetchError) {
        if (isMounted) {
          setRawOrders([]);
          setRawOrderItems([]);
          setError(formatSupabaseError(fetchError));
          setLoading(false);
        }
      }
    }

    fetchOrders();

    return () => {
      isMounted = false;
    };
  }, [reloadKey]);

  const refresh = useCallback(() => {
    setReloadKey((currentValue) => currentValue + 1);
  }, []);

  const orders = useMemo(() => buildOrders(rawOrders, rawOrderItems), [rawOrders, rawOrderItems]);

  const createOrderDraftFactory = useCallback(
    () => createEmptyOrderDraft(rawOrders.length),
    [rawOrders.length]
  );

  const createOrder = useCallback(async (orderDraft) => {
    const nextOrder = serializeOrderDraft(orderDraft);

    if (isSupabaseConfigured && supabase && supabase.from) {
      const { data, error: insertError } = await supabase
        .from("orders")
        .insert(nextOrder)
        .select("*")
        .single();

      if (insertError) {
        throw insertError;
      }

      setRawOrders((currentOrders) => [data, ...currentOrders]);
      return data;
    }

    setRawOrders((currentOrders) => [nextOrder, ...currentOrders]);
    return nextOrder;
  }, []);

  const updateOrder = useCallback(async (orderId, orderDraft) => {
    const nextOrder = serializeOrderDraft(orderDraft);

    if (isSupabaseConfigured && supabase && supabase.from) {
      const { data, error: updateError } = await supabase
        .from("orders")
        .update(nextOrder)
        .eq("id", orderId)
        .select("*")
        .single();

      if (updateError) {
        throw updateError;
      }

      setRawOrders((currentOrders) =>
        currentOrders.map((order) => (order.id === orderId ? data : order))
      );

      return data;
    }

    setRawOrders((currentOrders) =>
      currentOrders.map((order) => (order.id === orderId ? nextOrder : order))
    );

    return nextOrder;
  }, []);

  const removeOrder = useCallback(async (orderId) => {
    if (isSupabaseConfigured && supabase && supabase.from) {
      const { error: deleteOrderItemsError } = await supabase
        .from("order_items")
        .delete()
        .eq("order_id", orderId);

      if (deleteOrderItemsError) {
        throw deleteOrderItemsError;
      }

      const { error: deleteOrderError } = await supabase
        .from("orders")
        .delete()
        .eq("id", orderId);

      if (deleteOrderError) {
        throw deleteOrderError;
      }
    }

    setRawOrders((currentOrders) => currentOrders.filter((order) => order.id !== orderId));
    setRawOrderItems((currentItems) => currentItems.filter((item) => item.order_id !== orderId));
  }, []);

  const value = useMemo(
    () => ({
      orders,
      loading,
      error,
      refresh,
      getOrderById: (orderId) => orders.find((order) => order.id === orderId) ?? null,
      createOrderDraft: createOrderDraftFactory,
      createOrder,
      updateOrder,
      removeOrder,
    }),
    [createOrder, createOrderDraftFactory, error, loading, orders, refresh, removeOrder, updateOrder]
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