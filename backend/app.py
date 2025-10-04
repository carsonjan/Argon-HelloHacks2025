from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# to host locally:
# pip install -r requirements.txt
# uvicorn app:app --host 0.0.0.0 --port 8000

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace "*" with your frontend URL for security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/v1")
async def ping():
    return {"message": "Hello World"}