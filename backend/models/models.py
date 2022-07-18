from tortoise.models import Model
from tortoise import fields

from models.base import BaseModel


class User(Model, BaseModel):
    id = fields.IntField(pk=True)
    first_name = fields.CharField(max_length=255)
    last_name = fields.CharField(max_length=255)
    patronymic = fields.CharField(max_length=255)
    created_at = fields.DatetimeField(auto_now_add=True)
    updated_at = fields.DatetimeField(auto_now=True)


class Employee(Model, BaseModel):
    id = fields.IntField(pk=True)
    position = fields.CharField(max_length=255, null=True)
    work_date_start = fields.DateField(null=True)
    salary = fields.DecimalField(max_digits=12, decimal_places=2, null=True)
    employee = fields.OneToOneField(
        'models.User', related_name='employee'
    )
    chief = fields.ForeignKeyField(
        'models.User', related_name='slaves', null=True
    )
    created_at = fields.DatetimeField(auto_now_add=True)
    updated_at = fields.DatetimeField(auto_now=True)

