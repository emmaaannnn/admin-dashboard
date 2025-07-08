# seed_data.py

from db.database import SessionLocal, Base, engine
from api.inventory.models.item import Item, ClothingType
from datetime import datetime

# Create tables
Base.metadata.create_all(bind=engine)

# Start session
db = SessionLocal()

items = [
    Item(
        name="Black Oversized T-Shirt",
        description="Relaxed fit cotton t-shirt with ACE branding",
        size_quantities={"S": 10, "M": 15, "L": 8},
        size_prices={"S": 49.99, "M": 59.99, "L": 59.99},
        sale_price=39.99,  # Global flat sale price
        sale_percent=20,   # Used if sale_price isn't present
        is_available=True,
        is_archived=False,
        image_urls=[
            "https://example.com/black-tee-front.jpg",
            "https://example.com/black-tee-back.jpg"
        ],
        collection="Core",
        clothing_type=ClothingType.tshirt,
        last_updated=datetime.utcnow(),
    ),
    Item(
        name="ACE Denim Jacket",
        description="Distressed washed denim jacket",
        size_quantities={"M": 5, "L": 3},
        size_prices={"M": 109.99, "L": 109.99},
        is_available=True,
        is_archived=False,
        image_urls=["https://example.com/denim-jacket.jpg"],
        collection="Winter Drop",
        clothing_type=ClothingType.jacket,
        last_updated=datetime.utcnow(),
    ),
    Item(
        name="ACE Puffer Jacket",
        description="Ultra warm insulated puffer with hidden pockets",
        size_quantities={"M": 0, "L": 0, "XL": 0},  # Out of stock
        size_prices={"M": 159.99, "L": 159.99, "XL": 159.99},
        is_available=True,
        is_archived=False,
        image_urls=["https://example.com/puffer.jpg"],
        collection="Winter Drop",
        clothing_type=ClothingType.jacket,
        last_updated=datetime.utcnow(),
    ),
    Item(
        name="ACE Nylon Shorts",
        description="Quick-dry summer shorts with logo embroidery",
        size_quantities={"S": 8, "M": 6},
        size_prices={"S": 59.99, "M": 59.99},
        size_sale_prices={"S": 49.99, "M": 44.99},  # Size-based sale prices
        size_sale_percents={"S": 20, "M": 25},      # Size-based sale percents
        is_available=True,
        is_archived=False,
        image_urls=[
            "https://example.com/shorts-front.jpg",
            "https://example.com/shorts-back.jpg"
        ],
        collection="Summer Essentials",
        clothing_type=ClothingType.shorts,
        last_updated=datetime.utcnow(),
    ),
]

# Insert into DB
db.add_all(items)
db.commit()
db.close()

print("✅ Seeded initial inventory data into dev.db")
