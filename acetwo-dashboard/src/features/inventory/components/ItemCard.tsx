import React, { useState } from "react";
import type { Item } from "../types/itemTypes";

type ItemCardProps = {
  item: Item;
  onChanged?: () => void;
};

const ItemCard: React.FC<ItemCardProps> = ({ item, onChanged }) => {
  const [availabilityStatus, setAvailabilityStatus] = useState(
    item.is_available ? "Available" : "Hidden"
  );
  const [localQuantities, setLocalQuantities] = useState<Record<string, number>>(
    { ...item.size_quantities }
  );

  const totalQuantity = Object.values(localQuantities).reduce(
    (acc, qty) => acc + qty,
    0
  );

  const handleAvailabilityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    if (newValue === availabilityStatus) return;
    setAvailabilityStatus(newValue);
    onChanged?.();
  };

  const updateQuantity = (size: string, newQty: number) => {
    setLocalQuantities((prev) => ({ ...prev, [size]: newQty }));
    onChanged?.();
  };

  return (
    <div className="item-card-container">
      <div className="item-card">
        {/* Image */}
        <div
          className="item-image"
          style={{
            backgroundImage: `url(${item.image_urls[0]})`,
          }}
        />

        {/* Name, Price, Quantity */}
        <div className="item-info">
          <div className="item-name">{item.name}</div>
          <div className="item-price">Price: ${item.display_price.toFixed(2)}</div>
          <div className="item-quantity">Qty: {totalQuantity}</div>
        </div>

        {/* Availability */}
        <div className="item-availability">
          {item.is_out_of_stock ? (
            <span className="out-of-stock">Out of Stock</span>
          ) : (
            <select
              value={availabilityStatus}
              onChange={handleAvailabilityChange}
              className="availability-select"
            >
              <option value="Available">Available</option>
              <option value="Hidden">Hidden</option>
            </select>
          )}
        </div>

        {/* Size/Quantity Controls */}
        <div className="size-quantity-wrapper">
          {Object.entries(localQuantities).map(([size, qty]) => (
            <div className="size-quantity-control" key={size}>
              <span>{size}: </span>
              <input
                type="number"
                min={0}
                value={qty}
                onChange={(e) => updateQuantity(size, Math.max(0, parseInt(e.target.value) || 0))}
                className="quantity-input"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ItemCard;