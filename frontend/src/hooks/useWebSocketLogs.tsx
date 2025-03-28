import { useState, useEffect, useCallback, useRef } from "react";
import { LogEvent, LogSeverity } from "@/utils/logUtils";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

interface UseWebSocketLogsOptions {
  url: string;
  autoConnect?: boolean;
}

export function useWebSocketLogs({
  url,
  autoConnect = true,
}: UseWebSocketLogsOptions) {
  const [logs, setLogs] = useState<LogEvent[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLogging, setIsLogging] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);
  const hasInitialized = useRef(false);

  const connect = useCallback(() => {
    try {
      const socket = new WebSocket(url);
      socketRef.current = socket;

      socket.onopen = () => {
        setIsConnected(true);
        toast.success("WebSocket connected");
      };

      socket.onmessage = (event) => {
        const data = event.data;
        console.log("Received WebSocket message:", data);

        if (data.includes("Logging stopped")) {
          setIsLogging(false);
        }

        if (
          data.includes("Logging started") ||
          data.includes("Scanning for new logs")
        ) {
          setIsLogging(true);
        }

        const logMatch = data.match(
          /\((\d+), (\d+), '([^']*)', '([^']*)', '([^']*)', '([^']*)'\)/
        );
        if (logMatch) {
          setIsLogging(true);
          const [, id, eventId, source, message, level, timestamp] = logMatch;

          let severity: LogSeverity = "info";
          if (level.toLowerCase().includes("error")) severity = "error";
          if (level.toLowerCase().includes("warning")) severity = "warning";

          const logEvent: LogEvent = {
            id: uuidv4(),
            message,
            source,
            severity,
            timestamp: new Date(timestamp),
            details: `ID: ${id}, Event ID: ${eventId}, Level: ${level}`,
          };

          setLogs((prevLogs) => [...prevLogs, logEvent]);
        }
      };

      socket.onclose = () => {
        setIsConnected(false);
        toast.error("WebSocket disconnected.");
      };

      socket.onerror = (error) => {
        console.error("WebSocket error:", error);
        toast.error("WebSocket error occurred");
      };
    } catch (error) {
      console.error("WebSocket connection error:", error);
      toast.error("Failed to connect to WebSocket");
    }
  }, [url]);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.close();
    }
    setIsConnected(false);
  }, []);

  const startLogging = useCallback(async () => {
    setLogs([]);
    setIsLogging(true);

    try {
      const response = await fetch("http://localhost:8000/start-logging");
      const data = await response.json();
      if (
        data.status !== "Logging started" &&
        data.status !== "Already running"
      ) {
        setIsLogging(false);
      }
      toast.success(data.status);
    } catch (error) {
      console.error("Error starting logging:", error);

      setIsLogging(false);
    }
  }, []);

  const stopLogging = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:8000/stop-logging");
      const data = await response.json();

      if (data.status === "Logging stopped" || data.status === "Not running") {
        setIsLogging(false);
        toast.success(data.status);
      }
    } catch (error) {
      console.error("Error stopping logging:", error);
      setIsLogging(false);
    }
  }, []);

  useEffect(() => {
    if (autoConnect) {
      connect();
    }
    hasInitialized.current = true;
    return () => {
      disconnect();
    };
  }, [autoConnect, connect, disconnect]);

  return {
    logs,
    isConnected,
    isLogging,
    connect,
    disconnect,
    startLogging,
    stopLogging,
  };
}
