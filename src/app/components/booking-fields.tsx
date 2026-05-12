import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { Button } from "./ui/button";
import { Calendar as CalendarIcon, Users, Minus, Plus } from "lucide-react";
import { format } from "date-fns";
import { cn } from "./ui/utils";
import type { DateRange } from "react-day-picker";

type FieldShellProps = {
  label: string;
  value: React.ReactNode;
  icon: React.ReactNode;
  variant?: "light" | "dark";
};

export function FieldShell({ label, value, icon, variant = "light" }: FieldShellProps) {
  const base =
    variant === "dark"
      ? "border-white/15 bg-white/5 text-white hover:bg-white/10"
      : "border-border bg-background hover:bg-muted/40";
  return (
    <div
      className={cn(
        "flex w-full items-center gap-3 rounded-full border px-4 py-2.5 transition-colors",
        base,
      )}
    >
      <div className={cn("opacity-70", variant === "dark" ? "text-white" : "text-foreground")}>
        {icon}
      </div>
      <div className="flex flex-col items-start text-left leading-tight">
        <span className={cn("uppercase tracking-widest", variant === "dark" ? "text-white/70" : "text-muted-foreground")} style={{ fontSize: 10 }}>
          {label}
        </span>
        <span className="truncate">{value}</span>
      </div>
    </div>
  );
}

export function DateField({
  label,
  date,
  onChange,
  variant = "light",
  fromDate,
}: {
  label: string;
  date?: Date;
  onChange: (d?: Date) => void;
  variant?: "light" | "dark";
  fromDate?: Date;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button type="button" className="block w-full">
          <FieldShell
            label={label}
            icon={<CalendarIcon className="h-4 w-4" />}
            variant={variant}
            value={date ? format(date, "EEE, MMM d") : <span className="opacity-60">Select date</span>}
          />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={onChange}
          fromDate={fromDate ?? new Date()}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

export function DateRangeField({
  dateRange,
  onChange,
  variant = "light",
}: {
  dateRange?: DateRange;
  onChange: (range?: DateRange) => void;
  variant?: "light" | "dark";
}) {
  const formatRange = () => {
    if (!dateRange?.from) {
      return <span className="opacity-60">Select dates</span>;
    }
    if (!dateRange.to) {
      return format(dateRange.from, "MMM d");
    }
    return `${format(dateRange.from, "MMM d")} – ${format(dateRange.to, "MMM d")}`;
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button type="button" className="block w-full">
          <FieldShell
            label="Arrival & Departure"
            icon={<CalendarIcon className="h-4 w-4" />}
            variant={variant}
            value={formatRange()}
          />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          selected={dateRange}
          onSelect={onChange}
          fromDate={new Date()}
          numberOfMonths={2}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

export type Guests = { adults: number; children: number };

export function GuestsField({
  value,
  onChange,
  variant = "light",
}: {
  value: Guests;
  onChange: (g: Guests) => void;
  variant?: "light" | "dark";
}) {
  const total = value.adults + value.children;
  const summary = `${total} ${total === 1 ? "guest" : "guests"}`;
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button type="button" className="block w-full">
          <FieldShell
            label="Guests"
            icon={<Users className="h-4 w-4" />}
            variant={variant}
            value={summary}
          />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-4" align="start">
        <Stepper
          label="Adults"
          sublabel="Ages 13+"
          value={value.adults}
          min={1}
          max={8}
          onChange={(v) => onChange({ ...value, adults: v })}
        />
        <div className="my-3 h-px bg-border" />
        <Stepper
          label="Children"
          sublabel="Ages 0–12"
          value={value.children}
          min={0}
          max={6}
          onChange={(v) => onChange({ ...value, children: v })}
        />
      </PopoverContent>
    </Popover>
  );
}

function Stepper({
  label,
  sublabel,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  sublabel: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <div>{label}</div>
        <div className="text-muted-foreground" style={{ fontSize: 12 }}>{sublabel}</div>
      </div>
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-full"
          disabled={value <= min}
          onClick={() => onChange(value - 1)}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="w-5 text-center tabular-nums">{value}</span>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-full"
          disabled={value >= max}
          onClick={() => onChange(value + 1)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
