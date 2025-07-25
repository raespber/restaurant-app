from app.extensions import db
from app.api.auth.models import User
from app.api.restaurant.models import Restaurant

def seed_superadmin():
    if not User.query.filter_by(username="admin").first():
        admin = User(username="admin")
        admin.set_password("admin123")
        db.session.add(admin)
        db.session.commit()
        print("✅ Superadmin creado (usuario: admin, password: admin123)")

def seed_restaurants():
    if Restaurant.query.first():
        print("ℹ️ Ya existen restaurantes en la base. Seed ignorado.")
        return

    restaurantes = [
        Restaurant(
            name="Costillas Grills",
            description="Restaurante de asados, parrilla, restobar",
            address="Calle 7, 656, Bogotá, Colombia.",
            city="Bogotá",
            photo_url="https://images.pexels.com/photos/5251019/pexels-photo-5251019.jpeg",
            is_active=True
        ),
        Restaurant(
            name="Paisa Sushi",
            description="Restaurante de comida japonesa",
            address="Calle 8, 595, Medellín, Colombia.",
            city="Medellín",
            photo_url="https://images.pexels.com/photos/858508/pexels-photo-858508.jpeg",
            is_active=True
        ),
        Restaurant(
            name="El Pollo Caribeño",
            description="Restaurante de pollo y comida criolla",
            address="Calle 25, 879, Cartagena, Colombia.",
            city="Cartagena",
            photo_url="https://images.pexels.com/photos/2994900/pexels-photo-2994900.jpeg",
            is_active=True
        ),
        Restaurant(
            name="Sabor Caleño",
            description="Restaurante de platos típicos regionales",
            address="Calle 30, 142, Cali, Colombia.",
            city="Cali",
            photo_url="https://images.pexels.com/photos/28173585/pexels-photo-28173585.jpeg",
            is_active=True
        ),
    ]

    db.session.bulk_save_objects(restaurantes)
    db.session.commit()
    print("✅ 4 restaurantes cargados con éxito")

