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

  const [draftSizes, setDraftSizes] = useState(editableItem.sizes);
  const [useIndividualPricing, setUseIndividualPricing] = useState(false);
  const [showSale, setShowSale] = useState(false);

  const handleSizeCommit = (index: number) => {
    const oldSize = editableItem.sizes[index];
    const newSize = draftSizes[index];

    if (oldSize === newSize) return; // no change

    const updateKey = (record: Record<string, any>) => {
      const { [oldSize]: value, ...rest } = record;
      return { ...rest, [newSize]: value };
    };

    const newSizes = [...editableItem.sizes];
    newSizes[index] = newSize;

    setEditableItem({
      ...editableItem,
      sizes: newSizes,
      size_ids: updateKey(editableItem.size_ids),
      size_prices: updateKey(editableItem.size_prices),
      size_quantities: updateKey(editableItem.size_quantities),
      size_sale_prices: updateKey(editableItem.size_sale_prices || {}),
      size_sale_percents: updateKey(editableItem.size_sale_percents || {}),
    });
  };

  const handleSizeTyping = (index: number, newValue: string) => {
    const updated = [...draftSizes];
    updated[index] = newValue;
    setDraftSizes(updated);
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

  const handleChange = <K extends keyof Item>(key: K, value: Item[K]) => {
    const updated = { ...editableItem, [key]: value };
    setEditableItem(updated);
    onChange?.(updated);
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


          {/* OTHER INFO */}
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
          </div>
          
          {/* AVAILABILITY AND ARCHIVE TOGGLE */}
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

          {/* ID Section */}
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

          {/* SIZE SECTION */}
          <div className="size-section">
            <h4>Sizes:</h4>
            {editableItem.sizes.map((size, index) => (
              <div key={size} className="size-row">
                {/* Size name */}
                <input
                  type="text"
                  value={draftSizes[index]}
                  onChange={(e) => handleSizeTyping(index, e.target.value)}
                  onBlur={() => handleSizeCommit(index)} // Commit on blur
                  placeholder="Size"
                />

                {/* Size ID (readonly) */}
                <span className="size-id-label">
                  <strong>ID:</strong> {editableItem.size_ids[size] || "—"}
                </span>

                {/* Quantity */}
                <div className="size-quantity-wrapper">
                  <label htmlFor={`qty-${index}`}><strong>QTY:</strong></label>
                  <input
                    id={`qty-${index}`}
                    className="size-quantity-input"
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
                </div>
                
                {/* Delete button */}
                <button type="button" onClick={() => removeSizeRow(index)}>🗑</button>
              </div>
            ))}
            <button className="add-size-button" onClick={addSizeRow}>＋ Add Size</button>
          </div>


          {/* PRICE SECTION */}
          <div className="price-section">
            <h4>Price:</h4>

            {!useIndividualPricing ? (
              <>
                <div className="price-row">
                  <span className="prefix">$</span>
                  <input
                    type="number"
                    value={editableItem.display_price === 0 ? "" : editableItem.display_price}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      const updatedSizePrices: Record<string, number> = {};
                      editableItem.sizes.forEach((size) => {
                        updatedSizePrices[size] = isNaN(val) ? 0 : val;
                      });

                      setEditableItem((prev) => ({
                        ...prev,
                        display_price: isNaN(val) ? 0 : val,
                        size_prices: updatedSizePrices,
                      }));

                      onChange?.({
                        ...editableItem,
                        display_price: isNaN(val) ? 0 : val,
                        size_prices: updatedSizePrices,
                      });
                    }}
                    placeholder="Price"
                  />

                  {showSale ? (
                    <>
                      <span className="sale-tag">SALE</span>

                      <div className="input-wrapper">
                        <span className="prefix">$</span>
                        <input
                          type="number"
                          value={editableItem.display_sale_price === 0 ? "" : editableItem.display_sale_price}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            const updatedSalePrices: Record<string, number> = {};
                            editableItem.sizes.forEach((size) => {
                              updatedSalePrices[size] = isNaN(val) ? 0 : val;
                            });

                            setEditableItem((prev) => ({
                              ...prev,
                              display_sale_price: isNaN(val) ? 0 : val,
                              size_sale_prices: updatedSalePrices,
                            }));

                            onChange?.({
                              ...editableItem,
                              display_sale_price: isNaN(val) ? 0 : val,
                              size_sale_prices: updatedSalePrices,
                            });
                          }}
                          placeholder="Sale Price"
                        />

                        <input
                          type="number"
                          value={editableItem.display_sale_percent === 0 ? "" : editableItem.display_sale_percent}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            const updatedSalePercents: Record<string, number> = {};
                            editableItem.sizes.forEach((size) => {
                              updatedSalePercents[size] = isNaN(val) ? 0 : val;
                            });

                            setEditableItem((prev) => ({
                              ...prev,
                              display_sale_percent: isNaN(val) ? 0 : val,
                              size_sale_percents: updatedSalePercents,
                            }));

                            onChange?.({
                              ...editableItem,
                              display_sale_percent: isNaN(val) ? 0 : val,
                              size_sale_percents: updatedSalePercents,
                            });
                          }}
                          placeholder="Sale %"
                        />
                        <span className="suffix">%</span>
                      </div>

                      <button
                        onClick={() => {
                          setShowSale(false);
                          setEditableItem((prev) => ({
                            ...prev,
                            display_sale_price: 0,
                            display_sale_percent: 0,
                            size_sale_prices: {},
                            size_sale_percents: {},
                          }));
                          onChange?.({
                            ...editableItem,
                            display_sale_price: 0,
                            display_sale_percent: 0,
                            size_sale_prices: {},
                            size_sale_percents: {},
                          });
                        }}
                      >
                        Remove Sale
                      </button>
                    </>
                  ) : (
                    <button onClick={() => setShowSale(true)}>Add Sale</button>
                  )}
                </div>

                <button
                  className="use-individual-pricing"
                  onClick={() => {
                    setUseIndividualPricing(true);
                    setEditableItem((prev) => ({
                      ...prev,
                      display_price: 0,
                      display_sale_price: 0,
                      display_sale_percent: 0,
                    }));
                    onChange?.({
                      ...editableItem,
                      display_price: 0,
                      display_sale_price: 0,
                      display_sale_percent: 0,
                    });
                  }}
                >
                  Use Individual Pricing
                </button>
              </>
            ) : (
              <>
                {editableItem.sizes.map((size) => (
                  <div key={size} className="price-row">
                    <span>
                      <strong>{size}:</strong>
                    </span>

                    <div className="input-wrapper">
                      <span className="prefix">$</span>
                      <input
                        type="number"
                        value={editableItem.size_prices?.[size] ?? ""}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          const updated = { ...editableItem.size_prices, [size]: isNaN(val) ? 0 : val };
                          setEditableItem((prev) => ({ ...prev, size_prices: updated }));
                          onChange?.({ ...editableItem, size_prices: updated });
                        }}
                        placeholder="Price"
                      />
                    </div>

                    {editableItem.size_sale_prices?.[size] !== undefined ? (
                      <>
                        <span className="sale-tag">SALE</span>

                        <div className="input-wrapper">
                          <span className="prefix">$</span>
                          <input
                            type="number"
                            value={editableItem.size_sale_prices?.[size] ?? ""}
                            onChange={(e) => {
                              const val = parseFloat(e.target.value);
                              const updated = { ...editableItem.size_sale_prices, [size]: isNaN(val) ? 0 : val };
                              setEditableItem((prev) => ({ ...prev, size_sale_prices: updated }));
                              onChange?.({ ...editableItem, size_sale_prices: updated });
                            }}
                            placeholder="Sale Price"
                          />
                        </div>

                        <div className="input-wrapper">
                          <input
                            type="number"
                            value={editableItem.size_sale_percents?.[size] ?? ""}
                            onChange={(e) => {
                              const val = parseFloat(e.target.value);
                              const updated = { ...editableItem.size_sale_percents, [size]: isNaN(val) ? 0 : val };
                              setEditableItem((prev) => ({ ...prev, size_sale_percents: updated }));
                              onChange?.({ ...editableItem, size_sale_percents: updated });
                            }}
                            placeholder="Sale %"
                          />
                          <span className="suffix">%</span>
                        </div>

                        <button
                          onClick={() => {
                            const { [size]: _, ...salePrices } = editableItem.size_sale_prices ?? {};
                            const { [size]: __, ...salePercents } = editableItem.size_sale_percents ?? {};

                            setEditableItem((prev) => ({
                              ...prev,
                              size_sale_prices: salePrices,
                              size_sale_percents: salePercents,
                            }));

                            onChange?.({
                              ...editableItem,
                              size_sale_prices: salePrices,
                              size_sale_percents: salePercents,
                            });
                          }}
                        >
                          Remove Sale
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => {
                          setEditableItem((prev) => ({
                            ...prev,
                            size_sale_prices: {
                              ...(prev.size_sale_prices ?? {}),
                              [size]: 0,
                            },
                            size_sale_percents: {
                              ...(prev.size_sale_percents ?? {}),
                              [size]: 0,
                            },
                          }));
                        }}
                      >
                        Add Sale
                      </button>
                    )}
                  </div>
                ))}

                <button
                  onClick={() => {
                    setUseIndividualPricing(false);
                    setEditableItem((prev) => ({
                      ...prev,
                      size_prices: {},
                      size_sale_prices: {},
                      size_sale_percents: {},
                    }));
                    onChange?.({
                      ...editableItem,
                      size_prices: {},
                      size_sale_prices: {},
                      size_sale_percents: {},
                    });
                  }}
                >
                  Add Global Pricing
                </button>
              </>
            )}
          </div>



          {/* OTHER INFO */}
          <div className="description">
            <h4>Description:</h4>
            <textarea
              rows={5}
              value={editableItem.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
            />
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
