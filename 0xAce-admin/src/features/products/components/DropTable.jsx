import { Link } from "react-router-dom";
import { formatDate } from "../../../shared/lib/formatters";
import "./styles/DropTable.css";

function DropTable({ drops, productCounts, selectedDropId, onSelectDrop, onRemoveDrop }) {
  return (
    <section className="drops-table">
      <header className="drops-table__header">
        <span>Collection</span>
        <span>Launch</span>
        <span>Products</span>
        <span>Status</span>
        <span>Actions</span>
      </header>

      <button
        type="button"
        className={`drops-table__row drops-table__row--actionable${selectedDropId === "all" ? " is-selected" : ""}`}
        onClick={() => onSelectDrop("all")}
      >
        <div className="drops-table__detail">
          <strong>All collections</strong>
          <span>Show the full catalog</span>
        </div>
        <div>All dates</div>
        <div>All</div>
        <div>
          <span className="status-pill status-pill--in_stock">All</span>
        </div>
        <div className="drops-table__actions">
          <span className="drops-table__selected-tag">Selected</span>
        </div>
      </button>

      {drops.map((drop) => (
        <div key={drop.id} className={`drops-table__row-shell${selectedDropId === drop.id ? " is-selected" : ""}`}>
          <div className={`drops-table__row drops-table__row--actionable${selectedDropId === drop.id ? " is-selected" : ""}`}>
            <button
              type="button"
              className="drops-table__summary"
              onClick={() => onSelectDrop(drop.id)}
            >
              <div className="drops-table__detail">
                <strong>{drop.name}</strong>
                <span>/{drop.slug}</span>
              </div>
              <div>{formatDate(drop.launch_date)}</div>
              <div>{productCounts[drop.id] ?? 0}</div>
              <div>
                <span className={`status-pill status-pill--${drop.state}`}>
                  {drop.state.replace("_", " ")}
                </span>
              </div>
              <div className="drops-table__selection">
                {selectedDropId === drop.id ? "Selected" : "Select"}
              </div>
            </button>

            <div className="drops-table__actions">
              <Link to={`/products/drops/${drop.id}/edit`} className="utility-button">
                Edit
              </Link>
              <button
                type="button"
                className="utility-button utility-button--danger"
                onClick={() => onRemoveDrop(drop.id)}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}

export default DropTable;