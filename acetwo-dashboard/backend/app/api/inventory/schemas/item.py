from pydantic import BaseModel, Field
from enum import Enum
from typing import Dict, List, Optional
from datetime import datetime

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
    price: float
    sale_price: Optional[float] = None
    sale_percent: Optional[float] = None
    is_on_sale: bool = False
    is_out_of_stock: bool = False
    is_available: bool = True
    is_archived: bool = False
    image_urls: List[str] = []
    collection: Optional[str] = None
    clothing_type: ClothingType

# Creation Schema 
class ItemCreate(ItemBase):
    pass

# Read Schema
class ItemRead(ItemBase):
    id: str
    last_updated: datetime

    class Config:
        orm_mode = True

# Full Update (e.g. Item Screen)
class ItemUpdate(BaseModel):
    name: Optional[str]
    description: Optional[str]
    size_quantities: Optional[Dict[str, int]]
    price: Optional[float]
    sale_price: Optional[float]
    sale_percent: Optional[float]
    is_on_sale: Optional[bool]
    is_out_of_stock: Optional[bool]
    is_available: Optional[bool]
    is_archived: Optional[bool]
    image_urls: Optional[List[str]]
    collection: Optional[str]
    clothing_type: Optional[ClothingType]

#  Partial Update for home inventory screen
class ItemQuickEdit(BaseModel):
    size_quantities: Dict[str, int]
    is_available: bool
