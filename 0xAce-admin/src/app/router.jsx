import { createBrowserRouter, Navigate } from "react-router-dom";
import AdminAppShell from "../shared/components/AdminAppShell";
import LoginPage from "../features/auth/LoginPage";
import ProductsLayout from "../features/products/pages/ProductsLayout";
import ProductsOverviewPage from "../features/products/pages/ProductsOverviewPage";
import ProductDetailPage from "../features/products/pages/ProductDetailPage";
import NewProductPage from "../features/products/pages/NewProductPage";
import EditDropsPage from "../features/products/pages/EditDropsPage";
import OrdersLayout from "../features/orders/pages/OrdersLayout";
import OrdersPage from "../features/orders/pages/OrdersPage";
import OrderDetailPage from "../features/orders/pages/OrderDetailPage";
import WebsiteSettingsPage from "../features/website/WebsiteSettingsPage";
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
          {
            path: "products",
            element: <ProductsLayout />,
            children: [
              { index: true, element: <ProductsOverviewPage /> },
              { path: "new", element: <NewProductPage /> },
              { path: "drops", element: <EditDropsPage /> },
              { path: "new-drop", element: <EditDropsPage /> },
              { path: "drops/:dropId/edit", element: <EditDropsPage /> },
              { path: ":productId", element: <ProductDetailPage /> },
            ],
          },
          {
            path: "orders",
            element: <OrdersLayout />,
            children: [
              { index: true, element: <OrdersPage /> },
              { path: ":orderId", element: <OrderDetailPage /> },
            ],
          },
          { path: "website-settings", element: <WebsiteSettingsPage /> },
        ],
      },
    ],
  },
]);

export default router;