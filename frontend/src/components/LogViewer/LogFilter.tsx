import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface LogFilterProps {
  onFilterChange: (filters: { search: string }) => void;
  totalLogs: number;
  filteredCount: number;
}

const LogFilter = ({ onFilterChange }: LogFilterProps) => {
  const [search, setSearch] = useState("");

  useEffect(() => {
    onFilterChange({ search });
  }, [search, onFilterChange]);

  return (
    <div className="flex flex-col md:flex-row gap-2 w-full mb-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search logs..."
          className="pl-9 bg-secondary border-secondary w-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1 h-7 w-7"
            onClick={() => setSearch("")}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default LogFilter;
