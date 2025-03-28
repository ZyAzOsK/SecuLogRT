import { useState, useEffect, useRef } from "react";
import StatusIndicator from "@/components/LogViewer/StatusIndicator";
import LogItem from "@/components/LogViewer/LogItem";
import LogFilter from "@/components/LogViewer/LogFilter";
import ControlPanel from "@/components/LogViewer/ControlPanel";
import { LogEvent, LogSeverity, filterLogs } from "@/utils/logUtils";
import { toast } from "sonner";
import { useWebSocketLogs } from "@/hooks/useWebSocketLogs";

const Index = () => {
  const wsUrl = "ws://localhost:8000/ws";

  const { logs, isConnected, isLogging, startLogging, stopLogging } =
    useWebSocketLogs({ url: wsUrl });

  const [filteredLogs, setFilteredLogs] = useState<LogEvent[]>([]);
  const [autoScroll, setAutoScroll] = useState(true);
  const [filters, setFilters] = useState<{
    severity: LogSeverity[];
    search: string;
  }>({
    severity: [],
    search: "",
  });

  const logContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setFilteredLogs(filterLogs(logs, filters));
  }, [logs, filters]);

  useEffect(() => {
    if (autoScroll && logContainerRef.current && filteredLogs.length > 0) {
      const container = logContainerRef.current;
      container.scrollTop = container.scrollHeight;
    }
  }, [filteredLogs, autoScroll]);

  const handleFilterChange = (newFilters: {
    severity: LogSeverity[];
    search: string;
  }) => {
    setFilters(newFilters);
  };

  const toggleLogging = () => {
    if (!isLogging) {
      startLogging();
    }
  };

  return (
    <div className="container max-w-4xl mx-auto h-screen flex flex-col py-8">
      <header className="mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">
            Security Event Logs
          </h1>
          <p className="text-muted-foreground">
            Monitor and analyze security events in real-time
          </p>
        </div>
        <StatusIndicator isConnected={isConnected} isLogging={isLogging} />
      </header>

      <main className="flex-1 flex flex-col min-h-0">
        <ControlPanel
          isLogging={isLogging}
          toggleLogging={toggleLogging}
          autoScroll={autoScroll}
          setAutoScroll={setAutoScroll}
          stopLogging={stopLogging}
        />

        <LogFilter
          onFilterChange={handleFilterChange}
          totalLogs={logs.length}
          filteredCount={filteredLogs.length}
        />

        <div
          ref={logContainerRef}
          className="flex-1 overflow-y-auto scrollbar-thin neo-morphism rounded-lg p-4"
        >
          {filteredLogs.length > 0 ? (
            filteredLogs.map((log, index) => (
              <LogItem key={log.id} log={log} index={index} />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <p className="text-lg font-medium mb-2">No logs to display</p>
              <p className="text-sm">
                {logs.length > 0
                  ? "Try adjusting your filters to see more logs"
                  : isLogging
                  ? "Waiting for new events..."
                  : 'Click "Start Logging" to begin capturing events'}
              </p>
            </div>
          )}
        </div>
      </main>

      <footer className="mt-6 text-center text-sm text-muted-foreground">
        <p>Security Log Viewer • FastAPI WebSocket Mode</p>
      </footer>
    </div>
  );
};

export default Index;
