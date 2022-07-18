import os

DATABASE = {
    "user": os.environ.get('DB_USER', 'marketplace'),
    "password": os.environ.get('DB_PASSWORD', 'marketplace'),
    "address": os.environ.get('DB_HOST', 'marketplace_db'),
    "name": os.environ.get('DB_NAME', 'marketplace'),
    "port": os.environ.get('DB_PORT', '5432'),
}

DATABASE_CONFIG = {
    "connections": {"default": "postgres://{}:{}@{}:5432/{}".format(
        DATABASE["user"],
        DATABASE["password"],
        DATABASE["address"],
        DATABASE["name"],
    )},
    "apps": {
        "models": {
            "models": ["models.models", "aerich.models"],
            "default_connection": "default",
        },
    },
}
