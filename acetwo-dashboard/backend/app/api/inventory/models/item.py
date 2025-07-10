from sqlalchemy import Column, String, Float, Boolean, DateTime, JSON, Enum
from sqlalchemy.orm import relationship
from sqlalchemy import func
from app.db.database import Base

from .history import InventoryHistory

from enum import Enum as PyEnum
from typing import List

# Enum for clothing types
class ClothingType(PyEnum):
    tshirt = "T Shirt"
    pants = "Pants"
    shorts = "Shorts"
    outerwear = "Outerwear"
    hoodie = "Hoodie"
    jumper = "Jumper"
    accessories = "Accessories"

def default_image_urls():
    return []

class Item(Base):
    __tablename__ = "items"

    # --- Utility methods ---

    # Generates size IDs based on the `base_id` and the sizes defined in `size_quantities`.
    def generate_size_ids(self):
        if not self.base_id:
            raise ValueError("base_id must be set before generating size_ids.")
        if not self.sizes:
            raise ValueError("sizes must be defined before generating size_ids.")

        self.size_ids = {
            size: f"{self.base_id}{str(i + 1).zfill(3)}"
            for i, size in enumerate(self.sizes)
        }
        
    # Initializes size-based quantities and prices with default values
    def define_item_sizes(self, sizes: List[str]):
        self.sizes = [s.upper() for s in sizes]
        self.size_quantities = {s: 0 for s in self.sizes}
        self.size_prices = {s: 0.0 for s in self.sizes}

    # Returns the final sale price for a given size, considering various discount strategies
    def get_final_price_for_size(self, size: str) -> float:
        size = size.upper()
        base_price = self.size_prices.get(size)
        if base_price is None:
            return 0.0

        # size-specific final sale price
        if size in self.size_sale_prices:
            return self.size_sale_prices[size]
        # size-specific sale percent
        if size in self.size_sale_percents:
            percent = self.size_sale_percents[size]
            return round(base_price * (1 - percent / 100), 2)
        # global sale price
        if self.sale_price is not None:
            return self.sale_price
        # global sale percent
        if self.sale_percent:
            return round(base_price * (1 - self.sale_percent / 100), 2)
        # No sale
        return base_price

    # Normalizes all size-related attributes to uppercase for consistency
    def normalize_sizes_for_item(self):
        # Uppercase and assign back
        self.sizes = [size.upper() for size in self.sizes or []]

        self.size_quantities = self.size_quantities or {}
        self.size_prices = self.size_prices or {}
        self.size_sale_prices = self.size_sale_prices or {}
        self.size_sale_percents = self.size_sale_percents or {}
        self.size_ids = self.size_ids or {}

        self.size_quantities = {size: self.size_quantities.get(size, 0) for size in self.sizes}
        self.size_prices = {size: self.size_prices.get(size, 0.0) for size in self.sizes}
        self.size_sale_prices = {size: self.size_sale_prices.get(size, 0.0) for size in self.sizes}
        self.size_sale_percents = {size: self.size_sale_percents.get(size, 0.0) for size in self.sizes}
        self.size_ids = {size: self.size_ids.get(size, None) for size in self.sizes}

    # --- SQLAlchemy columns ---

    base_id = Column(String, primary_key=True)  # Custom primary ID, like "DEFH01"
    size_ids = Column(JSON, default=dict)         # e.g. {"S": "DEFH01001", "M": "DEFH01002"}

    name = Column(String, nullable=False)
    description = Column(String)

    sizes = Column(JSON, default=list)  # List of sizes, e.g. ["S", "M", "L", "XL"]

    size_quantities = Column(JSON, default=dict)             # e.g. {"S": 5, "M": 2}
    size_prices = Column(JSON, default=dict)                 # e.g. {"S": 49.99, "M": 59.99}
    size_sale_prices = Column(JSON, default=dict)            # {"S": 39.99, "M": 44.99}
    size_sale_percents = Column(JSON, default=dict)          # {"S": 10, "M": 15}

    sale_price = Column(Float, nullable=True)              # Global flat price
    sale_percent = Column(Float, nullable=True)            # Global percent (e.g. 20 = 20%)

    is_available = Column(Boolean, default=True)
    is_archived = Column(Boolean, default=False)
    image_urls = Column(JSON, default=default_image_urls)
    last_updated = Column(DateTime(timezone=True), default=func.now(), onupdate=func.now())
    
    collection = Column(String)
    clothing_type = Column(Enum(ClothingType))

    history = relationship("InventoryHistory", back_populates="item", cascade="all, delete-orphan")

    # --- Derived properties ---

    # Indicates if the item is on sale based on sale price or size-specific discounts
    @property
    def is_on_sale(self):
        return bool(self.sale_price) or bool(self.size_sale_prices)

    # Indicates if the item is available for purchase (Checks stock)
    @property
    def is_out_of_stock(self):
        return not self.size_quantities or all(qty == 0 for qty in self.size_quantities.values())
    
    # Returns the price majority which will be used for display purposes
    @property
    def display_price(self) -> float:
        from collections import Counter
        prices = [self.get_final_price_for_size(s) for s in self.sizes]
        if not prices:
            return 0.0
        freq = Counter(prices)
        return freq.most_common(1)[0][0]