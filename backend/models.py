from sqlalchemy import Column, Integer, String, Text, DateTime
from datetime import datetime
from database import Base


class Process(Base):
    __tablename__ = "processes"

    id = Column(Integer, primary_key=True, index=True)
    client_name = Column(String, nullable=False)
    document_type = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    generated_text = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)