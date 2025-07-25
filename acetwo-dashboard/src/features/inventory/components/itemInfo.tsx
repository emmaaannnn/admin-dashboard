import React, { useState } from "react";
import type { Item } from "../types/itemTypes";

const clothingTypes = [
  "tshirt",
  "pants",
  "shorts",
  "outerwear",
  "hoodie",
  "jumper",
  "accessories",
] as const;

type ItemInfoProps = {
  item: Item;
  onChange?: (updatedItem: Item) => void;
};

const ItemInfo: React.FC<ItemInfoProps> = ({ item, onChange }) => {
  const [editableItem, setEditableItem] = useState<Item>({ ...item });
  const [mainImage, setMainImage] = useState(editableItem.image_urls[0]);
  const [availabilityStatus, setAvailabilityStatus] = useState(
    item.is_available ? "Available" : "Hidden"
  );
  const [archivedStatus, setArchivedStatus] = useState(
    item.is_archived ? "Active" : "Archived"
  );
  const [showSale, setShowSale] = useState(false);

  const handleChange = <K extends keyof Item>(key: K, value: Item[K]) => {
    const updated = { ...editableItem, [key]: value };
    setEditableItem(updated);
    onChange?.(updated);
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
        [newSize]: "",
      },
      size_prices: { ...editableItem.size_prices, [newSize]: 0 },
      size_quantities: { ...editableItem.size_quantities, [newSize]: 0 },
      size_sale_prices: { ...editableItem.size_sale_prices, [newSize]: 0 },
      size_sale_percents: { ...editableItem.size_sale_percents, [newSize]: 0 },
    });
  };

  const updateAllPrices = (price: number) => {
    const updated = { ...editableItem.size_prices };
    editableItem.sizes.forEach(size => (updated[size] = price));
    handleChange("size_prices", updated);
  };


  const handleAvailabilityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    if (newValue === availabilityStatus) return;
    setAvailabilityStatus(newValue);
  };

  const handleArchivedChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    if (newValue === archivedStatus) return;
    setArchivedStatus(newValue);
  };

  const generateSizeIds = (baseId: string, sizes: string[]) => {
    return sizes.reduce((acc, size, i) => {
      acc[size] = `${baseId}${String(i + 1).padStart(3, "0")}`;
      return acc;
    }, {} as Record<string, string>);
  };

  const removeSizeRow = (index: number) => {
    const sizeToRemove = editableItem.sizes[index];

    const updatedSizes = editableItem.sizes.filter((_, i) => i !== index);

    const deleteKey = (record: Record<string, any>) => {
      const { [sizeToRemove]: _, ...rest } = record;
      return rest;
    };

    const updatedItem = {
      ...editableItem,
      sizes: updatedSizes,
      size_ids: deleteKey(editableItem.size_ids),
      size_quantities: deleteKey(editableItem.size_quantities),
      size_prices: deleteKey(editableItem.size_prices),
      size_sale_prices: deleteKey(editableItem.size_sale_prices || {}),
      size_sale_percents: deleteKey(editableItem.size_sale_percents || {}),
    };

    setEditableItem(updatedItem);
    onChange?.(updatedItem); // ← Don't forget to notify parent
  };

  return (
    <div className="item-info-card">
      {/* NAME SECTION */}
      <div className="name-section">
        <h4>Name:</h4>
            <input
              type="text"
              value={editableItem.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
      </div>
      
      <div className="info-body">
        {/* LEFT SIDE */}
        <div className="left-info">
          <div className="main-image-container">
            {mainImage ? (
              <img className="main-image" src={mainImage} alt={editableItem.name} />
            ) : (
              <div className="main-image placeholder">No Image</div>
            )}
          </div>
          
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
          
          <button className="add-image-btn">＋ Add Image</button>
          
          <div className="description">
            <h4>Description:</h4>
            <textarea
              rows={5}
              value={editableItem.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </div>

          <div className="toggle-section">
            <div>
              <select
                value={availabilityStatus}
                onChange={handleAvailabilityChange}
                className={`available-select ${
                  availabilityStatus === "Available"
                    ? "available"
                    : "hidden"
                }`} 
              >
                <option value="Available">Available</option>
                <option value="Hidden">Hidden</option>
              </select>
            </div>
            <div>
              <select
                value={archivedStatus}
                onChange={handleArchivedChange}
                className={`archive-select ${
                  archivedStatus === "Active" 
                    ? "active" 
                    : "archived"
                }`}
              >
                <option value="Active">Active</option>
                <option value="Archived">Archived</option>
              </select>
            </div>
          </div> 
          
        </div>

        {/* RIGHT SIDE */}
        <div className="right-info">
          <div className="id-section">
            <h4>ID:</h4> 
            <input
              type="text"
              value={editableItem.base_id}
              onChange={(e) => {
                const newBaseId = e.target.value;
                const newSizeIds = generateSizeIds(newBaseId, editableItem.sizes);

                const updatedItem = {
                  ...editableItem,
                  base_id: newBaseId,
                  size_ids: newSizeIds,
                };

                setEditableItem(updatedItem);
                onChange?.(updatedItem);
              }}
            />
          </div>

          <div className="size-section">
            <h4>Sizes:</h4>
            {editableItem.sizes.map((size, index) => (
              <div key={size} className="size-row">
                {/* Size name */}
                <input
                  type="text"
                  value={size}
                  onChange={(e) => handleSizeEdit(index, e.target.value)}
                  placeholder="Size"
                />

                {/* Size ID (readonly) */}
                <input
                  type="text"
                  value={editableItem.size_ids[size] || ""}
                  placeholder="ID"
                  readOnly
                />

                {/* Quantity */}
                <input
                  type="number"
                  value={editableItem.size_quantities[size] ?? 0}
                  onChange={(e) =>
                    handleChange("size_quantities", {
                      ...editableItem.size_quantities,
                      [size]: +e.target.value,
                    })
                  }
                  placeholder="Qty"
                />
                {/* 🗑 Delete button */}
                <button type="button" onClick={() => removeSizeRow(index)}>🗑</button>
              </div>
            ))}
            <button onClick={addSizeRow}>＋ Add Size</button>
          </div>

          <div className="price-section">
            <label>Price:</label>
            <div className="price-row">
              <input
                type="number"
                value={editableItem.display_price}
                onChange={(e) => {
                  handleChange("display_price", parseFloat(e.target.value));
                  updateAllPrices(parseFloat(e.target.value));
                }}
                placeholder="Display Price"
              />
              <button onClick={() => setShowSale(!showSale)}>Add Sale</button>
            </div>

            {showSale && (
              <div className="sale-row">
                <input
                  type="number"
                  value={editableItem.display_sale_price}
                  onChange={(e) =>
                    handleChange("display_sale_price", parseFloat(e.target.value))
                  }
                  placeholder="Sale Price"
                />
                <input
                  type="number"
                  value={editableItem.display_sale_percent}
                  onChange={(e) =>
                    handleChange("display_sale_percent", parseFloat(e.target.value))
                  }
                  placeholder="Sale %"
                />
              </div>
            )}
          </div>

          <div className="other-info">
            <div>
              <strong>Collection:</strong>
              <input
                value={editableItem.collection || ""}
                onChange={(e) => handleChange("collection", e.target.value)}
              />
            </div>
            <div className="clothing-type-select">
              <strong>Clothing Type:</strong>
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
            <div className="last-updated">
              <strong>Last Updated:</strong> {new Date(editableItem.last_updated).toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemInfo;
