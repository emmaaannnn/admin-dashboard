import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useLocation } from "react-router-dom";
import mockSupabaseData from "../../data/mock/supabaseData";

const SEARCH_PLACEHOLDERS = {
  "/products": "Search the collection...",
  "/orders": "Search orders or customers...",
  "/drops": "Search release notes...",
  "/website-settings": "Search website controls...",
};

const PAGE_KICKERS = {
  "/products": "Archive 2026",
  "/orders": "Order desk",
  "/drops": "Release calendar",
  "/website-settings": "Storefront controls",
};

const AdminShellContext = createContext(null);

function getBasePath(pathname) {
  if (pathname.startsWith("/orders")) {
    return "/orders";
  }

  if (pathname.startsWith("/drops")) {
    return "/drops";
  }

  if (pathname.startsWith("/website-settings")) {
    return "/website-settings";
  }

  return "/products";
}

function createNotifications() {
  const now = new Date("2026-04-19T12:00:00.000Z").getTime();

  const orderNotifications = mockSupabaseData.orders
    .filter((order) => order.fulfillment_status === "unfulfilled")
    .map((order) => {
      const createdAt = new Date(order.created_at).getTime();
      const hoursAgo = Math.max(1, Math.round((now - createdAt) / (1000 * 60 * 60)));

      return {
        id: `order-${order.id}`,
        tone: "accent",
        title: `New order from ${order.shipping_name}`,
        detail: `${order.id.toUpperCase()} is ready for fulfillment review.`,
        timeLabel: `${hoursAgo}h ago`,
      };
    });

  return orderNotifications.slice(0, 6);
}

function AdminShellProvider({ children }) {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const basePath = getBasePath(location.pathname);

  useEffect(() => {
    setSearchQuery("");
  }, [basePath]);

  const notifications = useMemo(() => createNotifications(), []);

  const value = useMemo(
    () => ({
      basePath,
      pageKicker: PAGE_KICKERS[basePath] ?? "Admin workspace",
      searchPlaceholder:
        SEARCH_PLACEHOLDERS[basePath] ?? "Search the admin workspace...",
      searchQuery,
      setSearchQuery,
      notifications,
      unreadNotificationCount: notifications.length,
    }),
    [basePath, notifications, searchQuery]
  );

  return (
    <AdminShellContext.Provider value={value}>
      {children}
    </AdminShellContext.Provider>
  );
}

export function useAdminShell() {
  const context = useContext(AdminShellContext);

  if (!context) {
    throw new Error("useAdminShell must be used within AdminShellProvider");
  }

  return context;
}

export default AdminShellProvider;