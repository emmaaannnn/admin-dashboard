from sqlalchemy import Column, String, Float, Boolean, DateTime, JSON, Enum
from sqlalchemy.dialects.postgresql import UUID
from db.database import Base
import uuid
from enum import Enum as PyEnum
from datetime import datetime

class ClothingType(PyEnum):
    tshirt = "tshirt"
    pants = "pants"
    shorts = "shorts"
    jacket = "jacket"
    hoodie = "hoodie"
    accessories = "accessories"

class Item(Base):
    __tablename__ = "items"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    description = Column(String)
    size_quantities = Column(JSON, default={})  # {'S': 10, 'M': 5}
    price = Column(Float, nullable=False)
    sale_price = Column(Float)
    sale_percent = Column(Float)
    is_on_sale = Column(Boolean, default=False)
    is_out_of_stock = Column(Boolean, default=False)
    is_available = Column(Boolean, default=True)
    is_archived = Column(Boolean, default=False)
    image_urls = Column(JSON, default=[])  # List of image URLs
    last_updated = Column(DateTime, default=datetime.utcnow)
    collection = Column(String)
    clothing_type = Column(Enum(ClothingType))