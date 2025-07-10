import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import ItemList from '../components/ItemList';
import { getItems } from '../api/getItems';
import type { Item } from '../types/itemTypes';

import '/src/styles/inventory/inventoryHome.css';

const InventoryHome: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await getItems();
        setItems(data);
      } catch (error) {
        console.error("Failed to fetch items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);


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
      {loading ? (
        <p>Loading items...</p>
      ) : (
        <div className="item-list-container">
          <ItemList items={items} onItemChanged={handleItemChanged} />
        </div>
      )}
    </section>
  );
};

export default InventoryHome;