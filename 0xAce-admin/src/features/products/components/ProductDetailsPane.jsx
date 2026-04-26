import { useEffect, useRef, useState } from "react";
import ProductEditorCard from "./ProductEditorCard";
import ProductVariantTable from "./ProductVariantTable";
import { getProductFitLabel, isProductOnSale } from "../lib/productsState";
import "./styles/ProductDetailsPane.css";

const DESCRIPTION_ACTIONS = [
  { id: "paragraph", label: "P", title: "Paragraph" },
  { id: "bold", label: "B", title: "Bold" },
  { id: "italic", label: "I", title: "Italic" },
  { id: "ordered-list", label: "1.", title: "Numbered list" },
  { id: "list", label: "List", title: "Bullet list" },
  { id: "clear", label: "Clear", title: "Clear formatting" },
];

function HtmlDescriptionEditor({ value, onChange }) {
  const editorRef = useRef(null);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const syncValue = () => {
    if (!editorRef.current) {
      return;
    }

    onChange(editorRef.current.innerHTML);
  };

  const applyFormat = (action) => {
    if (!editorRef.current) {
      return;
    }

    editorRef.current.focus();

    if (action === "paragraph") {
      document.execCommand("formatBlock", false, "p");
    } else if (action === "bold") {
      document.execCommand("bold", false);
    } else if (action === "italic") {
      document.execCommand("italic", false);
    } else if (action === "ordered-list") {
      document.execCommand("insertOrderedList", false);
    } else if (action === "list") {
      document.execCommand("insertUnorderedList", false);
    } else if (action === "clear") {
      document.execCommand("removeFormat", false);
      document.execCommand("formatBlock", false, "p");
    }

    syncValue();
  };

  const handleKeyDown = (event) => {
    if (!(event.metaKey || event.ctrlKey)) {
      return;
    }

    const key = event.key.toLowerCase();

    if (key === "b") {
      event.preventDefault();
      applyFormat("bold");
      return;
    }

    if (key === "i") {
      event.preventDefault();
      applyFormat("italic");
      return;
    }

    if (key === "7" && event.shiftKey) {
      event.preventDefault();
      applyFormat("ordered-list");
      return;
    }

    if (key === "8" && event.shiftKey) {
      event.preventDefault();
      applyFormat("list");
      return;
    }

    if (key === "0" && event.altKey) {
      event.preventDefault();
      applyFormat("paragraph");
    }
  };

  useEffect(() => {
    if (!editorRef.current) {
      return;
    }

    const nextValue = value ?? "";

    if (editorRef.current.innerHTML !== nextValue) {
      editorRef.current.innerHTML = nextValue;
    }
  }, [value]);

  return (
    <div className="description-editor">
      <div className="description-editor__frame">
        <div className="description-editor__toolbar" aria-label="Description formatting toolbar">
          <div className="description-editor__tools">
            {DESCRIPTION_ACTIONS.map((action) => (
              <button
                key={action.id}
                type="button"
                className="description-editor__tool"
                title={action.title}
                aria-label={action.title}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => applyFormat(action.id)}
              >
                {action.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            className={`description-editor__help-toggle${isHelpOpen ? " is-open" : ""}`}
            aria-label="Show editor shortcuts"
            aria-expanded={isHelpOpen}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => setIsHelpOpen((currentValue) => !currentValue)}
          >
            ?
          </button>
        </div>

        {isHelpOpen ? (
          <div className="description-editor__help-panel">
            <span>Cmd/Ctrl+B for bold</span>
            <span>Cmd/Ctrl+I for italic</span>
            <span>Cmd/Ctrl+Shift+7 for numbered list</span>
            <span>Cmd/Ctrl+Shift+8 for bullet list</span>
          </div>
        ) : null}

        <div
          ref={editorRef}
          className="description-editor__surface"
          contentEditable
          suppressContentEditableWarning
          role="textbox"
          aria-label="Product description rich text editor"
          aria-multiline="true"
          data-placeholder="Write product copy here. Use the toolbar or shortcuts like Cmd/Ctrl+B and Cmd/Ctrl+I."
          onInput={syncValue}
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  );
}

function ProductDetailsPane({
  product,
  drops,
  onProductChange,
  onVariantChange,
  onAddVariant,
  kicker = "Active selection",
  title = product.name,
}) {
  const productIsOnSale = isProductOnSale(product);
  const fitLabel = getProductFitLabel(product);

  return (
    <section className="detail-panel">
      <div className="detail-panel__header">
        <div>
          <p className="section-kicker">{kicker}</p>
          <h2>{title}</h2>
        </div>

        <div className="detail-actions">
          {productIsOnSale ? <span className="status-pill status-pill--sale">Sale</span> : null}
          <span className={`status-pill status-pill--${product.status}`}>
            {product.status}
          </span>
        </div>
      </div>

      <div className="detail-panel__grid">
        <ProductEditorCard title="General Information">
          <div className="editor-fields">
            <label className="field-stack">
              <span>Product name</span>
              <input
                className="editor-input"
                type="text"
                value={product.name}
                onChange={(event) => onProductChange("name", event.target.value)}
              />
            </label>

            <label className="field-stack">
              <span>Slug</span>
              <input
                className="editor-input"
                type="text"
                value={product.slug}
                onChange={(event) => onProductChange("slug", event.target.value)}
              />
            </label>

            <label className="field-stack field-stack--wide">
              <span>Subtitle</span>
              <input
                className="editor-input"
                type="text"
                value={product.subtitle ?? ""}
                onChange={(event) => onProductChange("subtitle", event.target.value)}
              />
            </label>

            <div className="field-stack field-stack--wide">
              <span>Description</span>
              <HtmlDescriptionEditor
                value={product.description ?? ""}
                onChange={(nextValue) => onProductChange("description", nextValue)}
              />
            </div>

            <label className="field-stack field-stack--wide">
              <span>Fit type</span>
              <input className="editor-input" type="text" value={fitLabel} readOnly />
            </label>

            <label className="field-stack">
              <span>Drop selection</span>
              <select
                className="editor-select"
                value={product.drop_id}
                onChange={(event) => onProductChange("drop_id", event.target.value)}
              >
                {drops.map((drop) => (
                  <option key={drop.id} value={drop.id}>
                    {drop.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="field-stack">
              <span>Status</span>
              <select
                className="editor-select"
                value={product.status}
                onChange={(event) => onProductChange("status", event.target.value)}
              >
                <option value="active">Active</option>
                <option value="sold_out">Sold out</option>
                <option value="archived">Archived</option>
              </select>
            </label>
          </div>
        </ProductEditorCard>

        <ProductEditorCard
          as="aside"
          title="Media"
          actionLabel="Upload New"
          className="editor-card--media"
        >
          <div className="media-grid">
            {product.images.map((image) => (
              <div key={image.id} className="media-thumb-frame">
                <img src={image.image_url} alt={product.name} className="media-thumb" />
              </div>
            ))}
            <div className="media-thumb-frame media-thumb-frame--empty">Add More</div>
          </div>
        </ProductEditorCard>
      </div>

      <ProductVariantTable
        variants={product.variants}
        onVariantChange={onVariantChange}
        onAddVariant={onAddVariant}
      />
    </section>
  );
}

export default ProductDetailsPane;
