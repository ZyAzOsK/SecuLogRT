import { useState } from "react";
import {
  AlertCircle,
  AlertTriangle,
  Info,
  ChevronRight,
  ChevronDown,
  Copy,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatTimestamp, LogEvent } from "@/utils/logUtils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface LogItemProps {
  log: LogEvent;
  index: number;
}

const getCategoryColor = (source?: string) => {
  if (!source) return "bg-gray-500 text-white";

  const colorMap: { [key: string]: string } = {
    file_change_monitor: "bg-blue-500 text-white",
    process_monitor: "bg-green-500 text-white",
    network_monitor: "bg-yellow-400 text-black",
    journald_monitor: "bg-purple-500 text-white",
    auth_log_monitor: "bg-red-500 text-white",
  };

  return colorMap[source] || "bg-gray-600 text-white";
};

const LogItem = ({ log, index }: LogItemProps) => {
  const [expanded, setExpanded] = useState(false);

  const getSeverityIcon = () => {
    switch (log.severity) {
      case "error":
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      case "info":
        return <Info className="h-4 w-4 text-info" />;
      default:
        return <Info className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getSeverityClass = () => {
    switch (log.severity) {
      case "error":
        return "log-error";
      case "warning":
        return "log-warning";
      case "info":
        return "log-info";
      default:
        return "";
    }
  };

  const copyToClipboard = () => {
    const logText = `[${formatTimestamp(
      log.timestamp
    )}] [${log.severity.toUpperCase()}] ${log.message}${
      log.source ? ` [Source: ${log.source}]` : ""
    }${log.details ? `\nDetails: ${log.details}` : ""}`;

    navigator.clipboard
      .writeText(logText)
      .then(() => {
        toast.success("Log copied to clipboard");
      })
      .catch(() => {
        toast.error("Failed to copy log");
      });
  };

  return (
    <div
      className={`neo-morphism group rounded-lg mb-2 overflow-hidden transition-all log-item-appear ${getSeverityClass()}`}
      style={{ "--index": index } as React.CSSProperties}
    >
      <div
        className="px-4 py-3 cursor-pointer flex items-start justify-between"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="pt-0.5">{getSeverityIcon()}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-muted-foreground whitespace-nowrap">
                {formatTimestamp(log.timestamp)}
              </span>
              {log.source && (
                <span
                  className={`px-2 py-1 rounded-md text-xs font-semibold shadow-md ${getCategoryColor(
                    log.source
                  )} !important`}
                >
                  {log.source
                    .replace("_monitor", "")
                    .replace("_", " ")
                    .toUpperCase()}
                </span>
              )}
            </div>
            <p className="text-sm font-medium mt-1 break-words">
              {log.message}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 ml-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    copyToClipboard();
                  }}
                >
                  <Copy className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p className="text-xs">Copy log</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {expanded ? (
            <ChevronDown className="h-5 w-5 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
      </div>

      {expanded && log.details && (
        <div className="px-4 py-3 border-t border-border bg-secondary/30">
          <div className="font-mono text-xs text-muted-foreground mb-1">
            Details
          </div>
          <pre className="text-xs bg-muted/30 p-2 rounded overflow-x-auto scrollbar-thin">
            {log.details}
          </pre>
        </div>
      )}
    </div>
  );
};

export default LogItem;
