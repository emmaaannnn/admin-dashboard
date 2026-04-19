from sqlalchemy.orm import Session
from app.api.inventory.models.history import InventoryHistory
from app.api.inventory.schemas.history import InventoryHistoryCreate, InventoryHistoryUpdate
from uuid import UUID

def create_history(db: Session, history_data: InventoryHistoryCreate):
    history = InventoryHistory(**history_data.dict())
    db.add(history)
    db.commit()
    db.refresh(history)
    return history

def update_history(db: Session, history_id: UUID, updates: InventoryHistoryUpdate):
    history = db.query(InventoryHistory).filter(InventoryHistory.id == history_id).first()
    if history:
        for field, value in updates.dict(exclude_unset=True).items():
            setattr(history, field, value)
        db.commit()
        db.refresh(history)
    return history

def delete_history(db: Session, history_id: UUID):
    history = db.query(InventoryHistory).filter(InventoryHistory.id == history_id).first()
    if history:
        db.delete(history)
        db.commit()
    return history