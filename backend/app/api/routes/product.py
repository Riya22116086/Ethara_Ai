from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.product import ProductCreate
from app.services.product_service import ProductService

router = APIRouter()

service = ProductService()

@router.get("/")
def get_products(
    db: Session = Depends(get_db)
):
    return service.get_products(db)

@router.post("/")
def create_product(
    product: ProductCreate,
    db: Session = Depends(get_db)
):
    return service.create_product(
        db,
        product
    )

@router.delete("/{product_id}")
def delete_product(
    product_id: str,
    db: Session = Depends(get_db)
):
    return service.delete_product(
        db,
        product_id
    )

@router.put("/{product_id}")
def update_product(
    product_id: str,
    product: ProductCreate,
    db: Session = Depends(get_db)
):
    return service.update_product(
        db,
        product_id,
        product
    )