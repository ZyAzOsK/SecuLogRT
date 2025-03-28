import psutil
import socket
import time
from monitors.base_monitor import BaseMonitor

class NetworkMonitor(BaseMonitor):    
    def __init__(self):
        super().__init__()

    def start_monitoring(self):
        print("[*] Monitoring network activity...")
        while True:
            self.check_connections()
            time.sleep(5) 

    def check_connections(self):
        connections = psutil.net_connections(kind='inet')

        for conn in connections:
            if conn.status == psutil.CONN_ESTABLISHED and conn.raddr:
                try:
                    process = psutil.Process(conn.pid)
                    process_name = process.name()
                except (psutil.NoSuchProcess, psutil.AccessDenied):
                    process_name = "Unknown"

                ip_address = conn.raddr[0]
                try:
                    domain_name = socket.gethostbyaddr(ip_address)[0]
                except socket.herror:
                    domain_name = ip_address

                event_desc = f"[NETWORK MONITOR] {process_name} connected to {domain_name} (IP: {ip_address})"
                self.log_event(4001, "Network Activity", event_desc, "network_monitor")

if __name__ == "__main__":
    monitor = NetworkMonitor()
    monitor.start_monitoring()
