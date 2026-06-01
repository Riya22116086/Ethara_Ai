from fastapi import FastAPI

from app.core.database import Base, engine, check_db_connection
from app.core.config import settings

from app.api.routes.product import router as product_router

from app.models.product import Product
from app.models.customer import Customer
from app.models.order import Order
from app.models.order_item import OrderItem
from app.api.routes.customer import (
    router as customer_router
)
from app.api.routes.order import (
    router as order_router
)
from fastapi.middleware.cors import CORSMiddleware

# Verify connection first
check_db_connection()
Base.metadata.create_all(bind=engine)

app = FastAPI()

# Split origins by comma to support multiple origins if configured
origins = [origin.strip() for origin in settings.CORS_ORIGINS.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    product_router,
    prefix="/products",
    tags=["Products"]
)


app.include_router(
    customer_router,
    prefix="/customers",
    tags=["Customers"]
)

app.include_router(
    order_router,
    prefix="/orders",
    tags=["Orders"]
)