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
    logging_stopped_message_sent = False #again to avoid spamming

    while True:
        if process is None: #stop sending logs if the logger is not running
            if not logging_stopped_message_sent: #send messages only once
                await websocket.send_text("Logging stopped. No new logs.")
                logging_stopped_message_sent = True #prevent sending again
            await asyncio.sleep(2) #prevent fast infinite looping
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
                last_timestamp = logs[-1][-1] #update the last timestamp
                logging_stopped_message_sent = False #reset the flag when logs are available
            else:
                if not logging_stopped_message_sent:
                    await websocket.send_text("Scanning for new logs...")
                    logging_stopped_message_sent = True #prevent spam
                
            await asyncio.sleep(1)  # Adjust interval as needed
       
        except sqlite3.OperationalError as e:
            print(f"[!] Database error: {e}")
            await asyncio.sleep(2)  # Add a delay before retrying


@app.get("/start-logging")
def start_logging():
    """ Starts the security_logger.py script. """
    global process
    if process is None:
        process = subprocess.Popen(["python3", LOGGER_SCRIPT_PATH])
        return {"status": "Logging started"}
    return {"status": "Already running"}


@app.get("/stop-logging")
def stop_logging():
    """ Stops the security_logger.py script by sending an exit command. """
    global process
    if process is not None:
        parent = psutil.Process(process.pid) # Get the parent process
        for child in parent.children(recursive=True): #kill all child processes
            child.terminate()
        process.terminate()  # Force stop the process
        process.wait()  # Ensure cleanup
        process = None #reset the process variable
        return {"status": "Logging stopped"}
    return {"status": "Not running"}


@app.get("/clear-database")
def clear_database():
    """ Clears the logs from the database. """
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("DELETE FROM security_events")  # Fix table name
        conn.commit()
        conn.close()
        return {"status": "Database cleared"}
    except sqlite3.OperationalError as e:
        return {"status": f"Error clearing database: {e}"}
