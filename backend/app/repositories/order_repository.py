from app.models.order import Order

class OrderRepository:

    def create(self, db, order):
        db.add(order)
        db.flush()
        return order

    def get_all(self, db):
        return db.query(Order).all()

    def get_by_id(self, db, order_id):
        return (
            db.query(Order)
            .filter(Order.id == order_id)
            .first()
        )