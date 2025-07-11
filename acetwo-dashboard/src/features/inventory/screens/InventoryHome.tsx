import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import ItemList from '../components/ItemList';
import { getItems } from '../api/getItems';
import type { Item } from '../types/itemTypes';

import '/src/styles/inventory/inventoryHome.css';

const InventoryHome: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Fetch items from the API when the component mounts
  const fetchItems = async () => {
    try {
      const data = await getItems();
      setItems(data);
      setHasUnsavedChanges(false); // Reset changes when re-fetching
    } catch (error) {
      console.error("Failed to fetch items:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);


  const handleItemChanged = () => {
    console.log("An item was changed.");
    setHasUnsavedChanges(true);
  };

  const discardChanges = async () => {
    setLoading(true);
    await fetchItems(); // Re-fetch items from DB
  };

  const saveChanges = () => {
    // TODO: Implement your save logic here (e.g. send updated items to backend)
    console.log("Saving changes...");
    setHasUnsavedChanges(false);
  };

  return (
    <section className="inventory-home">
      <h1>📦 Inventory Dashboard</h1>
      <Link to="/inventory/history" className="inventory-history">📜 Inventory History</Link>

      <div className="inventory-actions">
        {hasUnsavedChanges ? (
          <>
            <button className="discard-button" onClick={discardChanges}>🗑️ Discard Changes</button>
            <button className="save-button" onClick={saveChanges}>💾 Save Changes</button>
          </>
        ) : (
          <Link to="/inventory/new" className="add-button">➕ Add New Item</Link>
        )}
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