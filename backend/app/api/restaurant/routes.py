from flask import request, jsonify
from flask_restx import Namespace, Resource, fields
from . import restaurant_bp
from .schemas import RestaurantSchema
from .services import create_restaurant, get_restaurants, find_restaurant_by_id, update_restaurant, delete_restaurant

restaurant_ns = Namespace('restaurants', description='Operaciones con restaurantes')

restaurant_model = restaurant_ns.model('Restaurant', {
    'name': fields.String(required=True, description='Nombre del restaurante'),
    'description': fields.String(description='Descripción del restaurante'),
    'address': fields.String(required=True, description='Dirección'),
    'city': fields.String(required=True, description='Ciudad'),
    'photo_url': fields.String(description='URL de la foto del restaurante'),
    'is_active': fields.Boolean(description='¿Está activo?')
})

restaurant_schema = RestaurantSchema()
restaurants_schema = RestaurantSchema(many=True)

@restaurant_ns.route('/')
class RestaurantList(Resource):
    @restaurant_ns.doc(params={'city': 'Filtrar por ciudad', 'letter': 'Filtrar por letra inicial'})
    def get(self):
        """Obtiene la lista de restaurantes"""
        city = request.args.get("city")
        letter = request.args.get("letter")
        filters = {}
        if city: filters["city"] = city
        if letter: filters["letter"] = letter

        all_restaurants = get_restaurants(filters)
        return restaurants_schema.dump(all_restaurants), 200

    @restaurant_ns.expect(restaurant_model)
    def post(self):
        """Crea un nuevo restaurante"""
        data = request.get_json()
        errors = restaurant_schema.validate(data)
        if errors:
            return jsonify(errors), 400

        new_restaurant = create_restaurant(data)
        return restaurant_schema.dump(new_restaurant), 201

@restaurant_ns.route('/<int:id>')
@restaurant_ns.param('id', 'ID del restaurante')
class RestaurantResource(Resource):
    def get(self, id):
        """Obtener un restaurante por ID"""
        try:
            restaurant = find_restaurant_by_id(id)
            return restaurant_schema.dump(restaurant), 200
        except LookupError as e:
            return {"error": str(e)}, 404

    @restaurant_ns.expect(restaurant_model)
    def put(self, id):
        """Actualizar un restaurante por ID"""
        data = request.get_json()
        try:
            updated_restaurant = update_restaurant(id, data)
            return restaurant_schema.dump(updated_restaurant), 200
        except LookupError as e:
            return {"error": str(e)}, 404

    def delete(self, id):
        """Eliminar un restaurante por ID"""
        try:
            return delete_restaurant(id)
        except LookupError as e:
            return {"error": str(e)}, 404