import { createBrowserRouter, Navigate } from "react-router-dom";
import AdminAppShell from "../shared/components/layout/AdminAppShell";
import LoginPage from "../features/auth/pages/LoginPage";
import ProductsPage from "../features/products/pages/ProductsPage";
import OrdersPage from "../features/orders/pages/OrdersPage";
import WebsiteSettingsPage from "../features/website/pages/WebsiteSettingsPage";
import ProtectedRoute from "./routes/ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        element: <AdminAppShell />,
        children: [
          { index: true, element: <Navigate to="/products" replace /> },
          { path: "products", element: <ProductsPage /> },
          { path: "orders", element: <OrdersPage /> },
          { path: "website-settings", element: <WebsiteSettingsPage /> },
        ],
      },
    ],
  },
]);

export default router;