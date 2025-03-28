import { useState } from "react";
import { Play, StopCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ControlPanelProps {
  isLogging: boolean;
  toggleLogging: () => void;
  autoScroll: boolean;
  setAutoScroll: (value: boolean) => void;
  stopLogging?: () => void;
}

const ControlPanel = ({
  isLogging,
  toggleLogging,
  autoScroll,
  setAutoScroll,
  stopLogging,
}: ControlPanelProps) => {
  const [clearDialogOpen, setClearDialogOpen] = useState(false);

  return (
    <div className="neo-morphism rounded-lg p-4 mb-4 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex flex-wrap gap-2 w-full sm:w-auto">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={isLogging ? "default" : "default"}
                className="bg-success hover:bg-success/90"
                onClick={toggleLogging}
                disabled={isLogging}
              >
                <Play className="mr-2 h-4 w-4" />
                Start Logging
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p className="text-xs">Begin capturing new log events</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {stopLogging && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="destructive"
                  className="button-glow"
                  onClick={stopLogging}
                  disabled={!isLogging}
                >
                  <StopCircle className="mr-2 h-4 w-4" />
                  Stop Logging
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p className="text-xs">Stop capturing new log events</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        <AlertDialog open={clearDialogOpen} onOpenChange={setClearDialogOpen}>
          <AlertDialogTrigger asChild></AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Clear All Logs</AlertDialogTitle>
              <AlertDialogDescription>
                This action will permanently delete all log entries from the
                current view. This cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction className="bg-destructive hover:bg-destructive/90">
                Clear All
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="auto-scroll"
          checked={autoScroll}
          onCheckedChange={setAutoScroll}
          className="relative inline-flex h-6 w-11 items-center rounded-full border-2 transition-all duration-300 
             border-white bg-transparent peer-checked:bg-white"
        >
          <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform duration-300 peer-checked:translate-x-5 peer-checked:bg-black"></span>
        </Switch>

        <Label htmlFor="auto-scroll" className="text-sm">
          Auto-scroll
        </Label>
      </div>
    </div>
  );
};

export default ControlPanel;
