import { createBrowserRouter, Navigate } from "react-router-dom";
import AdminAppShell from "../shared/components/AdminAppShell";
import LoginPage from "../features/auth/pages/LoginPage";
import ProductsLayout from "../features/products/pages/ProductsLayout";
import ProductsOverviewPage from "../features/products/pages/ProductsOverviewPage";
import ProductDetailPage from "../features/products/pages/ProductDetailPage";
import NewProductPage from "../features/products/pages/NewProductPage";
import EditDropsPage from "../features/products/pages/EditDropsPage";
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
          { path: "orders", element: <OrdersPage /> },
          { path: "website-settings", element: <WebsiteSettingsPage /> },
        ],
      },
    ],
  },
]);

export default router;