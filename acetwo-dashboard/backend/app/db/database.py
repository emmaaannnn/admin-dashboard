from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os

# Load .env file from current folder
load_dotenv()

# Use DATABASE_URL from .env, or fallback to dev.db
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./dev.db")

# SQLite-specific config
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

# SQLAlchemy engine setup
engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()