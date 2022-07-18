from pydantic import BaseModel, Field


class Error4xxResponse(BaseModel):
    message: str = Field(description="reason of error")

