import os
from fastapi import APIRouter
from pydantic import BaseModel
from groq import Groq

router = APIRouter()


def get_client():
    return Groq(api_key=os.getenv("GROQ_API_KEY"))


class Message(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    planet: str
    question: str
    history: list[Message] = []


class ChatResponse(BaseModel):
    answer: str


@router.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest):
    messages = [
        {
            "role": "system",
            "content": f"You are a knowledgeable space guide. The user is asking about {req.planet}. Answer concisely in 2-3 sentences."
        }
    ]

    for msg in req.history:
        messages.append({"role": msg.role, "content": msg.content})

    messages.append({"role": "user", "content": req.question})

    client = get_client()
    completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=messages,
    )

    return ChatResponse(answer=completion.choices[0].message.content)
