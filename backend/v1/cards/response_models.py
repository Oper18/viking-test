from typing import Optional, List

import datetime

from pydantic import BaseModel, Field


class UserResponse(BaseModel):
    id: int = Field(description="pk")
    first_name: str = Field(description="user first_name")
    last_name: str = Field(description="user last_name")
    patronymic: str = Field(description="user patronymic")


class EmployeeResponse(BaseModel):
    id: int = Field(description="pk")
    position: Optional[str] = Field(description="employee position")
    work_date_start: Optional[str] = Field(
        description="employee work start"
    )
    salary: Optional[float] = Field(description="employee salary")
    employee: UserResponse
    chief: Optional[UserResponse]


class EmployeeListResponse(BaseModel):
    count: int = Field(description="full amount of records")
    employees: List[EmployeeResponse] = Field(description="array of employees")

