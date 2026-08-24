import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

LOG_PATH = os.path.join(os.path.dirname(__file__), "log.txt")


@app.get("/log/")
def leer_log():
    if not os.path.exists(LOG_PATH):
        return {"content": "", "exists": False}
    with open(LOG_PATH, "r") as archivo:
        return {"content": archivo.read(), "exists": True}
