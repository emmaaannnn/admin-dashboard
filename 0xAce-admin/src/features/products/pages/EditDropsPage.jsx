import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProductEditorCard from "../components/ProductEditorCard";
import { cloneDrop, createEmptyDrop } from "../lib/productsState";
import { useProducts } from "../providers/ProductsProvider";
import "./ProductFormPage.css";

function navigateBack(navigate) {
  if (window.history.length > 1) {
    navigate(-1);
    return;
  }

  navigate("/products");
}

function EditDropsPage() {
  const navigate = useNavigate();
  const { dropId } = useParams();
  const { drops, getDropById, createDrop, updateDrop, removeDrop } = useProducts();
  const [selectedDropId, setSelectedDropId] = useState(dropId ?? "new");

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

  const handleSelectChange = (value) => {
    setSelectedDropId(value);
    if (value === "new") {
      navigate("/products/drops");
      return;
    }

    navigate(`/products/drops/${value}/edit`);
  };

  const handleSubmit = () => {
    if (sourceDrop) {
      updateDrop(sourceDrop.id, draftDrop);
      return;
    }

    const nextDrop = createDrop(draftDrop);
    setSelectedDropId(nextDrop.id);
    navigate(`/products/drops/${nextDrop.id}/edit`);
  };

  const handleRemove = () => {
    if (!sourceDrop) {
      return;
    }

    removeDrop(sourceDrop.id);
    setSelectedDropId("new");
    navigate("/products/drops");
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
          {sourceDrop ? (
            <button type="button" className="utility-button utility-button--danger" onClick={handleRemove}>
              Remove Drop
            </button>
          ) : null}
          <button type="button" className="primary-button products-button--compact" onClick={handleSubmit}>
            {sourceDrop ? "Save Drop" : "Create Drop"}
          </button>
        </div>
      </section>

      <section className="detail-panel">
        <div className="detail-panel__header">
          <div>
            <p className="section-kicker">Drop workspace</p>
            <h2>{sourceDrop ? sourceDrop.name : "Create a new drop"}</h2>
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

        <div className="detail-panel__grid detail-panel__grid--single">
          <ProductEditorCard title="Drop settings">
            <div className="editor-fields">
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

              <label className="field-stack field-stack--toggle">
                <span>Feature on home</span>
                <input
                  type="checkbox"
                  checked={draftDrop.featured_on_home}
                  onChange={(event) =>
                    setDraftDrop((currentDrop) => ({
                      ...currentDrop,
                      featured_on_home: event.target.checked,
                    }))
                  }
                />
              </label>
            </div>
          </ProductEditorCard>
        </div>
      </section>
    </div>
  );
}

export default EditDropsPage;