from flask import Flask
from flask_restx import Api
from app.extensions import db, jwt, migrate
from app.api.auth import auth_bp, auth_ns
from app.api.restaurant import restaurant_bp
from app.api.reservations import reservation_bp, reservation_ns
from dotenv import load_dotenv
from app.api.restaurant import restaurant_ns
from app.api.auth.models import User
from app.api.restaurant.models import Restaurant
from app.api.reservations.models import Reservation
from flask_cors import CORS

load_dotenv()

authorizations = {
    'Bearer Auth': {
        'type': 'apiKey',
        'in': 'header',
        'name': 'Authorization',
        'description': "Agrega 'Bearer <JWT>'"
    }
}

api = Api(
    title="Mi API Pro",
    version="1.0",
    description="Documentación automática con Swagger 🚀",
    doc="/api/docs",
    authorizations=authorizations
)

def create_app():
    
    app = Flask(__name__)


    app.config.from_object('app.config.Config')

    CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)

    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)

    api.init_app(app)
    api.add_namespace(restaurant_ns, path="/api/restaurants")
    api.add_namespace(reservation_ns, path="/api/reservations")
    api.add_namespace(auth_ns, path="/api/auth")

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(restaurant_bp, url_prefix="/api/restaurants")
    app.register_blueprint(reservation_bp, url_prefix="/api/reservations")

    return app