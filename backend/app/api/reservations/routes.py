from flask import request, jsonify
from flask_jwt_extended import jwt_required
from flask_restx import Namespace, Resource, fields
from . import reservation_bp
from .schemas import ReservationSchema
from .services import create_reservation, find_reservation_by_client, get_reservations, find_reservation_by_id, update_reservation_date, soft_delete_reservation

reservation_ns = Namespace('reservations', description='Operaciones con reservas')

reservation_model = reservation_ns.model('Reservation', {
    'restaurant_id': fields.Integer(required=True, description='ID del restaurante'),
    'date': fields.String(required=True, description='Fecha de la reserva (YYYY-MM-DD)'),
    'customer_name': fields.String(required=True, description='Nombre del cliente'),
    'customer_email': fields.String(required=True, description='Email del cliente')
})

reservation_schema = ReservationSchema()
reservations_schema = ReservationSchema(many=True)

@reservation_ns.route('/')
class ReservationList(Resource):
    def get(self):
        """Obtiene la lista de reservas con filtros opcionales"""
        all_reservations = get_reservations()
        return reservations_schema.dump(all_reservations), 200

    @reservation_ns.expect(reservation_model)
    def post(self):
        """Crea una nueva reserva"""
        data = request.get_json()
        errors = reservation_schema.validate(data)
        if errors:
            return jsonify(errors), 400
        try:
            new_reservation = create_reservation(data)
        except ValueError as e:
            return {'error': str(e)}, 400
        reservation_data = reservation_schema.dump(new_reservation)
        return reservation_data, 201


@reservation_ns.route('/<int:id>')
@reservation_ns.param('id', 'ID de la reserva')
class ReservationResource(Resource):
    def get(self, id):
        """Obtener una reserva por ID"""
        try:
            reservation = find_reservation_by_id(id)
            return reservation_schema.dump(reservation), 200
        except LookupError as e:
            return {"error": str(e)}, 404

    @reservation_ns.expect(reservation_model)
    def put(self, id):
        """Actualizar la fecha de una reserva"""
        data = request.get_json()
        new_date = data.get('date')
        if not new_date:
            return {"error": "La fecha es requerida"}, 400
        try:
            updated_reservation = update_reservation_date(id, new_date)
            return reservation_schema.dump(updated_reservation), 200
        except (LookupError, ValueError) as e:
            return {"error": str(e)}, 400

    def delete(self, id):
        """Eliminar lógicamente una reserva"""
        try:
            result = soft_delete_reservation(id)
            return result, 200
        except LookupError as e:
            return {"error": str(e)}, 404

@reservation_ns.route('/search')
class ReservationSearch(Resource):
    def get(self):
        """Buscar reservas por DNI y código"""
        filters = request.args.to_dict()
        try:
            reservations = find_reservation_by_client(filters)
            return reservations_schema.dump(reservations), 200
        except Exception as e:
            return {"error": str(e)}, 400