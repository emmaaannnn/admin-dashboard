import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductDetailsPane from "../components/ProductDetailsPane";
import {
  cloneProduct,
  createEmptyProduct,
  getInventoryStatus,
} from "../lib/productsState";
import { useProducts } from "../providers/ProductsProvider";
import "./ProductFormPage.css";

function navigateBack(navigate) {
  if (window.history.length > 1) {
    navigate(-1);
    return;
  }

  navigate("/products");
}

function NewProductPage() {
  const navigate = useNavigate();
  const { drops, products, createProduct } = useProducts();
  const initialDraft = useMemo(
    () => createEmptyProduct(drops, products.length),
    [drops, products.length]
  );
  const [draftProduct, setDraftProduct] = useState(() => cloneProduct(initialDraft));

  const handleProductChange = (field, value) => {
    setDraftProduct((currentProduct) => ({
      ...currentProduct,
      [field]: value,
    }));
  };

  const handleSizeGuideChange = (field, value) => {
    setDraftProduct((currentProduct) => ({
      ...currentProduct,
      size_guide: {
        ...currentProduct.size_guide,
        [field]: value,
      },
    }));
  };

  const handleVariantChange = (variantId, field, value) => {
    setDraftProduct((currentProduct) => ({
      ...currentProduct,
      variants: currentProduct.variants.map((variant) => {
        if (variant.id !== variantId) {
          return variant;
        }

        if (field === "inventory_quantity") {
          const quantity = Math.max(0, Number(value) || 0);

          return {
            ...variant,
            inventory_quantity: quantity,
            inventory_status: getInventoryStatus(quantity),
          };
        }

        if (field === "price_aud" || field === "compare_at_price_aud") {
          return {
            ...variant,
            [field]: value === "" ? null : Math.max(0, Number(value) || 0),
          };
        }

        return {
          ...variant,
          [field]: value,
        };
      }),
    }));
  };

  const handleCreateProduct = () => {
    const nextProduct = createProduct(draftProduct);
    navigate(`/products/${nextProduct.id}`);
  };

  return (
    <div className="page-stack product-form-page">
      <section className="product-workspace__toolbar product-workspace__toolbar--leading-back">
        <div className="product-workspace__leading">
          <button type="button" className="utility-button product-back-button" onClick={() => navigateBack(navigate)}>
            Back
          </button>
          <div>
            <p className="section-kicker">New product</p>
            <h2 className="product-workspace__title">Create product</h2>
          </div>
        </div>

        <div className="product-workspace__actions">
          <button type="button" className="primary-button products-button--compact" onClick={handleCreateProduct}>
            Create Product
          </button>
        </div>
      </section>

      <ProductDetailsPane
        product={draftProduct}
        drops={drops}
        onProductChange={handleProductChange}
        onSizeGuideChange={handleSizeGuideChange}
        onVariantChange={handleVariantChange}
        kicker="New product draft"
        title={draftProduct.name}
      />
    </div>
  );
}

export default NewProductPage;