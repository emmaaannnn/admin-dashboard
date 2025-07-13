import React, { useState } from "react";
import type { Item } from "../types/itemTypes";

type ItemInfoProps = {
  item: Item;
};

const ItemInfo: React.FC<ItemInfoProps> = ({ item }) => {
  const [mainImage, setMainImage] = useState(item.image_urls[0]);

  const totalQuantity = Object.values(item.size_quantities).reduce(
    (sum, qty) => sum + qty,
    0
  );

  return (
    <div className="inventory-home">
      <h1 className="item-title">{item.name}</h1>

      <div className="left-info">
        {/* Left Side */}
        <div className="image-container">
          <img className="main-image" src={mainImage} alt={item.name} />
          <div className="thumbnail-row">
            {item.image_urls.map((url, index) => (
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
            <p dangerouslySetInnerHTML={{ __html: item.description || "" }} />
          </div>
        </div>

        {/* Right Side */}
        <div className="right-info">
          {/* Price Section */}
          <div className="price-section">
            <h4>Price:</h4>
            {item.is_on_sale ? (
              <>
                <span className="original-price">
                  ${item.display_price.toFixed(2)}
                </span>
                <span className="sale-price">
                  ${item.display_sale_price.toFixed(2)} (
                  {item.display_sale_percent}% OFF)
                </span>
              </>
            ) : (
              <span>${item.display_price.toFixed(2)}</span>
            )}
          </div>

          {/* Sizes and Quantities */}
          <div className="size-section">
            <h4>Sizes:</h4>
            {item.sizes.map((size) => (
              <div key={size} className="size-line">
                {size}: {item.size_quantities[size]} in stock
              </div>
            ))}
            <div>Total Quantity: {totalQuantity}</div>
          </div>

          {/* Other Info */}
          <div className="other-info">
            <div><strong>Collection:</strong> {item.collection || "N/A"}</div>
            <div><strong>Clothing Type:</strong> {item.clothing_type}</div>
            <div><strong>Available:</strong> {item.is_available ? "Yes" : "No"}</div>
            <div><strong>Archived:</strong> {item.is_archived ? "Yes" : "No"}</div>
            <div><strong>Last Updated:</strong> {new Date(item.last_updated).toLocaleString()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemInfo;
