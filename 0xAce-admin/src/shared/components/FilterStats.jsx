import "./styles/FilterStats.css";

function FilterStats({ cards, activeFilter, onSelectFilter }) {
  return (
    <section className="filter-stats-grid" aria-label="Workspace summary filters">
      {cards.map((card) => (
        <button
          key={card.id}
          type="button"
          className={`metric-card${activeFilter === card.id ? " is-active" : ""}${card.tone ? ` metric-card--${card.tone}` : ""}`}
          onClick={() => onSelectFilter(card.id)}
        >
          <span>{card.label}</span>
          <strong>{card.value}</strong>
          <small>{card.meta}</small>
        </button>
      ))}
    </section>
  );
}

export default FilterStats;