from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from db.database import Base, engine
from routes import item, history

# Optional: create tables automatically on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Acetwo Inventory Dashboard API",
    version="1.0.0",
    description="Backend API for managing items and inventory history",
)

# Allow frontend during dev
origins = [
    "http://localhost:3000",  # React frontend default
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(item.router)
app.include_router(history.router)