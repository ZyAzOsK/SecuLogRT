import subprocess
import time
import re
from monitors.base_monitor import BaseMonitor

class AuthLogMonitor(BaseMonitor):
    def __init__(self):
        super().__init__()

    def start_monitoring(self):
        print("[*] Monitoring authentication logs using journalctl...")
        process = subprocess.Popen(
            ["journalctl", "-f", "-o", "cat", "-u", "sshd", "-u", "systemd-logind"],
            stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True
        )

        while True:
            line = process.stdout.readline()
            if not line:
                time.sleep(1)
                continue

            self.process_log(line)

    def process_log(self, line):
        if "Failed password" in line:
            match = re.search(r"Failed password for (invalid user )?(\S+) from (\S+)", line)
            if match:
                user, ip = match.group(2), match.group(3)
                self.log_event(5001, "Auth Log", f"Failed login attempt by {user} from {ip}", "auth_log_monitor")

        elif "Accepted password" in line:
            match = re.search(r"Accepted password for (\S+) from (\S+)", line)
            if match:
                user, ip = match.group(1), match.group(2)
                self.log_event(5002, "Auth Log", f"Successful login by {user} from {ip}", "auth_log_monitor")

        elif "session opened for user" in line:
            match = re.search(r"session opened for user (\S+)", line)
            if match:
                user = match.group(1)
                self.log_event(5003, "Auth Log", f"Session opened for user {user}", "auth_log_monitor")

        elif "session closed for user" in line:
            match = re.search(r"session closed for user (\S+)", line)
            if match:
                user = match.group(1)
                self.log_event(5004, "Auth Log", f"Session closed for user {user}", "auth_log_monitor")

if __name__ == "__main__":
    monitor = AuthLogMonitor()
    monitor.start_monitoring()
