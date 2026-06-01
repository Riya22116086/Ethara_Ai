from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from app.core.database import get_db

from app.schemas.order import (
    OrderCreate
)

from app.services.order_service import (
    OrderService
)

router = APIRouter()

service = OrderService()

@router.post("/")
def create_order(
    order: OrderCreate,
    db: Session = Depends(get_db)
):
    return service.create_order(
        db,
        order
    )

@router.get("/")
def get_orders(
    db: Session = Depends(get_db)
):
    return service.get_orders(db)

@router.get("/{order_id}")
def get_order(
    order_id: str,
    db: Session = Depends(get_db)
):
    return service.get_order(
        db,
        order_id
    )

@router.delete("/{order_id}")
def delete_order(
    order_id: str,
    db: Session = Depends(get_db)
):
    return service.delete_order(
        db,
        order_id
    )