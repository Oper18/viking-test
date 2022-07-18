from typing import Optional, Union

import datetime

from pydantic import BaseModel, Field


class QueryRequest(BaseModel):
    limit: Optional[int] = Field(10, description="amount of records")
    offset: Optional[int] = Field(
        0, description="amount of skipped records"
    )
    search: Optional[str] = Field(
        description="text for serach employee"
    )


class ManageEmployeeRequest(BaseModel):
    id: Optional[int] = Field(description="pk")
    first_name: Optional[str] = Field(description="user first_name")
    last_name: Optional[str] = Field(description="user last_name")
    patronymic: Optional[str] = Field(description="user patronymic")
    position: Optional[str] = Field(description="employee position")
    work_date_start: Optional[Union[datetime.datetime, datetime.date]] = Field(
        description="employee work start"
    )
    salary: Optional[Union[float, int]] = Field(description="employee salary")
    chief: Optional[int] = Field(description="employee chief pk")

