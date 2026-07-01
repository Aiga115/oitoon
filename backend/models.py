from sqlalchemy import Column, Integer, String, Enum, DateTime, func
from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String(30), unique=True, nullable=False)
    email = Column(String(254), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    first_name = Column(String(50), nullable=True)
    last_name = Column(String(50), nullable=True)
    role = Column(Enum("reader", "author", "admin"), nullable=False, default="reader")
    avatar_url = Column(String(500), nullable=True)
    member_since = Column(DateTime, server_default=func.now())
