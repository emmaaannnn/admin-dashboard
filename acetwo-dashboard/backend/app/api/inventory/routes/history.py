from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.api.inventory.schemas.history import (
    InventoryHistoryCreate,
    InventoryHistoryOut,
    InventoryHistoryUpdate,
)
from app.api.inventory.services import history_service
from uuid import UUID

router = APIRouter(prefix="/history", tags=["Inventory History"])

@router.post("/", response_model=InventoryHistoryOut)
def add_history(entry: InventoryHistoryCreate, db: Session = Depends(get_db)):
    return history_service.create_history(db, entry)

@router.put("/{history_id}", response_model=InventoryHistoryOut)
def update_history(history_id: UUID, updates: InventoryHistoryUpdate, db: Session = Depends(get_db)):
    return history_service.update_history(db, history_id, updates)

@router.delete("/{history_id}")
def delete_history(history_id: UUID, db: Session = Depends(get_db)):
    return history_service.delete_history(db, history_id)

