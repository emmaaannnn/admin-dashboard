from sqlalchemy.orm import Session
from api.inventory.models.item import Item
from api.inventory.schemas.item import ItemCreate, ItemUpdate, ItemQuickEdit
from uuid import UUID
from fastapi import HTTPException
from datetime import datetime

def get_all_items(db: Session):
    return db.query(Item).all()

def get_item_by_id(item_id: UUID, db: Session):
    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return item

def create_item(item_data: ItemCreate, db: Session):
    new_item = Item(**item_data.dict())
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return new_item

def update_item(item_id: UUID, update_data: ItemUpdate, db: Session):
    item = get_item_by_id(item_id, db)
    for key, value in update_data.dict(exclude_unset=True).items():
        setattr(item, key, value)
    item.last_updated = datetime.utcnow()
    db.commit()
    db.refresh(item)
    return item

def quick_edit_item(item_id: UUID, edit_data: ItemQuickEdit, db: Session):
    item = get_item_by_id(item_id, db)
    item.size_quantities = edit_data.size_quantities
    item.is_available = edit_data.is_available
    item.last_updated = datetime.utcnow()
    db.commit()
    db.refresh(item)
    return item