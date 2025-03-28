import abc
import sqlite3
import datetime
import os
from dotenv import load_dotenv


DB_PATH = os.getenv("DB_PATH")

class BaseMonitor(abc.ABC):
    """Abstract base class for all monitors."""

    def __init__(self, db_path=DB_PATH, clear_db=True):
        self.db_path = db_path
        self.conn = sqlite3.connect(self.db_path, check_same_thread=False)
        self.cursor = self.conn.cursor()
        self.create_table()
        
        if clear_db:
            self.clear_database()  # Call this method to clear previous logs

    @abc.abstractmethod
    def start_monitoring(self):
        """Start monitoring for events."""
        pass

    def log_event(self, event_id, category, description, source):
        """Log an event to the SQLite database."""
        timestamp = datetime.datetime.now().isoformat()
        self.cursor.execute(
            "INSERT INTO security_events (event_id, category, description, source, timestamp) VALUES (?, ?, ?, ?, ?)",
            (event_id, category, description, source, timestamp),
        )
        self.conn.commit()

    def create_table(self):
        """Create the security events table if it doesn't exist."""
        self.cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS security_events (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                event_id INTEGER,
                category TEXT,
                description TEXT,
                source TEXT,
                timestamp TEXT
            )
            """
        )
        self.conn.commit()

    def clear_database(self):
        """Clear all events from the database on startup."""
        self.cursor.execute("DELETE FROM security_events;")
        self.conn.commit()

    def close(self):
        """Close the database connection."""
        self.conn.close()
