from marshmallow import Schema, fields

class RestaurantSchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.String(required=True)
    description = fields.String()
    address = fields.String(required=True)
    city = fields.String(required=True)
    photo_url = fields.String()
    is_active = fields.Boolean()