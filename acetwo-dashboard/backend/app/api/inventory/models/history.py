from sqlalchemy import Column, Integer, String, Enum, ForeignKey, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from db.database import Base
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

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    item_id = Column(UUID(as_uuid=True), ForeignKey("items.id"), nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    size = Column(String, nullable=False)
    quantity_changed = Column(Integer, nullable=False)
    reason = Column(String, nullable=False)  # You may later use Enum or validate this in schema
    note = Column(String)

    item = relationship("Item", back_populates="history")
