import React, { useState, useEffect } from "react";
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

/* ─── Reusable form input ───────────────────────────────────────── */

function FormInput({
  icon,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { icon: React.ReactNode }) {
  return (
    <div className="relative">
      <span
        className="pointer-events-none absolute"
        style={{ left: 14, top: "50%", transform: "translateY(-50%)", color: INPUT_TEXT }}
      >
        {icon}
      </span>
      <input
        {...props}
        className="manrope-regular w-full placeholder:text-[rgba(50,50,50,0.45)]"
        style={{
          height: 48,
          paddingLeft: 42,
          paddingRight: 16,
          border: "1px solid rgba(50,50,50,0.15)",
          borderRadius: 8,
          fontSize: 14,
          color: INPUT_TEXT,
          backgroundColor: "transparent",
          outline: "none",
        }}
        onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(164,151,129,0.6)"; }}
        onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(50,50,50,0.15)"; }}
      />
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
  } & Omit<React.ComponentPropsWithoutRef<"button">, "value">
>(function ReservePopoverTrigger(
  { icon, value, placeholder, onFocus, onBlur, type: _t, children: _c, ...rest },
  ref,
) {
  const shown = value || placeholder;
  return (
    <button
      ref={ref}
      type="button"
      className="relative block w-full manrope-regular text-left"
      style={{
        height: 48,
        paddingLeft: 42,
        paddingRight: 40,
        border: "1px solid rgba(50,50,50,0.15)",
        borderRadius: 8,
        fontSize: 14,
        color: INPUT_TEXT,
        backgroundColor: "transparent",
        cursor: "pointer",
        outline: "none",
      }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = "rgba(164,151,129,0.6)";
        onFocus?.(e);
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = "rgba(50,50,50,0.15)";
        onBlur?.(e);
      }}
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
}: {
  dateRange?: DateRange;
  onChange: (r?: DateRange) => void;
}) {
  const formatRange = () => {
    if (!dateRange?.from) return "";
    if (!dateRange.to) return format(dateRange.from, "MMM d");
    return `${format(dateRange.from, "MMM d")} – ${format(dateRange.to, "MMM d")}`;
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <ReservePopoverTrigger
          icon={<img src={CalenderSrc} alt="" style={{ width: 15, height: 15, objectFit: "contain", filter: "brightness(0)" }} />}
          value={formatRange()}
          placeholder="Arrival & Departure"
        />
      </PopoverTrigger>
      <PopoverContent align="start" className={`w-auto p-0 ${darkPopover}`}>
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
          numberOfMonths={2}
          initialFocus
          classNames={DARK_CAL_CLASSNAMES}
        />
      </PopoverContent>
    </Popover>
  );
}

/* ─── Guests field ──────────────────────────────────────────────── */

function ReserveGuestsField({
  value,
  onChange,
}: {
  value: Guests;
  onChange: (g: Guests) => void;
}) {
  const total = value.adults + value.children;
  const valueStr = total > 0 ? `${total} ${total === 1 ? "guest" : "guests"}` : "";

  return (
    <Popover>
      <PopoverTrigger asChild>
        <ReservePopoverTrigger
          icon={<img src={PeopleSrc} alt="" style={{ width: 15, height: 15, objectFit: "contain", filter: "brightness(0)" }} />}
          value={valueStr}
          placeholder="Guests"
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
          className="relative w-full manrope-regular"
          style={{
            height: 48,
            paddingLeft: 42,
            paddingRight: 40,
            border: "1px solid rgba(50,50,50,0.15)",
            borderRadius: 8,
            fontSize: 14,
            color: INPUT_TEXT,
            backgroundColor: "transparent",
            textAlign: "left",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            outline: "none",
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(164,151,129,0.6)"; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(50,50,50,0.15)"; }}
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
      if (g) setGuests(g);
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
    toast.success("Request received — our concierge will be in touch within 24 hours.");
  };

  return (
    <section
      id="reserve"
      style={{
        position: "relative",
        backgroundImage: `url(${BackReserveSrc})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        paddingTop: 80,
        paddingBottom: 80,
      }}
    >
      <div className="absolute inset-0" style={{ backgroundColor: "rgba(0,0,0,0.48)" }} />

      <div className="relative" style={{ zIndex: 1 }}>
        <Container>
          {/* Header */}
          <div className="mb-10 text-center">
            <p className="monroe-regular mb-3" style={{ fontSize: 16, color: "rgba(255,255,255,0.75)" }}>
              — Plan Your Stay —
            </p>
            <h2
              className="manrope-regular mb-4"
              style={{ fontSize: 40, fontWeight: 400, lineHeight: "140%", color: "rgba(255,255,255,1)" }}
            >
              Request a Personal Quote
            </h2>
            <p
              className="manrope-regular"
              style={{ fontSize: 16, lineHeight: "150%", color: "rgba(255,255,255,0.7)", maxWidth: "100%", margin: "0 auto" }}
            >
              Fill out the form below, and our team will get back to you within 24 hours with a
              non-binding offer tailored to your needs.
            </p>
          </div>

          {/* Form card */}
          <form
            onSubmit={onSubmit}
            style={{
              backgroundColor: "rgba(255,255,255,1)",
              borderRadius: 8,
              padding: "32px 32px 28px",
              maxWidth: 780,
              margin: "0 auto",
            }}
          >
            {/* Your Details */}
            <SectionLabel>Your Details</SectionLabel>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 28 }}>
              <FormInput icon={<img src={PersonSrc} alt="" style={{ width: 15, height: 15, objectFit: "contain", filter: "brightness(0)" }} />} placeholder="First Name" required />
              <FormInput icon={<img src={PersonSrc} alt="" style={{ width: 15, height: 15, objectFit: "contain", filter: "brightness(0)" }} />} placeholder="Last Name" required />
              <FormInput icon={<img src={MailSrc} alt="" style={{ width: 15, height: 15, objectFit: "contain", filter: "brightness(0)" }} />} type="email" placeholder="Email Address" required />
              <FormInput icon={<img src={TelephoneSrc} alt="" style={{ width: 15, height: 15, objectFit: "contain", filter: "brightness(0)" }} />} type="tel" placeholder="Phone Number" />
            </div>

            {/* Stay */}
            <SectionLabel>Stay</SectionLabel>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
              <ReserveDateField dateRange={dateRange} onChange={setDateRange} />
              <ReserveGuestsField value={guests} onChange={setGuests} />
            </div>
            <div style={{ marginBottom: 28 }}>
              <RoomField value={room} onChange={setRoom} />
            </div>

            {/* Add-ons */}
            <SectionLabel>Your Details</SectionLabel>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 28 }}>
              {EXTRAS.map((extra) => {
                const checked = selectedExtras.includes(extra);
                return (
                  <label
                    key={extra}
                    className="manrope-regular"
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
              className="manrope-regular w-full placeholder:text-[rgba(50,50,50,0.45)]"
              style={{
                padding: "14px 16px",
                border: "1px solid rgba(50,50,50,0.15)",
                borderRadius: 8,
                fontSize: 14,
                color: INPUT_TEXT,
                backgroundColor: "transparent",
                outline: "none",
                resize: "vertical",
                fontFamily: "inherit",
                marginBottom: 24,
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(164,151,129,0.6)"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(50,50,50,0.15)"; }}
            />

            {/* Submit */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="manrope-regular transition-opacity hover:opacity-85"
                style={{
                  padding: "13px 28px",
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
