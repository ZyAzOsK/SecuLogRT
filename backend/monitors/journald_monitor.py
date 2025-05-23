import subprocess
import time
from monitors.base_monitor import BaseMonitor

class JournaldMonitor(BaseMonitor):
    def __init__(self):
        super().__init__()
        self.ignored_keywords = ["kwin_scene_opengl", "GL_INVALID_OPERATION"]

    def start_monitoring(self):
        print("[*] Monitoring journald logs...")
        command = ["journalctl", "-f", "-o", "cat"]

        with subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True) as process:
            for line in process.stdout:
                line = line.strip()
                if self.is_relevant_log(line):
                    self.log_event(6001, "System Log", line, "journald_monitor")

    def is_relevant_log(self, log_message):
        return not any(keyword in log_message for keyword in self.ignored_keywords)
