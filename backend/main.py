from aiohttp import web

from tortoise.contrib.aiohttp import register_tortoise

from settings import DATABASE_CONFIG

from v1.cards import card_routes


def init(*args, **kwargs):
    app = web.Application()
    app.router.add_routes(card_routes)

    register_tortoise(
        app,
        config=DATABASE_CONFIG,
        modules={"models": ["models"]},
        generate_schemas=True,
    )
    
    return app

