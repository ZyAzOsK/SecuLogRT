import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Wifi, WifiOff } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface StatusIndicatorProps {
  isConnected?: boolean;
  isLogging?: boolean;
}

const StatusIndicator = ({
  isConnected = false,
  isLogging = false,
}: StatusIndicatorProps) => {
  const [lastPing, setLastPing] = useState<Date>(new Date());

  useEffect(() => {
    if (isConnected) {
      setLastPing(new Date());

      const pingInterval = setInterval(() => {
        setLastPing(new Date());
      }, 10000);

      return () => clearInterval(pingInterval);
    }
  }, [isConnected]);

  const timeSinceLastPing = Math.floor(
    (new Date().getTime() - lastPing.getTime()) / 1000
  );

  return (
    <div className="flex items-center space-x-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary text-sm">
              {isConnected ? (
                <>
                  <span className="h-2 w-2 rounded-full bg-success animate-pulse-status" />
                  <span className="text-xs font-medium">Connected</span>
                </>
              ) : (
                <>
                  <span className="h-2 w-2 rounded-full bg-destructive animate-pulse-status" />
                  <span className="text-xs font-medium">Disconnected</span>
                </>
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <div className="text-xs">
              {isConnected ? (
                <div className="flex flex-col">
                  <span className="font-medium text-success-foreground">
                    <Wifi className="inline-block mr-1 h-3 w-3" /> WebSocket
                    Connected
                  </span>
                  <span className="text-muted-foreground">
                    Last ping: {timeSinceLastPing}s ago
                  </span>
                  <span className="text-muted-foreground">
                    {isLogging
                      ? "Actively logging events"
                      : "Idle - not logging"}
                  </span>
                </div>
              ) : (
                <div className="flex items-center text-destructive-foreground">
                  <WifiOff className="inline-block mr-1 h-3 w-3" /> WebSocket
                  Disconnected
                </div>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default StatusIndicator;
