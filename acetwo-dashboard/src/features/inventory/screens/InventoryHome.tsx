import React from 'react';
import { Link } from 'react-router-dom';

const InventoryHome: React.FC = () => {
  return (
    <section className="inventory-home">
      <h2>📦 Inventory Dashboard</h2>

      <div className="inventory-actions">
        <Link to="/inventory/manage" className="inventory-button">🗃️ Manage Items</Link>
        <Link to="/inventory/history" className="inventory-button">📜 Inventory History</Link>
        <Link to="/inventory/new" className="inventory-button">➕ Add New Item</Link>
      </div>
    </section>
  );
};

export default InventoryHome;