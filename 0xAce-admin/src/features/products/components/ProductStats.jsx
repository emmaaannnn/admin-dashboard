import "./styles/ProductStats.css";

function ProductStats({ cards, activeFilter, onSelectFilter }) {
  return (
    <section className="products-stat-grid" aria-label="Inventory summary">
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

export default ProductStats;
