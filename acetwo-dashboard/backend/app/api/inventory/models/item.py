from sqlalchemy import Column, String, Float, Boolean, DateTime, JSON, Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from .history import InventoryHistory

from db.database import Base
import uuid
from enum import Enum as PyEnum
from datetime import datetime, timezone

class ClothingType(PyEnum):
    tshirt = "tshirt"
    pants = "pants"
    shorts = "shorts"
    jacket = "jacket"
    hoodie = "hoodie"
    accessories = "accessories"

def default_size_quantities():
    return {}

def default_image_urls():
    return []


class Item(Base):
    __tablename__ = "items"

    def define_item_sizes(self, sizes: list[str]):
        self.size_quantities = {size: 0 for size in sizes}
        self.size_prices = {size: 0.0 for size in sizes}


    def get_final_price_for_size(self, size: str) -> float:
        base_price = self.size_prices.get(size)
        if base_price is None:
            return 0.0

        # 1. Check size-specific final sale price
        if size in self.size_sale_prices:
            return self.size_sale_prices[size]

        # 2. Check size-specific sale percent
        if size in self.size_sale_percents:
            percent = self.size_sale_percents[size]
            return round(base_price * (1 - percent / 100), 2)

        # 3. Check global sale price
        if self.sale_price is not None:
            return self.sale_price

        # 4. Check global sale percent
        if self.sale_percent:
            return round(base_price * (1 - self.sale_percent / 100), 2)

        # 5. No sale
        return base_price

    def normalize_sizes_for_item(self):
        self.size_prices = {size.upper(): price for size, price in self.size_prices.items()}
        self.size_quantities = {size.upper(): qty for size, qty in self.size_quantities.items()}
        self.size_sale_prices = {size.upper(): price for size, price in self.size_sale_prices.items()}
        self.size_sale_percents = {size.upper(): percent for size, percent in self.size_sale_percents.items()}

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    description = Column(String)

    size_quantities = Column(JSON, default=default_size_quantities)  # e.g. {"S": 5, "M": 2}
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

    @property
    def is_on_sale(self):
        return bool(self.sale_price) or bool(self.size_sale_prices)

    @property
    def is_out_of_stock(self):
        return not self.size_quantities or all(qty == 0 for qty in self.size_quantities.values())
    
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