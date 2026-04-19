import React from "react";
import ItemCard from "./ItemCard";
import type { Item } from "../types/itemTypes";

type ItemListProps = {
  items: Item[];
  onItemChanged?: () => void;
};

const ItemList: React.FC<ItemListProps> = ({ items, onItemChanged }) => {
  return (
    <div className="item-list">
      {items.map((item, index) => (
        <ItemCard key={index} item={item} onChanged={onItemChanged} />
      ))}
    </div>
  );
};

export default ItemList;
