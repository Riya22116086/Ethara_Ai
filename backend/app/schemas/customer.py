from pydantic import BaseModel, EmailStr

class CustomerCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str

class CustomerUpdate(BaseModel):
    name: str
    email: EmailStr
    phone: str

class CustomerResponse(BaseModel):
    id: str
    name: str
    email: str
    phone: str

    class Config:
        from_attributes = True