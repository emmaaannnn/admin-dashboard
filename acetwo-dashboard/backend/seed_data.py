from app.db.database import SessionLocal, Base, engine
from app.api.inventory.models.item import Item, ClothingType
from datetime import datetime, timedelta, timezone

# Create tables
Base.metadata.create_all(bind=engine)

# Start session
db = SessionLocal()

def mock_utc(minutes_ago: int) -> datetime:
    return (datetime.now(timezone.utc) - timedelta(minutes=minutes_ago)).replace(second=0, microsecond=0)

items = [
    Item(
        base_id="ACET001",
        name="Black Oversized T-Shirt",
        description="Relaxed fit cotton t-shirt with ACE branding",
        sizes=["S", "M", "L"],
        size_quantities={"S": 10, "M": 15, "L": 8},
        size_prices={"S": 49.99, "M": 59.99, "L": 59.99},
        sale_price=39.99,
        sale_percent=20,
        is_available=True,
        is_archived=False,
        image_urls=[
            "https://example.com/black-tee-front.jpg",
            "https://example.com/black-tee-back.jpg"
        ],
        collection="Core",
        clothing_type=ClothingType.tshirt,
        last_updated=mock_utc(5),
    ),
    Item(
        base_id="ACET002",
        name="ACE Denim Jacket",
        description="Distressed washed denim jacket",
        sizes=["M", "L"],
        size_quantities={"M": 5, "L": 3},
        size_prices={"M": 109.99, "L": 109.99},
        is_available=True,
        is_archived=False,
        image_urls=["https://example.com/denim-jacket.jpg"],
        collection="Winter Drop",
        clothing_type=ClothingType.outerwear,
        last_updated=mock_utc(120),
    ),
    Item(
        base_id="ACET003",
        name="ACE Puffer Jacket",
        description="Ultra warm insulated puffer with hidden pockets",
        sizes=["M", "L", "XL"],
        size_quantities={"M": 0, "L": 0, "XL": 0},
        size_prices={"M": 159.99, "L": 159.99, "XL": 159.99},
        is_available=True,
        is_archived=False,
        image_urls=["https://example.com/puffer.jpg"],
        collection="Winter Drop",
        clothing_type=ClothingType.outerwear,
        last_updated=mock_utc(1440),
    ),
    Item(
        base_id="ACET004",
        name="ACE Nylon Shorts",
        description="Quick-dry summer shorts with logo embroidery",
        sizes=["S", "M"],
        size_quantities={"S": 8, "M": 6},
        size_prices={"S": 59.99, "M": 59.99},
        size_sale_prices={"S": 49.99, "M": 44.99},
        size_sale_percents={"S": 20, "M": 25},
        is_available=True,
        is_archived=False,
        image_urls=[
            "https://example.com/shorts-front.jpg",
            "https://example.com/shorts-back.jpg"
        ],
        collection="Summer Essentials",
        clothing_type=ClothingType.shorts,
        last_updated=mock_utc(720),
    ),
]

# Normalize sizes and generate size IDs using model methods
for item in items:
    item.normalize_sizes_for_item()
    item.generate_size_ids()

# Insert into DB
db.add_all(items)
db.commit()
db.close()

print("✅ Seeded initial inventory data into dev.db with base_id and size_ids")
