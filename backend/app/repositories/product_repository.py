from app.models.product import Product

class ProductRepository:

    def get_by_sku(self, db, sku):
        return (
            db.query(Product)
            .filter(Product.sku == sku)
            .first()
        )

    def create(self, db, product):
        db.add(product)
        db.commit()
        db.refresh(product)
        return product
    
    def get_by_id(self, db, product_id):
        return (
            db.query(Product)
            .filter(Product.id == product_id)
            .first()
        )

    def delete(self, db, product):
        db.delete(product)
        db.commit()