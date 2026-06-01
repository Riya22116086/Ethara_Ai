import uuid

from sqlalchemy import Column
from sqlalchemy import String
from sqlalchemy import Integer
from sqlalchemy import Float
from sqlalchemy import ForeignKey

from app.core.database import Base

class OrderItem(Base):

    __tablename__ = "order_items"

    id = Column(
        String,
        primary_key=True,
        default=lambda: str(uuid.uuid4())
    )

    order_id = Column(
        String,
        ForeignKey("orders.id")
    )

    product_id = Column(
        String,
        ForeignKey("products.id")
    )

    quantity = Column(
        Integer,
        nullable=False
    )

    price = Column(
        Float,
        nullable=False
    )