import React from "react";
import ItemCard from "./ItemCard";

export type Item = {
  name: string;
  effectivePrice: number;
  imageUrls: string[];
  isAvailable: boolean;
  isOutOfStock: boolean;
  sizeQuantities: Record<string, number>;
};

type ItemListProps = {
  items: Item[];
  onItemChanged?: () => void;
};

const ItemList: React.FC<ItemListProps> = ({ items, onItemChanged }) => {
  return (
    <div style={{ padding: 12, overflowY: "auto", maxHeight: "100vh" }}>
      {items.map((item, index) => (
        <ItemCard key={index} item={item} onChanged={onItemChanged} />
      ))}
    </div>
  );
};

export default ItemList;
