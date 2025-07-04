from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db.database import get_db
from api.inventory.schemas.item import ItemCreate, ItemUpdate, ItemQuickEdit, ItemRead
from api.inventory.services import item_service
from typing import List
from uuid import UUID

router = APIRouter(prefix="/items", tags=["Items"])

@router.get("/", response_model=List[ItemRead])
def get_items(db: Session = Depends(get_db)):
    return item_service.get_all_items(db)

@router.get("/{item_id}", response_model=ItemRead)
def get_item(item_id: UUID, db: Session = Depends(get_db)):
    return item_service.get_item_by_id(item_id, db)

@router.post("/", response_model=ItemRead, status_code=201)
def create_item(item: ItemCreate, db: Session = Depends(get_db)):
    return item_service.create_item(item, db)

@router.patch("/{item_id}", response_model=ItemRead)
def update_item(item_id: UUID, item: ItemUpdate, db: Session = Depends(get_db)):
    return item_service.update_item(item_id, item, db)

@router.patch("/{item_id}/quick-edit", response_model=ItemRead)
def quick_edit_item(item_id: UUID, edit: ItemQuickEdit, db: Session = Depends(get_db)):
    return item_service.quick_edit_item(item_id, edit, db)
