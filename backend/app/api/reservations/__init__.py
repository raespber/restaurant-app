from flask import Blueprint
from flask_cors import CORS
from .routes import reservation_ns

reservation_bp = Blueprint("reservation", __name__)


CORS(reservation_bp)