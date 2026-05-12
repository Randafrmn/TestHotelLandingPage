import React, { useState, useEffect, useRef } from "react";
import { Container } from "./shared/Container";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { toast } from "sonner";
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";
import type { Guests } from "./booking-fields";
import BackReserveSrc from "@/assets/images/backreserve.jpg";
import PersonSrc from "@/assets/icons/Person.svg";
import MailSrc from "@/assets/icons/Mail.svg";
import TelephoneSrc from "@/assets/icons/Telephone.svg";
import CalenderSrc from "@/assets/icons/Calender.svg";
import PeopleSrc from "@/assets/icons/People.svg";
import BedReservedSrc from "@/assets/icons/BedReserved.svg";
import { ChevronDown, Minus, Plus, Check } from "lucide-react";
import { cn } from "./ui/utils";

/* ─── Constants ─────────────────────────────────────────────────── */

const ROOM_OPTIONS = [
  "Larch Junior Suite",
  "Summit Royal Suite",
  "Family Alpine Lodge",
  "Panoramic Penthouse",
];

const EXTRAS = [
  "Airport Transfer",
  "Spa package",
  "Private dining",
  "Yacht excursion",
];

/* ─── Shared dark popover calendar classNames (same as hero) ─────── */

const DARK_CAL_CLASSNAMES = {
  months: "flex flex-col sm:flex-row gap-6 p-4",
  month: "flex flex-col gap-3",
  caption: "flex justify-center relative items-center",
  caption_label: "monroe-regular text-sm uppercase tracking-[0.1em] text-white",
  nav: "flex items-center gap-1",
  nav_button:
    "h-7 w-7 flex items-center justify-center rounded-sm bg-white/5 hover:bg-white/15 transition-colors text-white/60 hover:text-white",
  nav_button_previous: "absolute left-0",
  nav_button_next: "absolute right-0",
  table: "w-full border-collapse",
  head_row: "flex",
  head_cell: "text-white/30 rounded-sm w-9 font-normal text-[0.75rem] text-center pb-1",
  row: "flex w-full mt-1",
  cell: "relative p-0 text-center text-sm [&:has([aria-selected])]:bg-[#A49781]/20 first:[&:has([aria-selected])]:rounded-l-sm last:[&:has([aria-selected])]:rounded-r-sm",
  day: "h-9 w-9 p-0 font-normal text-white/80 hover:bg-white/10 rounded-sm transition-colors aria-selected:opacity-100",
  day_range_start: "bg-[#A49781] text-white rounded-sm hover:bg-[#A49781]",
  day_range_end: "bg-[#A49781] text-white rounded-sm hover:bg-[#A49781]",
  day_selected: "bg-[#A49781] text-white hover:bg-[#A49781]",
  day_today: "text-[#A49781] font-semibold",
  day_outside: "text-white/20",
  day_disabled: "text-white/15 cursor-not-allowed",
  day_range_middle: "bg-[#A49781]/20 text-white rounded-none",
  day_hidden: "invisible",
};

const PLACEHOLDER_TEXT = "rgba(50,50,50,0.45)";
const INPUT_TEXT = "rgba(50,50,50,1)";

function looksLikeValidEmail(raw: string): boolean {
  const s = raw.trim();
  if (!s || !s.includes("@")) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

/** Live rule while typing: any non-empty value must contain @. */
function emailMissingAt(raw: string): boolean {
  const t = raw.trim();
  return t.length > 0 && !t.includes("@");
}

/** Letters, spaces, apostrophe, hyphen, period; 2–80 chars (supports many Latin names). */
function looksLikeValidName(raw: string): boolean {
  const s = raw.trim();
  if (s.length < 2 || s.length > 80) return false;
  return /^[\p{L}][\p{L}\s'.-]*$/u.test(s);
}

/** E.164-style: country + national, 8–15 digits total. */
function looksLikeValidPhoneDigits(digitsOnly: string): boolean {
  if (!digitsOnly) return false;
  return digitsOnly.length >= 8 && digitsOnly.length <= 15;
}

type PhoneCountry = { iso: string; dial: string; name: string };

/** Dial codes for common regions (extend as needed). */
const PHONE_COUNTRIES: PhoneCountry[] = [
  { iso: "IT", dial: "+39", name: "Italia" },
  { iso: "ID", dial: "+62", name: "Indonesia" },
  { iso: "US", dial: "+1", name: "United States" },
  { iso: "GB", dial: "+44", name: "United Kingdom" },
  { iso: "SG", dial: "+65", name: "Singapore" },
  { iso: "MY", dial: "+60", name: "Malaysia" },
  { iso: "AU", dial: "+61", name: "Australia" },
  { iso: "NZ", dial: "+64", name: "New Zealand" },
  { iso: "JP", dial: "+81", name: "Japan" },
  { iso: "KR", dial: "+82", name: "South Korea" },
  { iso: "CN", dial: "+86", name: "China" },
  { iso: "HK", dial: "+852", name: "Hong Kong" },
  { iso: "TW", dial: "+886", name: "Taiwan" },
  { iso: "IN", dial: "+91", name: "India" },
  { iso: "TH", dial: "+66", name: "Thailand" },
  { iso: "VN", dial: "+84", name: "Vietnam" },
  { iso: "PH", dial: "+63", name: "Philippines" },
  { iso: "DE", dial: "+49", name: "Germany" },
  { iso: "FR", dial: "+33", name: "France" },
  { iso: "NL", dial: "+31", name: "Netherlands" },
  { iso: "CH", dial: "+41", name: "Switzerland" },
  { iso: "AT", dial: "+43", name: "Austria" },
  { iso: "ES", dial: "+34", name: "Spain" },
  { iso: "AE", dial: "+971", name: "United Arab Emirates" },
  { iso: "SA", dial: "+966", name: "Saudi Arabia" },
  { iso: "BR", dial: "+55", name: "Brazil" },
];

function isoToFlag(iso: string): string {
  const u = iso.toUpperCase();
  if (u.length !== 2) return "🌐";
  return String.fromCodePoint(127397 + u.charCodeAt(0), 127397 + u.charCodeAt(1));
}

/* ─── Reusable form input ───────────────────────────────────────── */

const ERR_BORDER = "rgba(200,80,80,0.85)";

function FormInput({
  icon,
  error,
  shakeVersion = 0,
  className: inputClassName,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  icon: React.ReactNode;
  error?: string;
  shakeVersion?: number;
}) {
  const invalid = Boolean(error);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!invalid || shakeVersion === 0) return;
    const el = wrapRef.current;
    if (!el) return;
    el.classList.remove("reserve-field-shake");
    void el.offsetWidth;
    el.classList.add("reserve-field-shake");
    const t = window.setTimeout(() => {
      el.classList.remove("reserve-field-shake");
    }, 400);
    return () => window.clearTimeout(t);
  }, [invalid, shakeVersion]);

  return (
    <div ref={wrapRef} className="w-full">
      <div
        className={cn(
          "relative w-full rounded-lg transition-[box-shadow] duration-200 ease-out",
          !invalid && "focus-within:shadow-[0_0_0_3px_rgba(164,151,129,0.11)]",
        )}
      >
        <span
          className="pointer-events-none absolute z-[1]"
          style={{ left: 14, top: "50%", transform: "translateY(-50%)", color: INPUT_TEXT }}
        >
          {icon}
        </span>
        <input
          {...props}
          aria-invalid={invalid || undefined}
          className={cn(
            "manrope-regular w-full rounded-lg border bg-transparent outline-none transition-[border-color] duration-200 ease-out",
            "placeholder:text-[rgba(50,50,50,0.45)]",
            invalid
              ? "border-[rgba(200,80,80,0.85)]"
              : "border-[rgba(50,50,50,0.15)] focus:border-[rgba(164,151,129,0.65)]",
            inputClassName,
          )}
          style={{
            height: 48,
            paddingLeft: 42,
            paddingRight: 16,
            borderRadius: 8,
            fontSize: 14,
            color: INPUT_TEXT,
            backgroundColor: "transparent",
          }}
        />
      </div>
      {error ? (
        <p className="manrope-regular mt-1 text-[12px] leading-tight" style={{ color: ERR_BORDER }}>
          {error}
        </p>
      ) : null}
    </div>
  );
}

/** Phone with country dial code + national digits (same card styling as FormInput). */
function ReservePhoneField({
  dialCode,
  national,
  onDialCode,
  onNational,
  error,
  shakeVersion = 0,
}: {
  dialCode: string;
  national: string;
  onDialCode: (d: string) => void;
  onNational: (digits: string) => void;
  error?: string;
  shakeVersion?: number;
}) {
  const invalid = Boolean(error);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [countryOpen, setCountryOpen] = useState(false);

  useEffect(() => {
    if (!invalid || shakeVersion === 0) return;
    const el = wrapRef.current;
    if (!el) return;
    el.classList.remove("reserve-field-shake");
    void el.offsetWidth;
    el.classList.add("reserve-field-shake");
    const t = window.setTimeout(() => {
      el.classList.remove("reserve-field-shake");
    }, 400);
    return () => window.clearTimeout(t);
  }, [invalid, shakeVersion]);

  const selected = PHONE_COUNTRIES.find((c) => c.dial === dialCode) ?? PHONE_COUNTRIES[0];

  return (
    <div ref={wrapRef} className="w-full">
      <div
        className={cn(
          "relative flex h-12 w-full overflow-hidden rounded-lg border bg-transparent transition-[border-color,box-shadow] duration-200 ease-out",
          invalid
            ? "border-[rgba(200,80,80,0.85)]"
            : "border-[rgba(50,50,50,0.15)] focus-within:border-[rgba(164,151,129,0.65)] focus-within:shadow-[0_0_0_3px_rgba(164,151,129,0.11)]",
        )}
      >
        <span
          className="pointer-events-none absolute z-[1]"
          style={{ left: 14, top: "50%", transform: "translateY(-50%)", color: INPUT_TEXT }}
        >
          <img src={TelephoneSrc} alt="" style={{ width: 15, height: 15, objectFit: "contain", filter: "brightness(0)" }} />
        </span>
        <div className="flex min-w-0 flex-1 pl-8">
          <Popover open={countryOpen} onOpenChange={setCountryOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className={cn(
                  "relative flex h-12 w-max shrink-0 cursor-pointer items-center border-r border-[rgba(50,50,50,0.12)] bg-transparent pr-7 text-left outline-none transition-colors",
                  "hover:bg-black/[0.03] focus-visible:bg-black/[0.04]",
                )}
                style={{
                  paddingLeft: 4,
                  fontSize: 14,
                  color: INPUT_TEXT,
                }}
                aria-label="Country calling code"
              >
                <span className="flex items-center gap-1 leading-none">
                  <span className="manrope-regular w-[1.125rem] shrink-0 text-right text-[13px] font-medium uppercase tracking-tight">
                    {selected.iso}
                  </span>
                  <span className="manrope-regular shrink-0 tabular-nums text-[13px]">{selected.dial}</span>
                </span>
                <span
                  className="pointer-events-none absolute text-[rgba(50,50,50,1)]"
                  style={{ right: 6, top: "50%", transform: "translateY(-50%)" }}
                >
                  <ChevronDown size={14} />
                </span>
              </button>
            </PopoverTrigger>
            <PopoverContent
              align="start"
              sideOffset={4}
              className={`max-h-60 w-64 overflow-y-auto p-0 ${darkPopover}`}
            >
              <div className="px-2 pt-5 pb-1">
                <p className="monroe-regular text-[10px] uppercase tracking-[0.15em] text-white/50">
                  Select Country
                </p>
              </div>
              <div className="px-2 pb-3 pt-1">
                {PHONE_COUNTRIES.map((c) => {
                  const selectedRow = c.dial === dialCode;
                  return (
                    <button
                      key={`${c.iso}-${c.dial}`}
                      type="button"
                      onClick={() => {
                        onDialCode(c.dial);
                        setCountryOpen(false);
                      }}
                      className="manrope-regular flex w-full items-center justify-between rounded-sm px-3 py-3 text-left transition-colors hover:bg-white/10"
                      style={{
                        fontSize: 13,
                        color: selectedRow ? "rgba(164,151,129,1)" : "rgba(255,255,255,0.85)",
                      }}
                    >
                      <span className="flex min-w-0 flex-1 items-center gap-2">
                        <span className="shrink-0 text-base leading-none" aria-hidden>
                          {isoToFlag(c.iso)}
                        </span>
                        <span className="shrink-0 font-medium tabular-nums">{c.iso}</span>
                        <span className="shrink-0 tabular-nums">{c.dial}</span>
                        <span className="min-w-0 truncate text-[12px] text-white/40">{c.name}</span>
                      </span>
                      {selectedRow ? (
                        <Check size={13} style={{ color: "rgba(164,151,129,1)", flexShrink: 0 }} />
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </PopoverContent>
          </Popover>
          <input
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            placeholder="Phone Number"
            value={national}
            onChange={(e) => onNational(e.target.value.replace(/\D/g, ""))}
            aria-invalid={invalid || undefined}
            className={cn(
              "manrope-regular min-w-0 flex-1 bg-transparent px-2.5 py-0 text-[14px] outline-none",
              "placeholder:text-[rgba(50,50,50,0.45)]",
            )}
            style={{ color: INPUT_TEXT }}
          />
        </div>
      </div>
      {error ? (
        <p className="manrope-regular mt-1 text-[12px] leading-tight" style={{ color: ERR_BORDER }}>
          {error}
        </p>
      ) : null}
    </div>
  );
}

/* ─── Popover triggers: same typography as FormInput (14px, hitam) ─ */

const ReservePopoverTrigger = React.forwardRef<
  HTMLButtonElement,
  {
    icon: React.ReactNode;
    value: string;
    placeholder: string;
    invalid?: boolean;
  } & Omit<React.ComponentPropsWithoutRef<"button">, "value">
>(function ReservePopoverTrigger(
  { icon, value, placeholder, invalid, onFocus, onBlur, type: _t, children: _c, ...rest },
  ref,
) {
  const shown = value || placeholder;
  return (
    <button
      ref={ref}
      type="button"
      aria-invalid={invalid || undefined}
      className={cn(
        "relative block w-full manrope-regular text-left outline-none transition-[border-color,box-shadow] duration-200 ease-out",
        invalid
          ? "border border-[rgba(200,80,80,0.85)]"
          : "border border-[rgba(50,50,50,0.15)] focus-visible:border-[rgba(164,151,129,0.65)] focus-visible:shadow-[0_0_0_3px_rgba(164,151,129,0.11)]",
      )}
      style={{
        height: 48,
        paddingLeft: 42,
        paddingRight: 40,
        borderRadius: 8,
        fontSize: 14,
        color: INPUT_TEXT,
        backgroundColor: "transparent",
        cursor: "pointer",
      }}
      onFocus={onFocus}
      onBlur={onBlur}
      {...rest}
    >
      <span
        className="pointer-events-none absolute"
        style={{ left: 14, top: "50%", transform: "translateY(-50%)", color: INPUT_TEXT }}
      >
        {icon}
      </span>
      <span
        className="block truncate"
        style={{ color: value ? INPUT_TEXT : PLACEHOLDER_TEXT }}
      >
        {shown}
      </span>
      <span
        className="pointer-events-none absolute"
        style={{ right: 14, top: "50%", transform: "translateY(-50%)", color: INPUT_TEXT }}
      >
        <ChevronDown size={14} />
      </span>
    </button>
  );
});

/* ─── Dark popover wrapper (same background as hero) ────────────── */

const darkPopover = "border border-white/10 bg-[#1a1a18]/80 text-white shadow-2xl backdrop-blur-xl";

/* ─── Date range field ──────────────────────────────────────────── */

function ReserveDateField({
  dateRange,
  onChange,
  error,
  shakeVersion = 0,
}: {
  dateRange?: DateRange;
  onChange: (r?: DateRange) => void;
  error?: string;
  shakeVersion?: number;
}) {
  const [isMobile, setIsMobile] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const invalid = Boolean(error);

  useEffect(() => {
    if (!invalid || shakeVersion === 0) return;
    const el = wrapRef.current;
    if (!el) return;
    el.classList.remove("reserve-field-shake");
    void el.offsetWidth;
    el.classList.add("reserve-field-shake");
    const t = window.setTimeout(() => {
      el.classList.remove("reserve-field-shake");
    }, 400);
    return () => window.clearTimeout(t);
  }, [invalid, shakeVersion]);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const formatRange = () => {
    if (!dateRange?.from) return "";
    if (!dateRange.to) return format(dateRange.from, "MMM d");
    return `${format(dateRange.from, "MMM d")} – ${format(dateRange.to, "MMM d")}`;
  };

  return (
    <div ref={wrapRef} className="w-full">
      <Popover>
        <PopoverTrigger asChild>
          <ReservePopoverTrigger
            icon={<img src={CalenderSrc} alt="" style={{ width: 15, height: 15, objectFit: "contain", filter: "brightness(0)" }} />}
            value={formatRange()}
            placeholder="Arrival & Departure"
            invalid={invalid}
          />
        </PopoverTrigger>
      <PopoverContent
        align="start"
        className={`w-[calc(100vw-2rem)] max-w-[360px] p-0 sm:w-auto sm:max-w-none ${darkPopover}`}
      >
        <div className="px-5 pt-5 pb-1">
          <p className="monroe-regular text-[10px] uppercase tracking-[0.15em] text-white/50">
            Select Dates
          </p>
        </div>
        <Calendar
          mode="range"
          selected={dateRange}
          onSelect={onChange}
          fromDate={new Date()}
          numberOfMonths={isMobile ? 1 : 2}
          initialFocus
          classNames={DARK_CAL_CLASSNAMES}
        />
      </PopoverContent>
      </Popover>
      {error ? (
        <p className="manrope-regular mt-1 text-[12px] leading-tight" style={{ color: ERR_BORDER }}>
          {error}
        </p>
      ) : null}
    </div>
  );
}

/* ─── Guests field ──────────────────────────────────────────────── */

function ReserveGuestsField({
  value,
  onChange,
  error,
  shakeVersion = 0,
}: {
  value: Guests;
  onChange: (g: Guests) => void;
  error?: string;
  shakeVersion?: number;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const invalid = Boolean(error);

  useEffect(() => {
    if (!invalid || shakeVersion === 0) return;
    const el = wrapRef.current;
    if (!el) return;
    el.classList.remove("reserve-field-shake");
    void el.offsetWidth;
    el.classList.add("reserve-field-shake");
    const t = window.setTimeout(() => {
      el.classList.remove("reserve-field-shake");
    }, 400);
    return () => window.clearTimeout(t);
  }, [invalid, shakeVersion]);

  const total = value.adults + value.children;
  const valueStr = total > 0 ? `${total} ${total === 1 ? "guest" : "guests"}` : "";

  return (
    <div ref={wrapRef} className="w-full">
      <Popover>
        <PopoverTrigger asChild>
          <ReservePopoverTrigger
            icon={<img src={PeopleSrc} alt="" style={{ width: 15, height: 15, objectFit: "contain", filter: "brightness(0)" }} />}
            value={valueStr}
            placeholder="Guests"
            invalid={invalid}
          />
        </PopoverTrigger>
      <PopoverContent align="start" className={`w-72 p-0 ${darkPopover}`}>
        <div className="px-5 pt-5 pb-1">
          <p className="monroe-regular text-[10px] uppercase tracking-[0.15em] text-white/50">
            Select Guests
          </p>
        </div>
        <div className="px-5 py-3 space-y-1">
          <StepperRow
            label="Adults"
            sublabel="Ages 13 or above"
            value={value.adults}
            min={0}
            max={8}
            onChange={(v) => onChange({ ...value, adults: v })}
          />
          <div className="h-px bg-white/10" />
          <StepperRow
            label="Children"
            sublabel="Ages 0 – 12"
            value={value.children}
            min={0}
            max={6}
            onChange={(v) => onChange({ ...value, children: v })}
          />
        </div>
        <div className="px-5 pb-4 pt-2">
          <div className="h-px bg-white/10" />
          <p className="mt-3 text-[10px] text-white/30">Max 8 adults · 6 children per booking</p>
        </div>
      </PopoverContent>
      </Popover>
      {error ? (
        <p className="manrope-regular mt-1 text-[12px] leading-tight" style={{ color: ERR_BORDER }}>
          {error}
        </p>
      ) : null}
    </div>
  );
}

function StepperRow({
  label, sublabel, value, min, max, onChange,
}: {
  label: string; sublabel: string; value: number; min: number; max: number; onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <div className="monroe-regular text-sm text-white">{label}</div>
        <div className="mt-0.5 text-[11px] text-white/40">{sublabel}</div>
      </div>
      <div className="flex items-center gap-4">
        <button
          type="button"
          disabled={value <= min}
          onClick={() => onChange(value - 1)}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-white/70 transition-colors hover:border-[#A49781] hover:text-[#A49781] disabled:cursor-not-allowed disabled:opacity-20"
        >
          <Minus className="h-3 w-3" />
        </button>
        <span className="monroe-regular w-5 text-center tabular-nums text-base text-white">{value}</span>
        <button
          type="button"
          disabled={value >= max}
          onClick={() => onChange(value + 1)}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-white/70 transition-colors hover:border-[#A49781] hover:text-[#A49781] disabled:cursor-not-allowed disabled:opacity-20"
        >
          <Plus className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}

/* ─── Room selector ─────────────────────────────────────────────── */

function RoomField({
  value,
  onChange,
}: {
  value: string;
  onChange: (r: string) => void;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "relative flex h-12 w-full cursor-pointer items-center border border-[rgba(50,50,50,0.15)] bg-transparent text-left manrope-regular outline-none transition-[border-color,box-shadow] duration-200 ease-out",
            "focus-visible:border-[rgba(164,151,129,0.65)] focus-visible:shadow-[0_0_0_3px_rgba(164,151,129,0.11)]",
          )}
          style={{
            paddingLeft: 42,
            paddingRight: 40,
            borderRadius: 8,
            fontSize: 14,
            color: INPUT_TEXT,
          }}
        >
          <span className="pointer-events-none absolute" style={{ left: 14, top: "50%", transform: "translateY(-50%)", color: INPUT_TEXT }}>
            <img src={BedReservedSrc} alt="" style={{ width: 15, height: 15, objectFit: "contain", filter: "brightness(0)" }} />
          </span>
          <span style={{ flex: 1, color: value ? INPUT_TEXT : PLACEHOLDER_TEXT }}>{value || "Select Room"}</span>
          <span className="pointer-events-none absolute" style={{ right: 14, top: "50%", transform: "translateY(-50%)", color: INPUT_TEXT }}>
            <ChevronDown size={14} />
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className={`w-72 p-0 ${darkPopover}`}>
        <div className="px-5 pt-5 pb-1">
          <p className="monroe-regular text-[10px] uppercase tracking-[0.15em] text-white/50">
            Select Room
          </p>
        </div>
        <div className="px-2 pb-3 pt-1">
          {ROOM_OPTIONS.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => onChange(r)}
              className="monroe-regular flex w-full items-center justify-between rounded-sm px-3 py-3 text-left transition-colors hover:bg-white/10"
              style={{ fontSize: 13, color: value === r ? "rgba(164,151,129,1)" : "rgba(255,255,255,0.85)" }}
            >
              <span>{r}</span>
              {value === r && <Check size={13} style={{ color: "rgba(164,151,129,1)", flexShrink: 0 }} />}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

/* ─── Section label ─────────────────────────────────────────────── */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="manrope-regular"
      style={{ fontSize: 16, letterSpacing: 0, color: "rgba(50,50,50,1)", marginBottom: 14 }}
    >
      {children}
    </p>
  );
}

/* ─── Reserve section ───────────────────────────────────────────── */

export function Reserve() {
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [guests, setGuests] = useState<Guests>({ adults: 0, children: 0 });
  const [room, setRoom] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneDial, setPhoneDial] = useState(PHONE_COUNTRIES[0].dial);
  const [phoneNational, setPhoneNational] = useState("");
  const [formErrors, setFormErrors] = useState<{
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    dates?: string;
    guests?: string;
  }>({});
  /** Bumped on each failed submit so invalid fields replay the shake animation. */
  const [fieldShakeVersion, setFieldShakeVersion] = useState(0);

  /* Live hydration from hero booking bar via custom event */
  useEffect(() => {
    const handleHeroRequest = (e: Event) => {
      const { dateRange: dr, guests: g } = (e as CustomEvent).detail as {
        dateRange: { from?: string; to?: string } | null;
        guests: Guests;
      };
      if (dr?.from) {
        setDateRange({ from: new Date(dr.from), to: dr.to ? new Date(dr.to) : undefined });
      }
      if (g) {
        setGuests(g);
        if (g.adults + g.children > 0) {
          setFormErrors((p) => ({ ...p, guests: undefined }));
        }
      }
    };

    const handleRoomRequest = (e: Event) => {
      const { room: r } = (e as CustomEvent).detail as { room: string };
      if (r) setRoom(r);
    };

    window.addEventListener("hero:reserve-request", handleHeroRequest);
    window.addEventListener("room:reserve-request", handleRoomRequest);
    return () => {
      window.removeEventListener("hero:reserve-request", handleHeroRequest);
      window.removeEventListener("room:reserve-request", handleRoomRequest);
    };
  }, []);

  const toggleExtra = (extra: string) =>
    setSelectedExtras((prev) =>
      prev.includes(extra) ? prev.filter((e) => e !== extra) : [...prev, extra],
    );

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: typeof formErrors = {};
    const fn = firstName.trim();
    const ln = lastName.trim();
    const em = email.trim();
    const natDigits = phoneNational.replace(/\D/g, "");
    const dialDigits = phoneDial.replace(/\D/g, "");
    const phoneDigits = `${dialDigits}${natDigits}`;

    if (!fn) next.firstName = "Please enter your first name.";
    else if (!looksLikeValidName(fn)) next.firstName = "Use letters and spaces only (2+ characters).";

    if (!ln) next.lastName = "Please enter your last name.";
    else if (!looksLikeValidName(ln)) next.lastName = "Use letters and spaces only (2+ characters).";

    if (!em) next.email = "Please enter your email address.";
    else if (emailMissingAt(em)) next.email = "Email must include @.";
    else if (!looksLikeValidEmail(em)) next.email = "Enter a valid email (e.g. name@domain.com).";

    if (!natDigits) next.phone = "Please enter your phone number.";
    else if (!looksLikeValidPhoneDigits(phoneDigits)) next.phone = "Enter a valid phone number (8–15 digits total).";

    const guestTotal = guests.adults + guests.children;
    if (guestTotal < 1) next.guests = "Please select at least one guest.";

    if (!dateRange?.from || !dateRange.to) {
      next.dates = "Please select both arrival and departure dates.";
    } else if (dateRange.to < dateRange.from) {
      next.dates = "Departure must be on or after arrival.";
    }

    setFormErrors(next);
    if (Object.keys(next).length > 0) {
      setFieldShakeVersion((v) => v + 1);
      toast.error("Please fix the highlighted fields.");
      return;
    }
    toast.success("Request received — our concierge will be in touch within 24 hours.");
  };

  return (
    <section
      data-section-animate
      id="reserve"
      className="relative py-16 md:py-20"
      style={{
        backgroundImage: `url(${BackReserveSrc})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <style>{`
        @keyframes reserve-field-warn {
          0%, 100% { transform: translateY(0); }
          12% { transform: translateY(-6px); }
          28% { transform: translateY(5px); }
          44% { transform: translateY(-4px); }
          60% { transform: translateY(3px); }
          76% { transform: translateY(-2px); }
          88% { transform: translateY(1px); }
        }
        .reserve-field-shake {
          animation: reserve-field-warn 0.36s cubic-bezier(0.36, 0.12, 0.22, 1) both;
        }
      `}</style>
      <div
        className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/40 to-black/55"
        aria-hidden
      />

      <div className="relative z-[1]">
        <Container>
          {/* Header — centered white type (same scale as other sections) */}
          <div className="mb-8 px-1 text-center md:mb-10">
            <p
              data-reveal
              className="monroe-regular mb-3 text-[14px] text-white/80 md:text-[16px]"
            >
              — Plan Your Stay —
            </p>
            <h2
              data-reveal
              className="manrope-regular mb-4 text-[clamp(26px,6vw,40px)] font-normal leading-[140%] text-white"
            >
              Request a Personal Quote
            </h2>
            <p
              data-reveal
              className="manrope-regular mx-auto max-w-xl text-[16px] leading-[150%] text-white/75"
            >
              Fill out the form below, and our team will get back to you within 24 hours with a
              non-binding offer tailored to your needs.
            </p>
          </div>

          {/* Form card — max width so the form is not stretched edge-to-edge */}
          <form
            data-reveal
            noValidate
            onSubmit={onSubmit}
            className="mx-auto w-full max-w-[560px] px-4 py-6 sm:max-w-[600px] sm:px-8 sm:py-8"
            style={{
              backgroundColor: "rgba(255,255,255,1)",
              borderRadius: 8,
            }}
          >
            {/* Your Details */}
            <SectionLabel>Your Details</SectionLabel>
            <div className="mb-7 grid grid-cols-1 gap-2.5 md:grid-cols-2 md:gap-[10px]">
              <FormInput
                icon={<img src={PersonSrc} alt="" style={{ width: 15, height: 15, objectFit: "contain", filter: "brightness(0)" }} />}
                placeholder="First Name"
                autoComplete="given-name"
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                  setFormErrors((p) => ({ ...p, firstName: undefined }));
                }}
                error={formErrors.firstName}
                shakeVersion={fieldShakeVersion}
              />
              <FormInput
                icon={<img src={PersonSrc} alt="" style={{ width: 15, height: 15, objectFit: "contain", filter: "brightness(0)" }} />}
                placeholder="Last Name"
                autoComplete="family-name"
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                  setFormErrors((p) => ({ ...p, lastName: undefined }));
                }}
                error={formErrors.lastName}
                shakeVersion={fieldShakeVersion}
              />
              <FormInput
                icon={<img src={MailSrc} alt="" style={{ width: 15, height: 15, objectFit: "contain", filter: "brightness(0)" }} />}
                type="text"
                inputMode="email"
                placeholder="Email Address"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  const v = e.target.value;
                  setEmail(v);
                  setFormErrors((p) => {
                    const t = v.trim();
                    if (t.length === 0) return { ...p, email: undefined };
                    if (emailMissingAt(v)) return { ...p, email: "Email must include @." };
                    return { ...p, email: undefined };
                  });
                }}
                onBlur={() => {
                  const t = email.trim();
                  if (!t) return;
                  if (emailMissingAt(email)) {
                    setFormErrors((p) => ({ ...p, email: "Email must include @." }));
                    return;
                  }
                  if (t.includes("@") && !looksLikeValidEmail(t)) {
                    setFormErrors((p) => ({ ...p, email: "Enter a valid email (e.g. name@domain.com)." }));
                  }
                }}
                error={formErrors.email}
                shakeVersion={fieldShakeVersion}
              />
              <ReservePhoneField
                dialCode={phoneDial}
                national={phoneNational}
                onDialCode={(d) => {
                  setPhoneDial(d);
                  setFormErrors((p) => ({ ...p, phone: undefined }));
                }}
                onNational={(digits) => {
                  setPhoneNational(digits);
                  setFormErrors((p) => ({ ...p, phone: undefined }));
                }}
                error={formErrors.phone}
                shakeVersion={fieldShakeVersion}
              />
            </div>

            {/* Stay */}
            <SectionLabel>Stay</SectionLabel>
            <div className="mb-[10px] grid grid-cols-1 gap-2.5 md:grid-cols-2 md:gap-[10px]">
              <ReserveDateField
                dateRange={dateRange}
                onChange={(r) => {
                  setDateRange(r);
                  setFormErrors((p) => ({ ...p, dates: undefined }));
                }}
                error={formErrors.dates}
                shakeVersion={fieldShakeVersion}
              />
              <ReserveGuestsField
                value={guests}
                onChange={(g) => {
                  setGuests(g);
                  if (g.adults + g.children > 0) {
                    setFormErrors((p) => ({ ...p, guests: undefined }));
                  }
                }}
                error={formErrors.guests}
                shakeVersion={fieldShakeVersion}
              />
            </div>
            <div className="mb-7">
              <RoomField value={room} onChange={setRoom} />
            </div>

            {/* Add-ons */}
            <SectionLabel>Your Details</SectionLabel>
            <div className="mb-7 grid grid-cols-1 gap-2.5 md:grid-cols-2 md:gap-[10px]">
              {EXTRAS.map((extra) => {
                const checked = selectedExtras.includes(extra);
                return (
                  <label
                    key={extra}
                    className="manrope-regular w-full"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "13px 16px",
                      border: `1px solid ${checked ? "rgba(164,151,129,0.6)" : "rgba(50,50,50,0.15)"}`,
                      borderRadius: 8,
                      cursor: "pointer",
                      fontSize: 14,
                      color: "rgba(50,50,50,1)",
                      transition: "border-color 0.2s",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleExtra(extra)}
                      style={{ width: 16, height: 16, accentColor: "#A49781", cursor: "pointer", flexShrink: 0 }}
                    />
                    {extra}
                  </label>
                );
              })}
            </div>

            {/* Special Requests */}
            <SectionLabel>Special Requests</SectionLabel>
            <textarea
              rows={5}
              placeholder="Anniversary, dietary preferences, arrival time..."
              className={cn(
                "manrope-regular mb-6 w-full rounded-lg border border-[rgba(50,50,50,0.15)] bg-transparent outline-none transition-[border-color,box-shadow] duration-200 ease-out",
                "placeholder:text-[rgba(50,50,50,0.45)]",
                "focus:border-[rgba(164,151,129,0.65)] focus:shadow-[0_0_0_3px_rgba(164,151,129,0.11)]",
              )}
              style={{
                padding: "14px 16px",
                fontSize: 14,
                color: INPUT_TEXT,
                resize: "vertical",
                fontFamily: "inherit",
              }}
            />

            {/* Submit — full width mobile; auto width + kanan di desktop */}
            <div className="flex w-full justify-stretch md:justify-end">
              <button
                type="submit"
                className="manrope-regular w-full py-3.5 text-center transition-opacity hover:opacity-90 md:w-auto md:px-7 md:py-[13px]"
                style={{
                  fontSize: 11,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  backgroundColor: "rgba(164,151,129,1)",
                  color: "white",
                  border: "none",
                  borderRadius: 8,
                  cursor: "pointer",
                }}
              >
                Submit Request
              </button>
            </div>
          </form>
        </Container>
      </div>
    </section>
  );
}
