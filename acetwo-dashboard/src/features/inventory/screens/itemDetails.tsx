import React, { useState, useEffect } from 'react';

import type { Item } from '../types/itemTypes';
import ItemInfo from '../components/itemInfo';



const ItemDetails: React.FC = () => {

  const discardChanges = async () => {
    // Logic to discard changes
    console.log("Changes discarded");

  };

  const saveChanges = () => {
    // Logic to save changes
    console.log("Changes saved");

  };


  return (
    <section className="inventory-home">
      <div className="inventory-header-row">
        <h1>📦 Item Details</h1>
      </div>

      <div className="item-actions-row">
        <button className="back-button" onClick={discardChanges}>Back</button>
        <button className="button" onClick={saveChanges}>💾 Save Changes</button>
      </div>

      <div className="item-details-container">
        <ItemInfo/>
      </div>
    </section>
  );
};

export default ItemDetails;