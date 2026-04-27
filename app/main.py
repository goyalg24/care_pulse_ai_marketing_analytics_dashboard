from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List

from app.models import AskRequest, AskResponse, ToolInfo, Campaign, Segment, ConversationLog
from app.assistant import MarketingAssistant
from app.tools import ToolRegistry, CAMPAIGNS, SEGMENTS

app = FastAPI(
    title="CarePulse AI Assistant Service",
    description="Gaurav's AI/ML component for the CarePulse enterprise dashboard project.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

assistant = MarketingAssistant()
registry = ToolRegistry()
conversation_store: List[ConversationLog] = []


@app.get("/")
def root() -> dict:
    return {"message": "CarePulse AI assistant is running", "docs": "/docs"}


@app.get("/health")
def health() -> dict:
    return {"status": "ok", "service": "carepulse-ai-assistant"}


@app.get("/tools", response_model=List[ToolInfo])
def list_tools() -> List[ToolInfo]:
    return [ToolInfo(**tool) for tool in registry.list_tools()]


@app.get("/campaigns", response_model=List[Campaign])
def get_campaigns() -> List[Campaign]:
    return [Campaign(**item) for item in CAMPAIGNS]


@app.get("/segments", response_model=List[Segment])
def get_segments() -> List[Segment]:
    return [Segment(**item) for item in SEGMENTS]


@app.get("/conversations", response_model=List[ConversationLog])
def get_conversations() -> List[ConversationLog]:
    return conversation_store


@app.post("/ask", response_model=AskResponse)
def ask_assistant(payload: AskRequest) -> AskResponse:
    try:
        result = assistant.answer_question(
            question=payload.question,
            use_live_llm=payload.use_live_llm,
        )
        log = ConversationLog(
            user_id=payload.user_id,
            question=payload.question,
            answer=result["answer"],
        )
        conversation_store.append(log)
        return AskResponse(**result)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
