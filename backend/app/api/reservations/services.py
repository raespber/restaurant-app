from flask import jsonify
from app.extensions import db
from .models import Reservation
from app.api.restaurant.models import Restaurant
from sqlalchemy import func
from datetime import date as dt_date, datetime, timezone
from app.api.utils.utils import generate_otp

def create_reservation(data):
    restaurant_id = data['restaurant_id']
    res_date = data['date']
    count_restaurant = Reservation.query.filter_by(restaurant_id=restaurant_id, date=res_date, deleted_at=None).count()
    if count_restaurant >= 15:
        raise ValueError('No hay mesas disponibles para este restaurante en la fecha seleccionada.')

    count_total = Reservation.query.filter_by(date=res_date, deleted_at=None).count()
    if count_total >= 20:
        raise ValueError('No hay mesas disponibles en ningún restaurante para la fecha seleccionada.')

    reservation = Reservation(**data)
    reservation.code = generate_otp();
    db.session.add(reservation)
    db.session.commit()
    return reservation

def get_reservations():
    query = Reservation.query
    return query.all()

def find_reservation_by_client(filters):
    now = datetime.now(timezone.utc)
    query = Reservation.query
    
    if "dni" in filters:
        query = query.filter(Reservation.customer_dni == filters["dni"])
    if "code" in filters:
        query = query.filter(Reservation.code == filters["code"])
    query = query.filter(Reservation.deleted_at == None, Reservation.date >= now)    
    return query.all()

def find_reservation_by_id(reservation_id):
    reservation = Reservation.query.get(reservation_id)
    if not reservation or reservation.deleted_at is not None:
        raise LookupError("Reserva no encontrada o fue eliminada.")
    return reservation

def update_reservation_date(data):
    reservation_id = data["id"]
    customer_dni = data["dni"]
    code = data["code"]
    new_date = data["date"]

    reservation = Reservation.query.filter_by(
        id=reservation_id,
        customer_dni=customer_dni,
        code=code,
        deleted_at=None
    ).first()

    if not reservation:
        raise LookupError("No se encontró una reserva con esos datos.")

    count_restaurant = Reservation.query.filter_by(
        restaurant_id=reservation.restaurant_id,
        date=new_date,
        deleted_at=None
    ).count()

    if count_restaurant >= 15:
        raise ValueError("No hay mesas disponibles para ese restaurante en esa fecha.")

    count_total = Reservation.query.filter_by(
        date=new_date,
        deleted_at=None
    ).count()

    if count_total >= 20:
        raise ValueError("No hay mesas disponibles en ningún restaurante para esa fecha.")

    reservation.date = new_date
    db.session.commit()
    return reservation

def soft_delete_reservation(data):
    reservation_id = data["id"]
    customer_dni = data["dni"]
    code = data["code"]

    reservation = Reservation.query.filter_by(
        id=reservation_id,
        customer_dni=customer_dni,
        code=code,
        deleted_at=None
    ).first()

    if not reservation:
        raise LookupError("No se encontró una reserva activa con esos datos.")

    reservation.deleted_at = datetime.now(timezone.utc)
    db.session.commit()
    return jsonify({"message": f"Reserva {reservation.id} eliminado lógicamente"}), 200