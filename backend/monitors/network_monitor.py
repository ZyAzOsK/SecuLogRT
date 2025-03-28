import psutil
import socket
import time
from monitors.base_monitor import BaseMonitor

class NetworkMonitor(BaseMonitor):
    """Monitors network activity on the system."""
    
    def __init__(self):
        super().__init__()

    def start_monitoring(self):
        print("[*] Monitoring network activity...")
        while True:
            self.check_connections()
            time.sleep(5)  # Adjust frequency as needed

    def check_connections(self):
        """Checks active network connections and logs them."""
        connections = psutil.net_connections(kind='inet')

        for conn in connections:
            if conn.status == psutil.CONN_ESTABLISHED and conn.raddr:
                try:
                    process = psutil.Process(conn.pid)
                    process_name = process.name()
                except (psutil.NoSuchProcess, psutil.AccessDenied):
                    process_name = "Unknown"

                # Reverse DNS lookup (try to get domain name)
                ip_address = conn.raddr[0]
                try:
                    domain_name = socket.gethostbyaddr(ip_address)[0]
                except socket.herror:
                    domain_name = ip_address  # Fallback to IP if no domain found

                event_desc = f"[NETWORK MONITOR] {process_name} connected to {domain_name} (IP: {ip_address})"
                self.log_event(4001, "Network Activity", event_desc, "network_monitor")

if __name__ == "__main__":
    monitor = NetworkMonitor()
    monitor.start_monitoring()
