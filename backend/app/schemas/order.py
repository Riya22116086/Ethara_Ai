from pydantic import BaseModel
from typing import List


class OrderItemCreate(BaseModel):
    product_id: str
    quantity: int

class OrderCreate(BaseModel):
    customer_id: str
    items: List[OrderItemCreate]

class OrderResponse(BaseModel):

    id: str
    customer_id: str
    total_amount: float

    class Config:
        from_attributes = True