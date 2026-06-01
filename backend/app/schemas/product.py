from pydantic import BaseModel

class ProductCreate(BaseModel):
    name: str
    sku: str
    price: float
    stock: int

class ProductResponse(ProductCreate):
    id: str

    class Config:
        from_attributes = True