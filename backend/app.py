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

# ======== api ======
@app.get("/api/v1")
async def ping():
    return {"message": "Hello World"}

@app.get("api/v1/postings")
async def getAllPostings():
    return {"postings": []}

@app.get("api/v1/users")
async def getAllUsers():
    return {"users": []}

@app.post("api/v1/new/posting")
async def postNewPosting():
    return {"response": 200}

# @app.post("api/v1/register")
# async def register():
#     return

# @app.post("api/v1/login")
# async def login():
#     return

# =============

# async def verifyUser():
#     return