import uuid

from sqlalchemy import Column
from sqlalchemy import String
from sqlalchemy import Float
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class Order(Base):

    __tablename__ = "orders"

    id = Column(
        String,
        primary_key=True,
        default=lambda: str(uuid.uuid4())
    )

    customer_id = Column(
        String,
        ForeignKey("customers.id"),
        nullable=False
    )

    total_amount = Column(
        Float,
        default=0
    )
    items = relationship(
        "OrderItem",
        backref="order",
        cascade="all, delete"
    )