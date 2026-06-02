# Ethara Inventory & Order Management System
# Live on https://ethara-ai-assessment-lemon.vercel.app

A simplified, robust, and beautifully designed Inventory & Order Management System. It allows administrators to track products, manage customer accounts, and build multi-item client orders. The backend enforces critical business rules (unique product SKUs, unique customer emails, real-time inventory validation, and automatic stock deduction), while the frontend provides a premium, responsive glassmorphic user interface.

## Tech Stack
* **Backend:** FastAPI (Python), SQLAlchemy (ORM), PostgreSQL (Database)
* **Frontend:** React, Tailwind CSS, Vite (Build Tool), Axios (API client)
* **Deployment/Containerization:** Docker, Docker Compose

---

## Features & Business Rules
1. **Catalog Management:** Create, view, and delete products with unique SKUs.
2. **Customer Registry:** Register customers with validated names, emails (enforced unique), and phone numbers.
3. **Multi-Item Order Builder:** Dynamic dropdown selections for customers and products. Allows compiling multiple items in a single order draft.
4. **Live Inventory Checks:** Checks stock availability in real-time before order placement and warns the user if catalog quantities are exceeded.
5. **Automatic Stock Reduction:** Automatically decrements item quantities from product inventory when an order succeeds.
6. **Graceful Error Handling:** Full try-catch exception handling and toast indicators to report database constraints, connection drops, and validation rejections.

<img width="1919" height="879" alt="image" src="https://github.com/user-attachments/assets/6ecf2888-a186-4158-8500-4f62fa1b8fb1" />
<img width="1919" height="894" alt="image" src="https://github.com/user-attachments/assets/ac5dd189-d66b-4077-9f85-f70b3e01ce49" />
<img width="1908" height="856" alt="image" src="https://github.com/user-attachments/assets/e6ce7b13-5027-4ba5-8c27-a7e8faaef0f8" />

