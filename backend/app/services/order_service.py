from fastapi import HTTPException

from app.models.order import Order
from app.models.order_item import OrderItem

from app.repositories.order_repository import (
    OrderRepository
)

from app.repositories.product_repository import (
    ProductRepository
)

from app.repositories.customer_repository import (
    CustomerRepository
)

order_repo = OrderRepository()
product_repo = ProductRepository()
customer_repo = CustomerRepository()


class OrderService:

    def create_order(self, db, data):
        
     try:

        customer = customer_repo.get_by_id(
            db,
            data.customer_id
        )

        if not customer:
            raise HTTPException(
                status_code=404,
                detail="Customer not found"
            )

        total_amount = 0

        order = Order(
            customer_id=data.customer_id
        )

        order_repo.create(db, order)

        for item in data.items:

            product = product_repo.get_by_id(
                db,
                item.product_id
            )

            if not product:
                raise HTTPException(
                    status_code=404,
                    detail=f"Product {item.product_id} not found"
                )

            if product.stock < item.quantity:
                raise HTTPException(
                    status_code=400,
                    detail=f"Insufficient stock for {product.name}"
                )

            product.stock -= item.quantity

            item_total = (
                product.price *
                item.quantity
            )

            total_amount += item_total

            order_item = OrderItem(
                order_id=order.id,
                product_id=product.id,
                quantity=item.quantity,
                price=product.price
            )

            db.add(order_item)

        order.total_amount = total_amount

        db.commit()

        db.refresh(order)

        return {
            "order_id": order.id,
            "total_amount": total_amount,
            "message": "Order created successfully"
        }
     except Exception as e:

        db.rollback()

        raise e

    def get_orders(self, db):
        return order_repo.get_all(db)

    def get_order(self, db, order_id):

        order = order_repo.get_by_id(
            db,
            order_id
        )

        if not order:
            raise HTTPException(
                status_code=404,
                detail="Order not found"
            )

        return order

    def delete_order(self, db, order_id):
        order = order_repo.get_by_id(db, order_id)
        if not order:
            raise HTTPException(
                status_code=404,
                detail="Order not found"
            )

        # Restore product stock level
        for item in order.items:
            product = product_repo.get_by_id(db, item.product_id)
            if product:
                product.stock += item.quantity

        db.delete(order)
        db.commit()
        return {"message": "Order deleted successfully"}