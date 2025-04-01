# Linux Security Event Monitoring System  - SecuLogRT

A real-time Linux Security Event Monitoring System built and tested on **Arch Linux**.  
It uses a **FastAPI WebSocket backend** and a **React frontend** to monitor and display security events such as file changes, process activities, network traffic, and authentication logs.  

---

## Features  

- Real-time security log monitoring via WebSocket.  
- Logs include file changes, process activities, network traffic, and authentication events.  
- Control panel to **Start**(auto database clearance), **Stop** 
- Uses **SQLite** for log storage.  
- Built and tested on **Arch Linux**.  

---

## Technologies  

### Backend  
- **FastAPI**: WebSocket support and RESTful API.  
- **SQLite**: Log storage.  
- **Python**: For monitoring system events and log generation.  
- **Uvicorn**: ASGI server for FastAPI.  

### Frontend  
- **React**: Frontend library for UI.  
- **TypeScript**: Type safety and robust typing.  
- **Axios**: HTTP requests to backend.  
- **WebSockets**: Real-time log updates.  

---

## Prerequisites  

- Arch Linux (or any Linux distribution)  
- Python 3.13+  
- Node.js 18+  
- npm or yarn  

---

## Installation  

### Backend  

1. Clone the repository:  
   ```bash
   git clone https://github.com/ZyAzOsK/SecuLogRT.git
   cd SecuLogRT/backend
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate
3. Install required packages:
   ```bash
   pip install -r requirements.txt
4. Run the backend server:
   ```bash
   uvicorn backend:app --host 0.0.0.0 --port 8000
5. Server will be running at:
   ```bash
   http://localhost:8000

### Frontend 
1. Navigate to frontend folder:
   ```bash
   cd ../frontend
2. Install dependencies:
   ```bash
   npm i or yarn i
3. Start the frontend server:
   ```bash
   npm run dev or
   yarn dev
4. Access the frontend at:
   ```bash
   http://localhost:8080
