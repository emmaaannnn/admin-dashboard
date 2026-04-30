import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProductEditorCard from "../components/ProductEditorCard";
import { cloneDrop, createEmptyDrop } from "../lib/productsState";
import { useProducts } from "../providers/ProductsProvider";
import { formatDate } from "../../../shared/lib/formatters";
import "./styles/ProductFormPage.css";

function navigateBack(navigate) {
  navigate("/products");
}

function EditDropsPage() {
  const navigate = useNavigate();
  const { dropId } = useParams();
  const { products, drops, getDropById, createDrop, updateDrop, removeDrop } = useProducts();
  const [selectedDropId, setSelectedDropId] = useState(dropId ?? "new");
  const [actionError, setActionError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (dropId) {
      setSelectedDropId(dropId);
    }
  }, [dropId]);

  const sourceDrop = selectedDropId !== "new" ? getDropById(selectedDropId) : null;
  const initialDraft = useMemo(() => {
    if (sourceDrop) {
      return cloneDrop(sourceDrop);
    }

    return createEmptyDrop(drops.length);
  }, [drops.length, sourceDrop]);
  const [draftDrop, setDraftDrop] = useState(initialDraft);

  useEffect(() => {
    setDraftDrop(initialDraft);
  }, [initialDraft]);

  const assignedProductCount = useMemo(
    () => products.filter((product) => product.drop_id === sourceDrop?.id).length,
    [products, sourceDrop?.id]
  );

  const handleSelectChange = (value) => {
    setActionError("");
    setSelectedDropId(value);
    if (value === "new") {
      navigate("/products/drops");
      return;
    }

    navigate(`/products/drops/${value}/edit`);
  };

  const handleSubmit = () => {
    setActionError("");

    if (sourceDrop) {
      updateDrop(sourceDrop.id, draftDrop);
      return;
    }

    const nextDrop = createDrop(draftDrop);
    setSelectedDropId(nextDrop.id);
    navigate(`/products/drops/${nextDrop.id}/edit`);
  };

  const handleDeleteDrop = async () => {
    if (!sourceDrop) {
      return;
    }

    const deleteMessage = assignedProductCount
      ? `Delete ${sourceDrop.name}? ${assignedProductCount} product${assignedProductCount === 1 ? " is" : "s are"} currently assigned to this drop and will become unassigned. This cannot be undone.`
      : `Delete ${sourceDrop.name}? This cannot be undone.`;

    if (!window.confirm(deleteMessage)) {
      return;
    }

    setActionError("");
    setIsDeleting(true);

    try {
      await removeDrop(sourceDrop.id);
      setSelectedDropId("new");
      navigate("/products/drops");
    } catch (error) {
      setActionError(error.message ?? "Failed to delete this drop.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="page-stack product-form-page">
      <section className="product-workspace__toolbar product-workspace__toolbar--leading-back">
        <div className="product-workspace__leading">
          <button type="button" className="utility-button product-back-button" onClick={() => navigateBack(navigate)}>
            Back
          </button>
          <div>
            <p className="section-kicker">Drop management</p>
            <h2 className="product-workspace__title">Edit drops</h2>
          </div>
        </div>

        <div className="product-workspace__actions">
          <button type="button" className="primary-button products-button--compact" onClick={handleSubmit}>
            {sourceDrop ? "Save changes" : "Create drop"}
          </button>
        </div>
      </section>

      <section className="detail-panel">
        <div className="detail-panel__header">
          <div>
            <p className="section-kicker">Drop workspace</p>
            <h2>{sourceDrop ? sourceDrop.name : "Create a new drop"}</h2>
            <p className="page-copy drop-page__summary-copy">
              {sourceDrop
                ? `${assignedProductCount} product${assignedProductCount === 1 ? "" : "s"} assigned • Launches ${formatDate(draftDrop.launch_date)}`
                : "Build a collection, control launch timing, and decide if it should appear on the home page."}
            </p>
          </div>

          <div className="drop-page__selector-shell">
            <label className="drop-page__selector-label" htmlFor="drop-selector">
              Open drop
            </label>
            <select
              id="drop-selector"
              className="editor-select drop-page__selector"
              value={selectedDropId}
              onChange={(event) => handleSelectChange(event.target.value)}
            >
              <option value="new">Create new drop</option>
              {drops.map((drop) => (
                <option key={drop.id} value={drop.id}>
                  {drop.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {actionError ? <p className="drop-page__error">{actionError}</p> : null}

        <div className="detail-panel__grid detail-panel__grid--single">
          <ProductEditorCard title="Drop settings">
            <div className="editor-fields">
              <div className="drop-settings-grid">
                <label className="field-stack">
                  <span>Name</span>
                  <input
                    className="editor-input"
                    type="text"
                    value={draftDrop.name}
                    onChange={(event) =>
                      setDraftDrop((currentDrop) => ({
                        ...currentDrop,
                        name: event.target.value,
                      }))
                    }
                  />
                </label>

                <label className="field-stack">
                  <span>Slug</span>
                  <input
                    className="editor-input"
                    type="text"
                    value={draftDrop.slug}
                    onChange={(event) =>
                      setDraftDrop((currentDrop) => ({
                        ...currentDrop,
                        slug: event.target.value,
                      }))
                    }
                  />
                </label>

                <label className="field-stack">
                  <span>Status</span>
                  <select
                    className="editor-select"
                    value={draftDrop.state}
                    onChange={(event) =>
                      setDraftDrop((currentDrop) => ({
                        ...currentDrop,
                        state: event.target.value,
                      }))
                    }
                  >
                    <option value="live">Live</option>
                    <option value="coming_soon">Coming soon</option>
                    <option value="archived">Archived</option>
                  </select>
                </label>

                <label className="field-stack">
                  <span>Launch date</span>
                  <input
                    className="editor-input"
                    type="date"
                    value={draftDrop.launch_date.slice(0, 10)}
                    onChange={(event) =>
                      setDraftDrop((currentDrop) => ({
                        ...currentDrop,
                        launch_date: new Date(event.target.value).toISOString(),
                      }))
                    }
                  />
                </label>
              </div>

              <div className="drop-feature-row">
                <div className="drop-feature-row__copy">
                  <span className="drop-feature-row__eyebrow">Home page</span>
                  <strong>Feature this drop</strong>
                  <p>
                    Highlight this collection in the storefront hero and home page collection slots.
                  </p>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={draftDrop.featured_on_home}
                  className={`drop-feature-toggle${draftDrop.featured_on_home ? " is-enabled" : ""}`}
                  onClick={() =>
                    setDraftDrop((currentDrop) => ({
                      ...currentDrop,
                      featured_on_home: !currentDrop.featured_on_home,
                    }))
                  }
                >
                  <span className="drop-feature-toggle__track" aria-hidden="true">
                    <span className="drop-feature-toggle__thumb" />
                  </span>
                  <span className="drop-feature-toggle__label">
                    {draftDrop.featured_on_home ? "Featured" : "Hidden"}
                  </span>
                </button>
              </div>
            </div>
          </ProductEditorCard>

          {sourceDrop ? (
            <ProductEditorCard title="Delete drop" className="drop-danger-card">
              <div className="drop-danger-zone">
                <p className="page-copy drop-danger-zone__copy">
                  Delete this collection if it should no longer exist. Assigned products will stay in the catalog and become unassigned.
                </p>

                <div className="drop-danger-zone__meta">
                  <div>
                    <span>Assigned products</span>
                    <strong>{assignedProductCount}</strong>
                  </div>
                  <div>
                    <span>Current status</span>
                    <strong>{draftDrop.state.replace("_", " ")}</strong>
                  </div>
                </div>

                <button
                  type="button"
                  className="utility-button utility-button--danger"
                  onClick={handleDeleteDrop}
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Delete drop"}
                </button>
              </div>
            </ProductEditorCard>
          ) : null}
        </div>
      </section>
    </div>
  );
}

export default EditDropsPage;