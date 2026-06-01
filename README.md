# Ethara Inventory & Order Management System

A simplified, robust, and beautifully designed Inventory & Order Management System. It allows administrators to track products, manage customer accounts, and build multi-item client orders. The backend enforces critical business rules (unique product SKUs, unique customer emails, real-time inventory validation, and automatic stock deduction), while the frontend provides a premium, responsive glassmorphic user interface.

## Tech Stack
* **Backend:** FastAPI (Python), SQLAlchemy (ORM), PostgreSQL (Database)
* **Frontend:** React, Tailwind CSS, Vite (Build Tool), Axios (API client)
* **Deployment/Containerization:** Docker, Docker Compose, Nginx (frontend server)

---

## Features & Business Rules
1. **Catalog Management:** Create, view, and delete products with unique SKUs.
2. **Customer Registry:** Register customers with validated names, emails (enforced unique), and phone numbers.
3. **Multi-Item Order Builder:** Dynamic dropdown selections for customers and products. Allows compiling multiple items in a single order draft.
4. **Live Inventory Checks:** Checks stock availability in real-time before order placement and warns the user if catalog quantities are exceeded.
5. **Automatic Stock Reduction:** Automatically decrements item quantities from product inventory when an order succeeds.
6. **Graceful Error Handling:** Full try-catch exception handling and toast indicators to report database constraints, connection drops, and validation rejections.

---

## Repository Structure
```
Ethara-Ai/
├── backend/
│   ├── app/                # FastAPI application source code
│   │   ├── api/            # API routers (products, customers, orders)
│   │   ├── core/           # Config and Database connections
│   │   ├── models/         # SQLAlchemy DB models
│   │   ├── repositories/   # DB query handlers (CRUD helper classes)
│   │   ├── schemas/        # Pydantic validation schemas
│   │   ├── services/       # Core business logic services
│   │   └── main.py         # Application entry point & CORS configuration
│   ├── Dockerfile          # Production-optimized Dockerfile for backend
│   └── requirements.txt    # Python dependencies list
├── frontend/
│   ├── src/                # React source files
│   │   ├── api/            # Axios API config (axios.js)
│   │   ├── components/     # UI components (Navbar)
│   │   ├── pages/          # Pages (Products, Customers, Orders)
│   │   ├── services/       # API call service files
│   │   ├── App.jsx         # App router and global page shell
│   │   ├── main.jsx        # Root React launcher
│   │   └── index.css       # Tailwind entry and utility classes
│   ├── nginx.conf          # Nginx routing server rules (SPA support)
│   ├── Dockerfile          # Multi-stage production Dockerfile
│   ├── tailwind.config.js  # Tailwind config matching component scopes
│   └── package.json        # Frontend node packages
├── docker-compose.yml      # Orchestrates Postgres, FastAPI, and Nginx/React
├── .env.example            # Environment template file
└── README.md               # Setup & deployment documentation
```

---

## How to Run the Application

### Option 1: Quick Start with Docker Compose (Recommended)
This runs the entire stack (PostgreSQL database, FastAPI backend, and React web client) in coordinated Docker containers.

1. Ensure Docker Desktop is installed and running on your system.
2. Copy `.env.example` to `.env` in the root directory:
   ```bash
   cp .env.example .env
   ```
3. Run the following command in the root folder:
   ```bash
   docker compose up --build
   ```
4. Access the applications:
   * **Frontend Interface:** [http://localhost:8080](http://localhost:8080)
   * **Backend REST API:** [http://localhost:8000](http://localhost:8000)
   * **Interactive Swagger Documentation:** [http://localhost:8000/docs](http://localhost:8000/docs)

---

### Option 2: Local Development Setup
To run the components separately without Docker (e.g., for hot-reloading development):

#### 1. Setup Database
Ensure PostgreSQL is installed locally and running on port 5432. Create a database named `inventory_db`:
```sql
CREATE DATABASE inventory_db;
```

#### 2. Run Backend
1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a Python virtual environment:
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Create a `.env` file in the `backend/` folder and specify your connection credentials:
   ```env
   DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/inventory_db
   ```
5. Start the FastAPI server using Uvicorn:
   ```bash
   uvicorn app.main:app --reload
   ```

#### 3. Run Frontend
1. Open a separate terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install npm modules:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open the displayed URL (usually `http://localhost:5173`) in your browser.

---

## Free Hosting Platforms Deployment Guide

To deploy the application publicly, you can utilize the following popular, free cloud services:

### 1. Database (PostgreSQL) - Neon or Supabase
* **Neon (neon.tech) / Supabase (supabase.com):**
  1. Register for a free account.
  2. Create a new project and select PostgreSQL as your engine.
  3. Copy your project connection string (e.g., `postgresql://user:password@ep-cool-breeze-123456.us-east-2.aws.neon.tech/neondb?sslmode=require`).
  4. Save this URI for the backend service configuration.

### 2. Backend (FastAPI) - Render or Koyeb
* **Render (render.com):**
  1. Register and click **New > Web Service**.
  2. Connect your GitHub repository.
  3. Configure settings:
     * **Runtime:** `Python`
     * **Build Command:** `pip install -r backend/requirements.txt` (or configure root directory to `backend`)
     * **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
  4. Under **Environment**, add the following key-value variables:
     * `DATABASE_URL`: Your Neon/Supabase PostgreSQL connection string.
     * `CORS_ORIGINS`: Your Vercel frontend URL (e.g. `https://your-app-name.vercel.app`).
  5. Deploy. You will receive a public API URL (e.g., `https://ethara-backend.onrender.com`).

### 3. Frontend (React) - Vercel or Netlify
* **Vercel (vercel.com):**
  1. Register and click **Add New > Project**.
  2. Import your GitHub repository.
  3. Configure settings:
     * **Framework Preset:** `Vite`
     * **Root Directory:** `frontend`
  4. Under **Environment Variables**, add:
     * `VITE_API_URL`: Your deployed FastAPI backend URL (e.g., `https://ethara-backend.onrender.com`).
  5. Click **Deploy**. Vercel will build and host your frontend on a public URL.
