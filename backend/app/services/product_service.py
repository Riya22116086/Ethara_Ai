from fastapi import HTTPException
from app.models.product import Product
from app.repositories.product_repository import ProductRepository

repo = ProductRepository()

class ProductService:

    def get_products(self, db):
        return db.query(Product).all()

    def create_product(self, db, data):
        existing = repo.get_by_sku(db, data.sku)

        if existing:
            raise HTTPException(
                status_code=400,
                detail="SKU already exists"
            )

        product = Product(
            name=data.name,
            sku=data.sku,
            price=data.price,
            stock=data.stock
        )

        return repo.create(db, product)

    def delete_product(self, db, product_id):
        product = repo.get_by_id(db, product_id)
        if not product:
            raise HTTPException(
                status_code=404,
                detail="Product not found"
            )
        repo.delete(db, product)
        return {"message": "Product deleted successfully"}

    def update_product(self, db, product_id, data):
        product = repo.get_by_id(db, product_id)
        if not product:
            raise HTTPException(
                status_code=404,
                detail="Product not found"
            )

        if product.sku != data.sku:
            existing = repo.get_by_sku(db, data.sku)
            if existing:
                raise HTTPException(
                    status_code=400,
                    detail="SKU already exists"
                )

        product.name = data.name
        product.sku = data.sku
        product.price = data.price
        product.stock = data.stock

        db.commit()
        db.refresh(product)
        return product