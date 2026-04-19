import { Outlet } from "react-router-dom";
import ProductsProvider from "../providers/ProductsProvider";

function ProductsLayout() {
  return (
    <ProductsProvider>
      <Outlet />
    </ProductsProvider>
  );
}

export default ProductsLayout;