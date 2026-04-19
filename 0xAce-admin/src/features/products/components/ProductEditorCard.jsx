import "./styles/ProductEditorCard.css";

function ProductEditorCard({
  title,
  actionLabel,
  onAction,
  children,
  className = "",
  as: Component = "section",
}) {
  const classes = ["editor-card", className].filter(Boolean).join(" ");

  return (
    <Component className={classes}>
      <div className="editor-card__header">
        <h3>{title}</h3>
        {actionLabel ? (
          <button
            type="button"
            className="utility-button"
            onClick={onAction}
            disabled={!onAction}
          >
            {actionLabel}
          </button>
        ) : null}
      </div>

      {children}
    </Component>
  );
}

export default ProductEditorCard;