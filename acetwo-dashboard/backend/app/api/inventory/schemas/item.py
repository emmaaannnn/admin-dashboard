from pydantic import BaseModel, Field
from enum import Enum
from typing import Dict, List, Optional
from datetime import datetime
from collections import Counter

# Enum for clothing types
class ClothingType(str, Enum):
    tshirt = "T Shirt"
    pants = "Pants"
    shorts = "Shorts"
    outerwear = "Outerwear"
    hoodie = "Hoodie"
    jumper = "Jumper"
    accessories = "Accessories"

#  Base Shared Fields 
class ItemBase(BaseModel):
    name: str
    description: Optional[str] = None

    size_quantities: Dict[str, int]
    size_prices: Dict[str, float]

    size_sale_prices: Optional[Dict[str, float]] = None
    size_sale_percents: Optional[Dict[str, float]] = None

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
    base_id: str  # Use this instead of `id`
    sizes: List[str]
    size_ids: Dict[str, str]
    last_updated: datetime
    
    display_price: float
    display_sale_price: float
    display_sale_percent: float

    is_on_sale: bool
    is_out_of_stock: bool

    class Config:
        from_attributes = True  # For Pydantic v2

    @classmethod
    def from_orm(cls, obj):
        base = super().from_orm(obj)
        base.display_price = obj.display_price
        base.display_sale_price = obj.display_sale_price
        base.display_sale_percent = obj.display_sale_percent
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

    is_available: Optional[bool] = None
    is_archived: Optional[bool] = None
    image_urls: Optional[List[str]] = None
    collection: Optional[str] = None
    clothing_type: Optional[ClothingType] = None

#  Partial Update for home inventory screen
class ItemQuickEdit(BaseModel):
    size_quantities: Dict[str, int]
    is_available: bool
