from pydantic import BaseModel, Field
from typing import List, Dict, Any


class AskRequest(BaseModel):
    user_id: int = Field(..., description="ID of the requesting user")
    question: str = Field(..., min_length=3, description="User's natural language question")
    use_live_llm: bool = Field(default=False, description="Use live LLM if API key exists")


class AskResponse(BaseModel):
    answer: str
    tools_used: List[str]
    context: Dict[str, Any]


class ToolInfo(BaseModel):
    name: str
    description: str


class Campaign(BaseModel):
    id: int
    name: str
    channel: str
    impressions: int
    clicks: int
    conversions: int
    spend: float


class Segment(BaseModel):
    id: int
    name: str
    criteria: str
    response_rate: float
    priority_score: float


class ConversationLog(BaseModel):
    user_id: int
    question: str
    answer: str
