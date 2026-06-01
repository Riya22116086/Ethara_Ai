from app.models.customer import Customer

class CustomerRepository:

    def create(self, db, customer):
        db.add(customer)
        db.commit()
        db.refresh(customer)
        return customer

    def get_all(self, db):
        return db.query(Customer).all()

    def get_by_id(self, db, customer_id):
        return (
            db.query(Customer)
            .filter(Customer.id == customer_id)
            .first()
        )

    def get_by_email(self, db, email):
        return (
            db.query(Customer)
            .filter(Customer.email == email)
            .first()
        )

    def delete(self, db, customer):
        db.delete(customer)
        db.commit()