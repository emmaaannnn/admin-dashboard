import "./styles/ViewModeToggle.css";

function ViewModeToggle({ activeMode, ariaLabel, options, onChange }) {
  return (
    <div className="view-mode-toggle" aria-label={ariaLabel}>
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          className={`view-mode-toggle__button${activeMode === option.id ? " is-active" : ""}`}
          onClick={() => onChange(option.id)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export default ViewModeToggle;