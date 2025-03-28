from watchdog.observers import Observer  
from watchdog.events import FileSystemEventHandler
import time
from .base_monitor import BaseMonitor

class FileChangeHandler(FileSystemEventHandler):
    """Handles file system events."""

    def __init__(self, monitor):
        self.monitor = monitor

    def on_created(self, event):
        self.monitor.log_event(2001, "File Change", f"File created: {event.src_path}", "file_change_monitor")

    def on_modified(self, event):
        self.monitor.log_event(2002, "File Change", f"File modified: {event.src_path}", "file_change_monitor")

    def on_deleted(self, event):
        self.monitor.log_event(2003, "File Change", f"File deleted: {event.src_path}", "file_change_monitor")

class FileChangeMonitor(BaseMonitor):
    """Monitors file changes using watchdog."""

    def __init__(self, watch_path="/var/log/"):
        super().__init__()
        self.watch_path = watch_path
        self.event_handler = FileChangeHandler(self)
        self.observer = Observer()

    def start_monitoring(self):
        print(f"[*] Monitoring file changes in {self.watch_path}...")
        self.observer.schedule(self.event_handler, self.watch_path, recursive=True)
        self.observer.start()

        try:
            while True:
                time.sleep(2)
        except KeyboardInterrupt:
            self.observer.stop()
        self.observer.join()

if __name__ == "__main__":
    monitor = FileChangeMonitor()
    monitor.start_monitoring()
