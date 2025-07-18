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
  const [clothingType, setClothingType] = useState(item.clothing_type);

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
          style={{ backgroundImage: `url(${item.image_urls[0]})` }}
        />

        {/* Info 1 */}
        <div className="item-info">
          <div className="item-name">{item.name}</div>
          <div className="item-price">
            {item.is_on_sale ? (
              <>
                <span style={{ textDecoration: 'line-through', color: '#888', marginRight: '8px' }}>
                  ${item.display_price.toFixed(2)}
                </span>
                <span style={{ color: 'red', fontWeight: 'bold' }}>
                  ${item.display_sale_price.toFixed(2)}
                </span>
              </>
            ) : (
              <>Price: ${item.display_price.toFixed(2)}</>
            )}
          </div>
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
              className={`availability-select ${
                availabilityStatus === "Available"
                  ? "available"
                  : "hidden"
              }`} 
            >
              <option value="Available">Available</option>
              <option value="Hidden">Hidden</option>
            </select>
          )}
        </div>

        {/* Info 2 */}
        <div className="item-info-2">
          <div className="item-base-id">{item.base_id}</div>
          <div className="item-type">
            <label htmlFor={`clothing-type-${item.base_id}`}>Type: </label>
            <select
              id={`clothing-type-${item.base_id}`}
              value={clothingType}
              onChange={(e) => {
                setClothingType(e.target.value as Item["clothing_type"]);
                onChanged?.();
              }}
              className="type-select"
            >
              <option value="T Shirt">T Shirt</option>
              <option value="Pants">Pants</option>
              <option value="Shorts">Shorts</option>
              <option value="Outerwear">Outerwear</option>
              <option value="Hoodie">Hoodie</option>
              <option value="Jumper">Jumper</option>
              <option value="Accessories">Accessories</option>
            </select>
          </div>
        </div>

        {/* SALE Tag */}
        <div className="SaleTag">
          {item.is_on_sale ? (
            <div className="sale-label">SALE</div>
          ) : (
            <div></div>
          )}
        </div>



        {/* Size/Quantity - aligned far right */}
        <div className="size-quantity-wrapper">
          {Object.entries(localQuantities).map(([size, qty]) => (
            <div className="size-quantity-control" key={size}>
              {/* Quantity control with custom buttons */}
              <div className={`quantity-box ${qty === 0 ? 'out-of-stock' : ''}`}>

                <span className="size-label">{size}</span>

                <div className="quantity-controls">
                  <button
                    className="qty-btn up"
                    onClick={() => updateQuantity(size, qty + 1)}
                  >▲</button>

                  <input
                    type="number"
                    value={qty}
                    onChange={(e) =>
                      updateQuantity(size, Math.max(0, parseInt(e.target.value) || 0))
                    }
                    className="quantity-input"
                  />

                  <button
                    className="qty-btn down"
                    onClick={() => updateQuantity(size, Math.max(0, qty - 1))}
                  >▼</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

  );
};

export default ItemCard;