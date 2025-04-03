import threading
from monitors.file_change_monitor import FileChangeMonitor
from monitors.process_monitor import ProcessMonitor
from monitors.network_monitor import NetworkMonitor
from monitors.auth_log_monitor import AuthLogMonitor
from monitors.journald_monitor import JournaldMonitor
import time

def main():
    print("[*] Starting security event logger...")
    print("[*] Type 'exit' and press Enter to stop monitoring safely.")

    file_monitor = FileChangeMonitor()
    process_monitor = ProcessMonitor()
    network_monitor = NetworkMonitor()
    auth_monitor = AuthLogMonitor()
    journald_monitor = JournaldMonitor()

    threads = [
        threading.Thread(target=file_monitor.start_monitoring, daemon=True),
        threading.Thread(target=process_monitor.start_monitoring, daemon=True),
        threading.Thread(target=network_monitor.start_monitoring, daemon=True),
        threading.Thread(target=auth_monitor.start_monitoring, daemon=True),
        threading.Thread(target=journald_monitor.start_monitoring, daemon=True),
    ]

    for thread in threads:
        thread.start()

    while True:
        user_input = input()
        if user_input.strip().lower() == "exit":
            print("[*] Stopping security event logger...")
            break

    file_monitor.close()
    process_monitor.close()
    network_monitor.close()
    auth_monitor.close()
    journald_monitor.close()
    print("[*] Security event logger stopped!")

if __name__ == "__main__":
    main()
