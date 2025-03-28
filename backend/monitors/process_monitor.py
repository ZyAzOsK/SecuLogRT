import psutil
import time
from .base_monitor import BaseMonitor

class ProcessMonitor(BaseMonitor):
    def __init__(self):
        super().__init__()
        self.previous_pids = set(psutil.pids())

    def start_monitoring(self):
        print("[*] Monitoring process activities...")
        while True:
            current_pids = set(psutil.pids())

            new_pids = current_pids - self.previous_pids
            terminated_pids = self.previous_pids - current_pids

            for pid in new_pids:
                try:
                    proc = psutil.Process(pid)
                    self.log_event(1001, "Process", f"New process started: {proc.name()} (PID: {pid})", "process_monitor")
                except psutil.NoSuchProcess:
                    continue

            for pid in terminated_pids:
                self.log_event(1002, "Process", f"Process terminated: PID {pid}", "process_monitor")

            self.previous_pids = current_pids
            time.sleep(2)

if __name__ == "__main__":
    monitor = ProcessMonitor()
    monitor.start_monitoring()
