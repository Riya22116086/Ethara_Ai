from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from app.core.database import get_db

from app.schemas.customer import (
    CustomerCreate
)

from app.services.customer_service import (
    CustomerService
)

router = APIRouter()

service = CustomerService()

@router.post("/")
def create_customer(
    customer: CustomerCreate,
    db: Session = Depends(get_db)
):
    return service.create_customer(
        db,
        customer
    )

@router.get("/")
def get_customers(
    db: Session = Depends(get_db)
):
    return service.get_all_customers(db)

@router.get("/{customer_id}")
def get_customer(
    customer_id: str,
    db: Session = Depends(get_db)
):
    return service.get_customer(
        db,
        customer_id
    )

@router.delete("/{customer_id}")
def delete_customer(
    customer_id: str,
    db: Session = Depends(get_db)
):
    return service.delete_customer(
        db,
        customer_id
    )