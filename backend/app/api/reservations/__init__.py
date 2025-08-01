from flask import Blueprint

reservation_bp = Blueprint("reservation", __name__)

from . import routes
from .routes import reservation_ns