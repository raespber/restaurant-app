from app.database.models import BaseModel
from app.extensions import db

class Restaurant(BaseModel):
    __tablename__ = "restaurants"

    name = db.Column(db.String(50), nullable=False)
    description = db.Column(db.Text, nullable=True)
    address = db.Column(db.String(200), nullable=False)
    city = db.Column(db.String(100), nullable=False)
    photo_url = db.Column(db.String(255), nullable=True)
    is_active = db.Column(db.Boolean, default=True)