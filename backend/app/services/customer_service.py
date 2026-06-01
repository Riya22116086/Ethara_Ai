from fastapi import HTTPException

from app.models.customer import Customer
from app.repositories.customer_repository import CustomerRepository

repo = CustomerRepository()

class CustomerService:

    def create_customer(self, db, data):

        existing = repo.get_by_email(
            db,
            data.email
        )

        if existing:
            raise HTTPException(
                status_code=400,
                detail="Email already exists"
            )

        customer = Customer(
            name=data.name,
            email=data.email,
            phone=data.phone
        )

        return repo.create(db, customer)

    def get_all_customers(self, db):
        return repo.get_all(db)

    def get_customer(self, db, customer_id):

        customer = repo.get_by_id(
            db,
            customer_id
        )

        if not customer:
            raise HTTPException(
                status_code=404,
                detail="Customer not found"
            )

        return customer

    def delete_customer(
        self,
        db,
        customer_id
    ):

        customer = self.get_customer(
            db,
            customer_id
        )

        repo.delete(db, customer)

        return {
            "message": "Customer deleted"
        }