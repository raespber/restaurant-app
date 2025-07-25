from datetime import datetime, timezone
from flask import jsonify
from app.extensions import db
from .models import Restaurant

def create_restaurant(data):
    restaurant = Restaurant(**data)
    db.session.add(restaurant)
    db.session.commit()
    return restaurant

def get_restaurants(filters):
    query = Restaurant.query
    if "city" in filters:
        query = query.filter(Restaurant.city.ilike(f"%{filters['city']}%"))
    if "letter" in filters:
        query = query.filter(Restaurant.name.ilike(f"{filters['letter']}%"))
    return query.filter_by(deleted_at=None, is_active=True).all()


def find_restaurant_by_id(restaurant_id):
    restaurant = Restaurant.query.get(restaurant_id)
    if not restaurant:
        raise LookupError(f"Restaurante con id {restaurant_id} no encontrado.")
    return restaurant


def update_restaurant(restaurant_id, data):
    restaurant = Restaurant.query.get(restaurant_id)
    if not restaurant:
        raise LookupError(f"Restaurante con id {restaurant_id} no encontrado.") 

    for key, value in data.items():
        setattr(restaurant, key, value)

    db.session.commit()
    return restaurant

def delete_restaurant(restaurant_id):
    restaurant = Restaurant.query.get(restaurant_id)
    if not restaurant:
        
        raise LookupError(f"Restaurante con id {restaurant_id} no encontrado.") 
    restaurant.deleted_at = datetime.now(timezone.utc)
    restaurant.is_active = False
    db.session.commit()
    return {"message": f"Restaurante {restaurant.id} eliminado lógicamente"}, 200
