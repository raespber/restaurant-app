from marshmallow import Schema, fields

class ReservationSchema(Schema):
    id = fields.Int(dump_only=True)
    restaurant_id = fields.Int(required=True)
    date = fields.Date(required=True)
    customer_name = fields.String(required=True)
    customer_email = fields.String(required=True)
    customer_dni = fields.String(required=False)
