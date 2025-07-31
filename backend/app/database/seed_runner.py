from app import create_app
from app.database.seed import seed_superadmin, seed_restaurants

app = create_app()

with app.app_context():
    seed_superadmin()
    seed_restaurants()
    print("🌱 Seed ejecutado correctamente")