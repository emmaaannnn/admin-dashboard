from sqlalchemy import Column, String, Float, Boolean, DateTime, JSON, Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from .history import InventoryHistory

from app.db.database import Base

import uuid
from enum import Enum as PyEnum
from datetime import datetime, timezone

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

    # Initializes size-based quantities and prices with default values
    def define_item_sizes(self, sizes: list[str]):
        self.size_quantities = {size: 0 for size in sizes}
        self.size_prices = {size: 0.0 for size in sizes}

    # Returns the final sale price for a given size, considering various discount strategies
    def get_final_price_for_size(self, size: str) -> float:
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
        self.size_prices = {size.upper(): price for size, price in self.size_prices.items()}
        self.size_quantities = {size.upper(): qty for size, qty in self.size_quantities.items()}
        self.size_sale_prices = {size.upper(): price for size, price in self.size_sale_prices.items()}
        self.size_sale_percents = {size.upper(): percent for size, percent in self.size_sale_percents.items()}

    # --- SQLAlchemy columns ---
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    description = Column(String)

    size_quantities = Column(JSON, default={})  # e.g. {"S": 5, "M": 2}
    size_prices = Column(JSON, default={})                           # e.g. {"S": 49.99, "M": 59.99}

    sale_price = Column(Float, nullable=True)              # Global flat price
    sale_percent = Column(Float, nullable=True)            # Global percent (e.g. 20 = 20%)

    size_sale_prices = Column(JSON, default={})            # {"S": 39.99, "M": 44.99}
    size_sale_percents = Column(JSON, default={})          # {"S": 10, "M": 15}

    is_available = Column(Boolean, default=True)
    is_archived = Column(Boolean, default=False)
    image_urls = Column(JSON, default=default_image_urls)
    last_updated=datetime.now(timezone.utc),
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
        final_prices = [
            self.get_final_price_for_size(size)
            for size in self.size_prices.keys()
        ]
        if not final_prices:
            return 0.0
        freq = Counter(final_prices)
        return freq.most_common(1)[0][0]