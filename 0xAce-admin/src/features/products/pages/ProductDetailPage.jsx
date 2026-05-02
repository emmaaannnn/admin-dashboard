import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ProductDetailsPane from "../components/ProductDetailsPane";
import { cloneProduct, createEmptyVariant, getInventoryStatus } from "../lib/productsState";
import { useProducts } from "../providers/ProductsProvider";
import "./styles/ProductDetailPage.css";

function navigateBack(navigate) {
  navigate("/products");
}

function ProductDetailPage() {
  const navigate = useNavigate();
  const { productId } = useParams();
  const { drops, getProductById, updateProduct, removeProduct } = useProducts();
  const sourceProduct = getProductById(productId);
  const [draftProduct, setDraftProduct] = useState(() =>
    sourceProduct ? cloneProduct(sourceProduct) : null
  );

  useEffect(() => {
    setDraftProduct(sourceProduct ? cloneProduct(sourceProduct) : null);
  }, [sourceProduct]);

  const handleDeleteProduct = () => {
    if (window.confirm("Are you sure you want to delete this product and all its images? This cannot be undone.")) {
      removeProduct(productId);
      navigate("/products");
    }
  };

  const handleDeleteVariant = (variantId) => {
    setDraftProduct((currentProduct) => ({
      ...currentProduct,
      variants: currentProduct.variants.filter((variant) => variant.id !== variantId),
    }));
  };

  const hasUnsavedChanges = useMemo(() => {
    if (!sourceProduct || !draftProduct) {
      return false;
    }

    return JSON.stringify(draftProduct) !== JSON.stringify(cloneProduct(sourceProduct));
  }, [draftProduct, sourceProduct]);

  if (!sourceProduct || !draftProduct) {
    return (
      <section className="page-header-card">
        <p className="section-kicker">Missing product</p>
        <h2>This product no longer exists</h2>
        <p className="page-copy">
          Return to the catalog overview to choose another product or create a new one.
        </p>
        <div className="product-workspace__actions">
          <Link to="/products" className="primary-button products-button--compact">
            Back to Products
          </Link>
        </div>
      </section>
    );
  }

  const handleProductChange = (field, value) => {
    setDraftProduct((currentProduct) => {
      if (!currentProduct) {
        return currentProduct;
      }

      return {
        ...currentProduct,
        [field]: value,
      };
    });
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

  const handleAddVariant = () => {
    setDraftProduct((currentProduct) => {
      if (!currentProduct) {
        return currentProduct;
      }

      return {
        ...currentProduct,
        variants: [
          ...currentProduct.variants,
          createEmptyVariant(currentProduct.id, currentProduct.variants.length),
        ],
      };
    });
  };

  const handleDiscardChanges = () => {
    setDraftProduct(cloneProduct(sourceProduct));
  };

  const handleSaveChanges = async () => {
    const nextProduct = await updateProduct(productId, draftProduct);
    setDraftProduct(cloneProduct(nextProduct));
  };

  return (
    <div className="page-stack product-workspace">
      <section className="product-workspace__toolbar product-workspace__toolbar--leading-back">
        <div className="product-workspace__leading">
          <button type="button" className="utility-button product-back-button" onClick={() => navigateBack(navigate)}>
            Back
          </button>
          <div>
            <p className="section-kicker">Product page</p>
            <h2 className="product-workspace__title">{sourceProduct.name}</h2>
          </div>
        </div>

        <div className="product-workspace__actions">
          <button
            type="button"
            className="utility-button utility-button--danger product-workspace__action-button"
            onClick={handleDeleteProduct}
          >
            Delete Product
          </button>
          {hasUnsavedChanges ? (
            <>
              <button
                type="button"
                className="utility-button product-workspace__action-button"
                onClick={handleDiscardChanges}
              >
                Discard
              </button>
              <button
                type="button"
                className="primary-button products-button--compact product-workspace__action-button"
                onClick={handleSaveChanges}
              >
                Save Product
              </button>
            </>
          ) : null}
        </div>
      </section>

      <ProductDetailsPane
        product={draftProduct}
        drops={drops}
        onProductChange={handleProductChange}
        onVariantChange={handleVariantChange}
        onAddVariant={handleAddVariant}
        onDeleteVariant={handleDeleteVariant}
      />
    </div>
  );
}

export default ProductDetailPage;