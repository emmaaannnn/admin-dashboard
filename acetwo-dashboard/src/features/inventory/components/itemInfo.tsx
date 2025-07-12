import React from "react";
import type { Item } from "../types/itemTypes";

type ItemListProps = {
  items: Item[];
};

const ItemInfo: React.FC = () => {
  return (
    <div className="inventory-home">
      {/* Product Name */}
      <h1 className="item-title">{product.name}</h1>

      <div className="modal-body">
          {/* Left: Main Image & Thumbnails & Item Description*/}
          <div className="modal-image-container">
              <Magnifier className="modal-main-image" imageSrc={mainImage} alt={product.name} />
              <div className="thumbnail-row">
                <img
                  src={product.imageUrl}
                  alt="Front view"
                  onClick={() => setMainImage(product.imageUrl)}
                  className={`thumbnail ${mainImage === product.imageUrl ? "active" : ""}`}
                />
                <img
                  src={product.imageUrl2}
                  alt="Back view"
                  onClick={() => setMainImage(product.imageUrl2)}
                  className={`thumbnail ${mainImage === product.imageUrl2 ? "active" : ""}`}
                />
              </div>
            
            {/* Description */}
            <div className="modal-description"> 
              <h4>Description:</h4>
              <p dangerouslySetInnerHTML={{ __html: product.description }}></p>  
            </div>
          </div>

          {/* Right: Info */}
          <div className="modal-info">
            {/* Product Name */}
            <h1 className="item-title">Name: {product.name}</h1>

            {/* Price */}
            <div className="modal-price">
                {product.sale && product.salePrice ? (
                    <>
                    <span className="original-price">${product.price}</span>
                    <span className="sale-price">${product.salePrice} <span className="sale-label">SALE</span></span>
                    </>
                ) : (
                    <span>${product.price}</span>
                )}
            </div>

            {/* Availability */}
            {product.outOfStock ? (
            <div className="modal-sizes">
                <h4>Available Sizes:</h4>
                <p className="modal-sold-out">SOLD OUT</p>
            </div>
            ) : (
            <div className="modal-sizes">
                <h4>Available Sizes:</h4>
                <div className="size-list">
                    {product.availableSizes.map((size) => (
                        <span key={size} className="size-pill">{size}</span>
                    ))}
                </div>
            </div>
            )}

            {/* Purchase Button & Close Button */}
            <div className="modal-buttons">
                <a href="https://www.instagram.com/4ce.two"
                    target="_blank" rel="noopener noreferrer" className="purchase-button">
                    Purchase via Instagram
                </a>
            </div>
          </div>
      </div>
      <button onClick={onClose} className="close-button">Close</button>
    </div>
  );
};

export default ItemInfo;
