export type LogSeverity = "info" | "warning" | "error";

export interface LogEvent {
  id: string;
  timestamp: Date;
  message: string;
  severity: LogSeverity;
  source?: string;
  details?: string;
}

export const generateMockLogs = (count: number = 20): LogEvent[] => {
  const severities: LogSeverity[] = ["info", "warning", "error"];
  const sources = ["system", "auth", "network", "user", "database"];
  const infoMessages = [
    "User logged in successfully",
    "Configuration updated",
    "Backup completed",
    "Service started",
    "Data synchronized",
  ];
  const warningMessages = [
    "High CPU usage detected",
    "Low disk space warning",
    "Failed login attempt",
    "API rate limit approaching",
    "Connection unstable",
  ];
  const errorMessages = [
    "Database connection failed",
    "Authentication error",
    "Service crashed unexpectedly",
    "Critical security vulnerability detected",
    "Data integrity violation",
  ];

  return Array.from({ length: count }, (_, i) => {
    const severity = severities[Math.floor(Math.random() * severities.length)];
    let message;

    switch (severity) {
      case "info":
        message = infoMessages[Math.floor(Math.random() * infoMessages.length)];
        break;
      case "warning":
        message =
          warningMessages[Math.floor(Math.random() * warningMessages.length)];
        break;
      case "error":
        message =
          errorMessages[Math.floor(Math.random() * errorMessages.length)];
        break;
    }

    const pastTime =
      Date.now() -
      Math.floor(Math.random() * (24 * 60 * 60 * 1000 - 60 * 1000) + 60 * 1000);

    return {
      id: `log-${i}-${Date.now()}`,
      timestamp: new Date(pastTime),
      message,
      severity,
      source: sources[Math.floor(Math.random() * sources.length)],
      details:
        severity === "error"
          ? "Error Code: 0x" +
            Math.floor(Math.random() * 1000)
              .toString(16)
              .padStart(4, "0")
          : undefined,
    };
  }).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

export const formatTimestamp = (date: Date): string => {
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
};

export const filterLogs = (
  logs: LogEvent[],
  filters: {
    severity?: LogSeverity[];
    search?: string;
  }
): LogEvent[] => {
  return logs.filter((log) => {
    if (
      filters.severity &&
      filters.severity.length > 0 &&
      !filters.severity.includes(log.severity)
    ) {
      return false;
    }

    if (filters.search && filters.search.trim() !== "") {
      const searchTerm = filters.search.toLowerCase();
      const matchesMessage = log.message.toLowerCase().includes(searchTerm);
      const matchesSource = log.source?.toLowerCase().includes(searchTerm);
      const matchesDetails = log.details?.toLowerCase().includes(searchTerm);

      if (!matchesMessage && !matchesSource && !matchesDetails) {
        return false;
      }
    }

    return true;
  });
};
