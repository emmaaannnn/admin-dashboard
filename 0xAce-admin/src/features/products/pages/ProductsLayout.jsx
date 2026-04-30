import { Outlet } from "react-router-dom";
import ProductsProvider from "../providers/ProductsProvider";
import { useProducts } from "../providers/ProductsProvider";

function ProductsLayoutContent() {
  const { loading, error, refresh } = useProducts();

  if (loading) {
    return (
      <section className="page-header-card">
        <p className="section-kicker">Products</p>
        <h2>Loading catalog</h2>
        <p className="page-copy">Fetching drops, products, variants, and images from Supabase.</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="page-header-card page-header-card--error">
        <p className="section-kicker">Supabase error</p>
        <h2>Products could not load</h2>
        <p className="page-copy">{error}</p>
        <div>
          <button type="button" className="primary-button products-button--compact" onClick={refresh}>
            Retry connection
          </button>
        </div>
      </section>
    );
  }

  return <Outlet />;
}

function ProductsLayout() {
  return (
    <ProductsProvider>
      <ProductsLayoutContent />
    </ProductsProvider>
  );
}

export default ProductsLayout;