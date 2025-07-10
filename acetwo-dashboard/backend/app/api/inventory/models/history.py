from sqlalchemy import Column, Integer, String, Enum, ForeignKey, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.db.database import Base
from enum import Enum as PyEnum
from datetime import datetime
import uuid

class InventoryAddReason(PyEnum):
    restock = "restock"
    return_item = "return_item"
    manual_adjustment = "manual_adjustment"
    transfer_in = "transfer_in"

class InventoryRemoveReason(PyEnum):
    faulty = "faulty"
    manual_adjustment = "manual_adjustment"
    transfer_out = "transfer_out"
    sold = "sold"

class InventoryHistory(Base):
    __tablename__ = "inventory_history"

    id = Column(Integer, primary_key=True, autoincrement=True)
    
    item_id = Column(String, nullable=False)        # size-specific id, e.g. "DEFH01001"
    base_id = Column(String, ForeignKey("items.base_id"), nullable=False)
    
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    quantity_changed = Column(Integer, nullable=False)
    reason = Column(String, nullable=False)
    note = Column(String, nullable=True)

    item = relationship("Item", back_populates="history")
