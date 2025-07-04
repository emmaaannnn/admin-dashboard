from fastapi import FastAPI
from db.database import Base, engine
from api.inventory.routes import items  # We'll make this file next

app = FastAPI(title="Inventory Management API")

# 👇 Create tables in SQLite (for development)
Base.metadata.create_all(bind=engine)

# 👇 Include route modules
app.include_router(items.router, prefix="/inventory", tags=["Items"])