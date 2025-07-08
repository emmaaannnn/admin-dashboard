from pydantic import BaseModel, Field
from enum import Enum
from typing import Dict, List, Optional
from datetime import datetime
from collections import Counter

# Enum 
class ClothingType(str, Enum):
    tshirt = "tshirt"
    pants = "pants"
    shorts = "shorts"
    jacket = "jacket"
    hoodie = "hoodie"
    accessories = "accessories"

#  Base Shared Fields 
class ItemBase(BaseModel):
    name: str
    description: Optional[str] = None

    size_quantities: Dict[str, int]
    size_prices: Dict[str, float]

    size_sale_prices: Optional[Dict[str, float]] = None
    size_sale_percents: Optional[Dict[str, float]] = None

    sale_price: Optional[float] = None
    sale_percent: Optional[float] = None

    is_available: bool = True
    is_archived: bool = False
    image_urls: List[str] = Field(default_factory=list)
    collection: Optional[str] = None
    clothing_type: ClothingType

# Creation Schema 
class ItemCreate(ItemBase):
    pass

# Read Schema
class ItemRead(ItemBase):
    id: str
    last_updated: datetime
    display_price: float  # Most common price
    is_on_sale: bool
    is_out_of_stock: bool

    class Config:
        orm_mode = True

    @staticmethod
    def compute_display_price(size_prices: Dict[str, float]) -> float:
        from collections import Counter
        if not size_prices:
            return 0.0
        freq = Counter(size_prices.values())
        return freq.most_common(1)[0][0]  # Most common price

    @classmethod
    def from_orm(cls, obj):
        base = super().from_orm(obj)
        base.display_price = cls.compute_display_price(base.size_prices)
        base.is_on_sale = obj.is_on_sale
        base.is_out_of_stock = obj.is_out_of_stock
        return base

# Full Update (e.g. Item Screen)
class ItemUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None

    size_quantities: Optional[Dict[str, int]] = None
    size_prices: Optional[Dict[str, float]] = None

    size_sale_prices: Optional[Dict[str, float]] = None
    size_sale_percents: Optional[Dict[str, float]] = None

    sale_price: Optional[float] = None
    sale_percent: Optional[float] = None

    is_available: Optional[bool] = None
    is_archived: Optional[bool] = None
    image_urls: Optional[List[str]] = None
    collection: Optional[str] = None
    clothing_type: Optional[ClothingType] = None

#  Partial Update for home inventory screen
class ItemQuickEdit(BaseModel):
    size_quantities: Dict[str, int]
    is_available: bool
