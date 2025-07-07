from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import datetime

class InventoryHistoryBase(BaseModel):
    item_id: UUID
    size: str
    quantity_changed: int
    reason: str
    note: Optional[str] = None

class InventoryHistoryCreate(InventoryHistoryBase):
    pass

class InventoryHistoryUpdate(BaseModel):
    size: Optional[str] = None
    quantity_changed: Optional[int] = None
    reason: Optional[str] = None
    note: Optional[str] = None

class InventoryHistoryOut(InventoryHistoryBase):
    id: UUID
    timestamp: datetime

    class Config:
        orm_mode = True