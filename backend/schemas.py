from pydantic import BaseModel
from typing import Optional


class ProcessCreate(BaseModel):
    client_name: str
    document_type: str
    description: Optional[str] = None


class ProcessResponse(BaseModel):
    id: int
    client_name: str
    document_type: str
    description: Optional[str]
    generated_text: Optional[str]

    class Config:
        from_attributes = True