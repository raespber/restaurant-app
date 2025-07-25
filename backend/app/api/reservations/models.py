from app.database.models import BaseModel
from app.extensions import db

class Reservation(BaseModel):
    __tablename__ = "reservations"

    restaurant_id = db.Column(db.Integer, db.ForeignKey('restaurants.id'), nullable=False)
    date = db.Column(db.Date, nullable=False)
    customer_name = db.Column(db.String(100), nullable=False)
    customer_email = db.Column(db.String(100), nullable=False)
    customer_dni = db.Column(db.String(20), nullable=False)
    code = db.Column(db.String(20), nullable=False)

    restaurant = db.relationship('Restaurant', backref=db.backref('reservations', lazy=True))
