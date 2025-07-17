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

  const updateAllSalePrices = (salePrice: number) => {
    const updated = { ...editableItem.size_sale_prices };
    editableItem.sizes.forEach(size => (updated[size] = salePrice));
    handleChange("size_sale_prices", updated);
  };

  const updateAllSalePercents = (percent: number) => {
    const updated = { ...editableItem.size_sale_percents };
    editableItem.sizes.forEach(size => (updated[size] = percent));
    handleChange("size_sale_percents", updated);
  };

  return (
    <div className="item-info-card">
      {/* LEFT SIDE */}
      <div className="left-info">
        <div>
          <h4>Name:</h4>
          <input
            type="text"
            value={editableItem.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
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
          <button className="add-image-btn">＋ Add Image</button>
          <div className="description">
            <h4>Description:</h4>
            <textarea
              rows={5}
              value={editableItem.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="right-info">
        <div className="baseID-row">
          <h4>ID:</h4> <input
            type="text"
            value={editableItem.base_id}
            onChange={(e) => handleChange("base_id", e.target.value)}
          />
        </div>

        <div className="size-section">
          <h4>Sizes:</h4>
          {editableItem.sizes.map((size, index) => (
            <div key={size} className="size-line">
              <input
                type="text"
                value={size}
                onChange={(e) => handleSizeEdit(index, e.target.value)}
              />
              <input type="text" value={editableItem.size_ids[size] || ""} readOnly />
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
              />
            </div>
          ))}
          <button onClick={addSizeRow}>＋ Add Size</button>
        </div>

        <div className="price-section">
          <h4>Price:</h4>
          <input
            type="number"
            value={editableItem.display_price}
            onChange={(e) => {
              handleChange("display_price", parseFloat(e.target.value));
              updateAllPrices(parseFloat(e.target.value));
            }}
            placeholder="Display Price"
          />
          <h4>Sale Price:</h4>
          <input
            type="number"
            value={editableItem.display_sale_price}
            onChange={(e) => {
              handleChange("display_sale_price", parseFloat(e.target.value));
              updateAllSalePrices(parseFloat(e.target.value));
            }}
            placeholder="Display Sale Price"
          />
          <h4>Sale Percent:</h4>
          <input
            type="number"
            value={editableItem.display_sale_percent}
            onChange={(e) => {
              handleChange("display_sale_percent", parseFloat(e.target.value));
              updateAllSalePercents(parseFloat(e.target.value));
            }}
            placeholder="Display Sale %"
          />
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
          <div className="available-select">
            <select
              value={editableItem.is_available.toString()}
              onChange={(e) => handleChange("is_available", e.target.value === "true")}
            >
              <option value="true">Available</option>
              <option value="false">Hidden</option>
            </select>
          </div>
          <div className="archived-select">
            <select
              value={editableItem.is_archived.toString()}
              onChange={(e) => handleChange("is_archived", e.target.value === "true")}
            >
              <option value="false">Active</option>
              <option value="true">Archived</option>
            </select>
          </div>
          <div className="last-updated">
            <strong>Last Updated:</strong> {new Date(editableItem.last_updated).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemInfo;
