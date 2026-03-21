from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from routers.chat import router as chat_router

load_dotenv()

app = FastAPI()

origins = [
    "http://localhost:5173",           # local Vite dev server
    "https://your-app.vercel.app"      # production — update after Vercel deploy
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat_router)

@app.get("/")
def root():
    return {"status": "ok", "message": "SolarSim API"}
