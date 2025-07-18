import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Item } from "../types/itemTypes";
import ItemInfo from "../components/itemInfo";
import "/src/styles/inventory/itemDetails.css"; // Assuming you have some styles for this component

const emptyItem: Item = {
  base_id: "",
  name: "",
  description: "",
  sizes: [],
  size_ids: {},
  size_quantities: {},
  size_prices: {},
  size_sale_prices: {},
  size_sale_percents: {},
  is_available: true,
  is_archived: false,
  image_urls: [],
  last_updated: new Date().toISOString(),
  collection: "",
  clothing_type: "T Shirt", // default enum value

  is_on_sale: false,
  is_out_of_stock: false,
  display_price: 0,
  display_sale_price: 0,
  display_sale_percent: 0,
};

const ItemDetails: React.FC = () => {
  const { base_id } = useParams(); // From /inventory/:base_id
  const [item, setItem] = useState<Item | null>(null);
  const navigate = useNavigate();

  const back = () => {
    navigate(-1);
  };

  const saveChanges = () => {
    console.log("Saved");
  };

  useEffect(() => {
    if (!base_id) {
      // New item
      setItem(emptyItem);
    } else {
    }
  }, [base_id]);

  if (!item) return <div>Loading...</div>;

  return (
    <section className="inventory-home">
      <div className="inventory-header-row">
        <h1>📦 Item Details</h1>
      </div>

      <div className="item-actions-row">
        <button className="back-button" onClick={back}>
          Back
        </button>
        <button className="save-button" onClick={saveChanges}>
          💾 Save Changes
        </button>
      </div>

      <div className="item-details-container">
        <ItemInfo item={item} />
      </div>
    </section>
  );
};

export default ItemDetails;
