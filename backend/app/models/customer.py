import uuid

from sqlalchemy import Column
from sqlalchemy import String

from app.core.database import Base

class Customer(Base):

    __tablename__ = "customers"

    id = Column(
        String,
        primary_key=True,
        default=lambda: str(uuid.uuid4())
    )

    name = Column(
        String,
        nullable=False
    )

    email = Column(
        String,
        unique=True,
        nullable=False
    )

    phone = Column(
        String
    )