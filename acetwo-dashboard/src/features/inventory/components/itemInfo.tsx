import React, { useState } from "react";
import type { Item } from "../types/itemTypes";

type ItemInfoProps = {
  item: Item;
  onChange?: (updatedItem: Item) => void; // Optional change handler
};

const clothingTypes = [
  "tshirt",
  "pants",
  "shorts",
  "outerwear",
  "hoodie",
  "jumper",
  "accessories",
] as const;

const ItemInfo: React.FC<ItemInfoProps> = ({ item, onChange }) => {
  const [editableItem, setEditableItem] = useState<Item>({ ...item });
  const [mainImage, setMainImage] = useState(editableItem.image_urls[0]);

  const totalQuantity = Object.values(editableItem.size_quantities).reduce(
    (sum, qty) => sum + qty,
    0
  );

  const handleChange = <K extends keyof Item>(key: K, value: Item[K]) => {
    const updated = { ...editableItem, [key]: value };
    setEditableItem(updated);
    onChange?.(updated); // Optional parent update
  };

  const handleSizeEdit = (index: number, newSize: string) => {
  const oldSize = editableItem.sizes[index];
  const updatedSizes = [...editableItem.sizes];
  updatedSizes[index] = newSize;

  const updateKey = (record: Record<string, any>) => {
    const { [oldSize]: value, ...rest } = record;
    return { ...rest, [newSize]: value };
  };

  setEditableItem({
    ...editableItem,
    sizes: updatedSizes,
    size_ids: updateKey(editableItem.size_ids),
    size_prices: updateKey(editableItem.size_prices),
    size_quantities: updateKey(editableItem.size_quantities),
    size_sale_prices: updateKey(editableItem.size_sale_prices || {}),
    size_sale_percents: updateKey(editableItem.size_sale_percents || {}),
  });
};

const addSizeRow = () => {
  const newSize = "New Size " + (editableItem.sizes.length + 1);
  setEditableItem({
    ...editableItem,
    sizes: [...editableItem.sizes, newSize],
    size_ids: {
      ...editableItem.size_ids,
      [newSize]: "", // leave empty for backend to populate
    },
    size_prices: { ...editableItem.size_prices, [newSize]: 0 },
    size_quantities: { ...editableItem.size_quantities, [newSize]: 0 },
    size_sale_prices: { ...editableItem.size_sale_prices, [newSize]: 0 },
    size_sale_percents: { ...editableItem.size_sale_percents, [newSize]: 0 },
  });
};




  return (
    <div className="item-info-card">

      {/* Name */}
      <div className="name-row">
        <h4>Name:</h4>
        <input
          type="text"
          value={editableItem.name}
          onChange={(e) => handleChange("name", e.target.value)}
        />
      </div>

      <div className="left-info">
        {/* Image Section */}
        <div className="image-container">
          <img className="main-image" src={mainImage} alt={editableItem.name} />
          <div className="thumbnail-row">
            {editableItem.image_urls.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`Thumbnail ${index + 1}`}
                onClick={() => setMainImage(url)}
                className={`thumbnail ${mainImage === url ? "active" : ""}`}
              />
            ))}
          </div>

          {/* Description */}
          <div className="description">
            <h4>Description:</h4>
            <textarea
              rows={5}
              value={editableItem.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </div>
        </div>

        {/* Right Info */}
        <div className="right-info">
          {/* Name */}
          <div className="baseID-row">
            <h4>ID:</h4>
            <input
              type="text"
              value={editableItem.base_id}
              onChange={(e) => handleChange("base_id", e.target.value)}
            />
          </div>

          {/* Sizes */}
          <div className="size-section">
          <h4>Sizes:</h4>

          {editableItem.sizes.map((size, index) => (
            <div key={size} className="size-line">
              <input
                type="text"
                value={size}
                onChange={(e) => handleSizeEdit(index, e.target.value)}
                className="size-input"
              />
              <input
                type="text"
                value={editableItem.size_ids[size] || ""}
                readOnly
                className="readonly-id"
              />
              <input
                type="number"
                value={editableItem.size_prices[size] || 0}
                onChange={(e) =>
                  handleChange("size_prices", {
                    ...editableItem.size_prices,
                    [size]: parseFloat(e.target.value),
                  })
                }
                placeholder="Price"
                className="price-input"
              />
              <input
                type="number"
                value={editableItem.size_sale_prices?.[size] || 0}
                onChange={(e) =>
                  handleChange("size_sale_prices", {
                    ...editableItem.size_sale_prices,
                    [size]: parseFloat(e.target.value),
                  })
                }
                placeholder="Sale Price"
                className="sale-price-input"
              />
              <input
                type="number"
                value={editableItem.size_sale_percents?.[size] || 0}
                onChange={(e) =>
                  handleChange("size_sale_percents", {
                    ...editableItem.size_sale_percents,
                    [size]: parseFloat(e.target.value),
                  })
                }
                placeholder="Sale %"
                className="percent-input"
              />
              <input
                type="number"
                value={editableItem.size_quantities[size] || 0}
                onChange={(e) =>
                  handleChange("size_quantities", {
                    ...editableItem.size_quantities,
                    [size]: parseInt(e.target.value),
                  })
                }
                placeholder="Qty"
                className="qty-input"
              />
            </div>
          ))}

          <button onClick={addSizeRow} className="add-size-btn">＋ Add Size</button>
        </div>



          {/* Price Section */}
          <div className="price-section">
            <h4>Price:</h4>
            <input
              type="number"
              step="0.01"
              value={editableItem.display_price}
              onChange={(e) => handleChange("display_price", parseFloat(e.target.value))}
            />
            {editableItem.is_on_sale && (
              <>
                <input
                  type="number"
                  step="0.01"
                  value={editableItem.display_sale_price}
                  onChange={(e) =>
                    handleChange("display_sale_price", parseFloat(e.target.value))
                  }
                  className="sale-price-input"
                />
                <input
                  type="number"
                  value={editableItem.display_sale_percent}
                  onChange={(e) =>
                    handleChange("display_sale_percent", parseFloat(e.target.value))
                  }
                  className="sale-percent-input"
                />
              </>
            )}
          </div>

          {/* Other Info */}
          <div className="other-info">
            <div>
              <strong>Collection:</strong>{" "}
              <input
                value={editableItem.collection || ""}
                onChange={(e) => handleChange("collection", e.target.value)}
              />
            </div>
            <div>
              <strong>Clothing Type:</strong>{" "}
              <select
                value={editableItem.clothing_type}
                onChange={(e) =>
                  handleChange("clothing_type", e.target.value as Item["clothing_type"])
                }
              >
                {clothingTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <strong>Available:</strong>{" "}
              <select
                value={editableItem.is_available.toString()}
                onChange={(e) => handleChange("is_available", e.target.value === "true")}
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
            <div>
              <strong>Archived:</strong>{" "}
              <select
                value={editableItem.is_archived.toString()}
                onChange={(e) => handleChange("is_archived", e.target.value === "true")}
              >
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>
            <div>
              <strong>Last Updated:</strong>{" "}
              {new Date(editableItem.last_updated).toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemInfo;
