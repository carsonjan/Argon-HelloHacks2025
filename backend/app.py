from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import csv
import json
import base64

# to host locally:
# pip install -r requirements.txt
# uvicorn app:app --host 0.0.0.0 --port 8000

DATA_DIR = "sample-data" # change to real data for production
DATA_CSV_PATH = f"./{DATA_DIR}/users.csv"



app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace "*" with your frontend URL for security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ======== api ======
@app.get("/api/v1/ping")
async def ping():
    return {"message": "Hello World"}

@app.get("/api/v1/postings")
async def getAllPostings():
    postings = []
    with open(DATA_CSV_PATH, newline='', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            # Convert string fields (like maxRent) to correct types
            row["id"] = int(row["id"])
            row["age"] = int(row["age"])
            row["maxRent"] = int(row["maxRent"])

            tags_columns = ["Roommate Personality", "Pet Policy", "Guest Policy", "Sleep Schedule", "Grocery Preference"]
            row["tags"] = [row[col] for col in tags_columns]

            avatar_path = f"./{DATA_DIR}/avatars/Avatar_{row['id']}.png"  # adjust path
            try:
                with open(avatar_path, "rb") as img_file:
                    encoded_string = base64.b64encode(img_file.read()).decode("utf-8")
                    row["avatar"] = encoded_string
            except FileNotFoundError:
                row["avatar"] = ""  # fallback if image doesn't exis

            pics = []
            for i in range(3):
                pics_path = f"./{DATA_DIR}/pics/Pics{i}_{row['id']}.png"  # adjust path
                try:
                    with open(pics_path, "rb") as img_file:
                        encoded_string = base64.b64encode(img_file.read()).decode("utf-8")
                        pics.append(encoded_string)
                except FileNotFoundError:
                    pics.append("")  # fallback if image doesn't exist
            
            row["pics"] = pics
            

            postings.append(row)


    # Return a structured JSON object for your frontend
    return {"postings": postings}

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