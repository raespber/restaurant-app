from flask import request, jsonify
from flask_jwt_extended import create_access_token
from flask_restx import Namespace, Resource, fields
from . import auth_bp
from .schemas import LoginSchema
from .services import authenticate

# Swagger Namespace
auth_ns = Namespace('auth', description='Operaciones de autenticación')

# Esquema para Swagger
login_model = auth_ns.model('Login', {
    'username': fields.String(required=True, description='Nombre de usuario'),
    'password': fields.String(required=True, description='Contraseña')
})

login_schema = LoginSchema()

@auth_ns.route('/login')
class LoginResource(Resource):
    @auth_ns.expect(login_model)
    @auth_ns.response(200, 'Token generado exitosamente')
    @auth_ns.response(400, 'Datos inválidos')
    @auth_ns.response(401, 'Credenciales incorrectas')
    def post(self):
        """Inicia sesión y devuelve un token JWT"""
        data = request.get_json()
        errors = login_schema.validate(data)
        if errors:
            return errors, 400

        user = authenticate(data["username"], data["password"])
        if not user:
            return {"msg": "Invalid credentials"}, 401

        access_token = create_access_token(identity=str(user.id))
        return {"access_token": access_token}, 200
