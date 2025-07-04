from pydantic import BaseModel, Field
from enum import Enum
from typing import Dict, List, Optional
from datetime import datetime

class ClothingType(str, Enum):
    tshirt = "tshirt"
    pants = "pants"
    shorts = "shorts"
    jacket = "jacket"
    hoodie = "hoodie"
    accessories = "accessories"

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
    last_updated: Optional[datetime] = Field(default_factory=datetime.utcnow)
    collection: Optional[str] = None
    clothing_type: ClothingType

class ItemCreate(ItemBase):
    pass

class ItemRead(ItemBase):
    id: str

    class Config:
        orm_mode = True