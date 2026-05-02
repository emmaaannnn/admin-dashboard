import { useId } from "react";
import "./styles/FilterStats.css";

function FilterStats({ cards, activeFilter, onSelectFilter, filterLabel = "Filter" }) {
  const filterId = useId();

  return (
    <>
      <div className="filter-stats-mobile">
        <label className="filter-stats-mobile__button" htmlFor={filterId}>
          <span className="filter-stats-mobile__eyebrow">{filterLabel}</span>
          <select
            id={filterId}
            className="filter-stats-mobile__select"
            value={activeFilter}
            onChange={(event) => onSelectFilter(event.target.value)}
          >
            {cards.map((card) => (
              <option key={card.id} value={card.id}>
                {card.label} ({card.value})
              </option>
            ))}
          </select>
        </label>
      </div>

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
    </>
  );
}

export default FilterStats;