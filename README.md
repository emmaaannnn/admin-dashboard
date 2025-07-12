# ACETWO-ADMIN WEB APP

A powerful **React-based admin dashboard** designed for managing and scaling the ACETWO clothing brand. Built for **internal use**, this app streamlines product inventory, expenses, quoting systems, and future store integration.

Backed by a flexible backend (FastAPI or similar), this tool evolves in phases to support growing brand infrastructure, with deployment plans for full web access under `admin.acetwo.store`.

---

## 🚀 Vision

Build a secure, scalable internal platform to manage and monitor all core business operations for ACETWO. Modular by design and prepared for future integrations with storefront and customer experiences.

---

## 📅 Project Phases

### ✅ **Phase 1: Inventory Management**
- Add/Edit/Delete products
- Track stock levels by size (S, M, L, XL, etc.)
- Toggle availability & archive products
- Upload/manage product images (Firebase Storage integration)
- Unsaved change tracking & safe discard

### 🔜 **Phase 2: Expense Tracking**
- Manual entry of business expenses (fabric, production, marketing, etc.)
- Monthly breakdown & analytics
- Exportable reports (CSV/PDF)
- Optional tagging (e.g., "supplier", "ads")

### 🔜 **Phase 3: Email Quotes + Systems**
- Create, save, and send branded quotes via email (e.g., info@acetwo.store)
- Customer/contact management
- Quote status: sent, accepted, rejected
- PDF generation for quotes
- Firebase Auth or role-based protection

### 🔜 **Phase 4: Storefront Integration**
- Sync inventory with public-facing ACETWO store (e.g., built with Shopify, custom React, etc.)
- Push/pull inventory, manage drops
- Limited release access controls
- Publish storefront with integrated admin dashboard

---

## 🧱 Tech Stack

| Layer | Tech |
|------|------|
| **Frontend** | React + Vite or Next.js (admin interface) |
| **Backend** | FastAPI (Python) or Firebase Functions |
| **Database** | Firebase Firestore (NoSQL) or PostgreSQL |
| **Auth** | Firebase Auth (with admin roles) |
| **Storage** | Firebase Storage (for images, PDFs) |
| **Email** | Zoho SMTP via Nodemailer or Python's `smtplib` |
| **Deployment** | GitHub + Vercel / Fly.io / Render |

---

## 🗂️ Project Structure (Planned)
```
acetwo-admin/
├── public/ # Static assets
├── src/
│ ├── components/ # Reusable UI (buttons, inputs)
│ ├── screens/ # Inventory, Expenses, Quotes
│ ├── providers/ # React Context / Providers
│ ├── api/ # Axios services or backend hooks
│ ├── utils/ # Formatters, validators, helpers
│ ├── App.tsx # Main app wrapper
│ └── main.tsx # Entry point
├── backend/ # (optional) FastAPI app folder
│ └── ...
├── README.md # You are here
└── package.json # Project config
```


## 🔧 Setup & Development
### Prerequisites
- Node.js 18+
- Yarn or npm
- Python 3.10+ (if using FastAPI)

### Frontend Setup
```bash
git clone https://github.com/your-username/acetwo-admin.git
cd acetwo-dashboard
npm install
npm run dev  # Starts dev server on localhost:5173
```

### Backend (FastAPI)
# Run backend
```bash
cd acetwo-dashboard/backend
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload
```

# Optional: Recreating SQLite Database
``` bash
rm dev.db
python

from app.db.database import Base, engine
from app.api.inventory.models.item import Item
from app.api.inventory.models.history import InventoryHistory
Base.metadata.create_all(bind=engine)

exit()
```

## 📌 Deployment Plan
| Stage          | Platform                              |
|----------------|----------------------------------------|
| Dev Preview    | GitHub + Vercel (for frontend)         |
| Backend API    | Fly.io or Render (Free tier FastAPI)   |
| Domain Setup   | `admin.acetwo.store` via Namecheap DNS |
| Emailing       | Zoho SMTP (via React backend or FastAPI) |



## 🔐 Authentication Plan
- Role-based access via Firebase Auth
- Admins only: full control over inventory, expenses, quotes
- Optional OAuth via Google login

## 🔮 Future Ideas
- Role-specific dashboards (e.g. finance, fulfillment)
- Analytics dashboard: sales trends, inventory performance
- Real-time collaboration or alerts (e.g., low stock warnings)
- Stripe integration for quotes/payments
- Scheduled drops and countdown management

## 🙌 Credits
- Design & Vision by ACETWO team
- Dev Tools: Firebase, Vercel, FastAPI, React
- Logo/Iconography: ACETWO branding

## 📃 License
MIT License - Feel free to fork, adapt, and build upon for non-commercial use.
This project is internal-use only for ACETWO operations.
"Against Cheap Excuses, Take What’s Ours."
