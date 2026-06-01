import time
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm import declarative_base
from sqlalchemy.exc import OperationalError

from app.core.config import settings

engine = create_engine(settings.DATABASE_URL)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()

def check_db_connection():
    retries = 10
    while retries > 0:
        try:
            # Try to connect
            connection = engine.connect()
            connection.close()
            print("Successfully connected to the database.")
            return True
        except OperationalError as e:
            retries -= 1
            print(f"Database connection failed: {e}. Retrying in 2 seconds... ({retries} retries left)")
            time.sleep(2)
    raise Exception("Could not connect to the database after several retries.")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()