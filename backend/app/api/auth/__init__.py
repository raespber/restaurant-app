from flask import Blueprint

auth_bp = Blueprint("auth", __name__)

from .routes import auth_ns, auth_bp