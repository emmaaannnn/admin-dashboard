import React, { useState } from "react";

type Item = {
  name: string;
  effectivePrice: number;
  imageUrls: string[];
  isAvailable: boolean;
  isOutOfStock: boolean;
  sizeQuantities: Record<string, number>;
};

type ItemCardProps = {
  item: Item;
  onChanged?: () => void;
};

const ItemCard: React.FC<ItemCardProps> = ({ item, onChanged }) => {
  const [availabilityStatus, setAvailabilityStatus] = useState(
    item.isAvailable ? "Available" : "Hidden"
  );
  const [localQuantities, setLocalQuantities] = useState<Record<string, number>>(
    { ...item.sizeQuantities }
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
    <div style={{ height: 120, margin: "8px 0" }}>
      <div style={{ display: "flex", padding: 12, border: "1px solid #ddd", borderRadius: 8 }}>
        {/* Image */}
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: 8,
            backgroundImage: `url(${item.imageUrls[0]})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundColor: "#eee",
          }}
        />

        <div style={{ width: 12 }} />

        {/* Name, Price, Quantity */}
        <div style={{ flex: 3, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ fontSize: 16, fontWeight: "bold" }}>{item.name}</div>
          <div style={{ marginTop: 6 }}>Price: ${item.effectivePrice.toFixed(2)}</div>
          <div>Qty: {totalQuantity}</div>
        </div>

        <div style={{ width: 12 }} />

        {/* Availability */}
        <div style={{ width: 100, textAlign: "center", alignSelf: "center" }}>
          {item.isOutOfStock ? (
            <span style={{ color: "red", fontWeight: 600 }}>Out of Stock</span>
          ) : (
            <select
              value={availabilityStatus}
              onChange={handleAvailabilityChange}
              style={{ fontWeight: 600 }}
            >
              <option value="Available" style={{ color: "green" }}>
                Available
              </option>
              <option value="Hidden" style={{ color: "blue" }}>
                Hidden
              </option>
            </select>
          )}
        </div>

        <div style={{ width: 12 }} />

        {/* Size/Quantity Controls */}
        <div style={{ flex: 4, display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "flex-end" }}>
          {Object.entries(localQuantities).map(([size, qty]) => (
            <div
              key={size}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "4px 8px",
                backgroundColor: "#f5f5f5",
                borderRadius: 16,
              }}
            >
              <span>{size}: </span>
              <input
                type="number"
                min={0}
                value={qty}
                onChange={(e) => updateQuantity(size, Math.max(0, parseInt(e.target.value) || 0))}
                style={{ width: 30, textAlign: "center", margin: "0 4px" }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
