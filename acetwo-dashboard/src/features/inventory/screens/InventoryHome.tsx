import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ItemList from '../components/ItemList';
import type { Item } from '../components/ItemList';

const InventoryHome: React.FC = () => {
  // Mock data
  const [items] = useState<Item[]>([
    {
      name: "Classic Tee",
      effectivePrice: 39.99,
      imageUrls: ["https://via.placeholder.com/80"],
      isAvailable: true,
      isOutOfStock: false,
      sizeQuantities: {
        S: 5,
        M: 10,
        L: 2,
      },
    },
    {
      name: "Oversized Hoodie",
      effectivePrice: 79.99,
      imageUrls: ["https://via.placeholder.com/80"],
      isAvailable: false,
      isOutOfStock: false,
      sizeQuantities: {
        M: 3,
        L: 8,
      },
    },
    {
      name: "Hoodie",
      effectivePrice: 79.99,
      imageUrls: ["https://via.placeholder.com/80"],
      isAvailable: false,
      isOutOfStock: true,
      sizeQuantities: {
        M: 0,
        L: 0,
      },
    },
  ]);

  const handleItemChanged = () => {
    console.log("An item was changed.");
    // You can set state here or trigger a save in the future
  };

  return (
    <section className="inventory-home">
      <h2>📦 Inventory Dashboard</h2>

      <div className="inventory-actions">
        <Link to="/inventory/new" className="inventory-button">➕ Add New Item</Link>
        <Link to="/inventory/history" className="inventory-button">📜 Inventory History</Link>
        <Link to="/inventory/save-changes" className="inventory-button">💾 Save Changes</Link>
      </div>

      {/* Item List */}
      <ItemList items={items} onItemChanged={handleItemChanged} />
    </section>
  );
};

export default InventoryHome;