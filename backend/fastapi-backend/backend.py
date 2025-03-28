from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import asyncio
import subprocess
import sqlite3
import psutil
import os

load_dotenv()

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_PATH = os.getenv("DB_PATH")
LOGGER_SCRIPT_PATH = os.getenv("LOGGER_SCRIPT_PATH")
process = None  


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    
    await websocket.accept()
    global process
    last_timestamp = None 
    logging_stopped_message_sent = False 

    while True:
        if process is None: 
            if not logging_stopped_message_sent: 
                await websocket.send_text("Logging stopped. No new logs.")
                logging_stopped_message_sent = True 
            await asyncio.sleep(2) 
            continue
        try:
            conn = sqlite3.connect(DB_PATH)
            cursor = conn.cursor()
            if last_timestamp:
                cursor.execute("SELECT * FROM security_events WHERE timestamp > ? ORDER BY timestamp ASC", (last_timestamp,))
            else:
                cursor.execute("SELECT * FROM security_events ORDER BY timestamp ASC LIMIT 10")
            logs = cursor.fetchall()
            conn.close()

            if logs:
                for log in logs:
                    await websocket.send_text(str(log))
                last_timestamp = logs[-1][-1] 
                logging_stopped_message_sent = False 
            else:
                if not logging_stopped_message_sent:
                    await websocket.send_text("Scanning for new logs...")
                    logging_stopped_message_sent = True 
                
            await asyncio.sleep(1) 
       
        except sqlite3.OperationalError as e:
            print(f"[!] Database error: {e}")
            await asyncio.sleep(2) 


@app.get("/start-logging")
def start_logging():
    global process
    if process is None:
        process = subprocess.Popen(["python3", LOGGER_SCRIPT_PATH])
        return {"status": "Logging started"}
    return {"status": "Already running"}


@app.get("/stop-logging")
def stop_logging():
    global process
    if process is not None:
        parent = psutil.Process(process.pid) 
        for child in parent.children(recursive=True): 
            child.terminate()
        process.terminate()  
        process.wait() 
        process = None 
        return {"status": "Logging stopped"}
    return {"status": "Not running"}


@app.get("/clear-database")
def clear_database():
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("DELETE FROM security_events")  
        conn.commit()
        conn.close()
        return {"status": "Database cleared"}
    except sqlite3.OperationalError as e:
        return {"status": f"Error clearing database: {e}"}
