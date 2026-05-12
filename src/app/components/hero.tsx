import { useState, useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { Container } from "./shared/Container";
import { CarouselArrowButton } from "./shared/CarouselArrowButton";
import { Minus, Plus } from "lucide-react";
import PeopleSrc from "@/assets/icons/People.svg";
import CalenderSrc from "@/assets/icons/Calender.svg";
import ArrowDownSrc from "@/assets/icons/ArrowDown.svg";
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";
import type { Guests } from "./booking-fields";
import HeroImage1 from "@/assets/images/HeroImage1.svg";
import HeroImage2 from "@/assets/images/HeroImage2.svg";
import HeroImage3 from "@/assets/images/About2.svg";

/* ─── Slide data ────────────────────────────────────────────────── */

const SLIDES = [
  { src: HeroImage1, alt: "Hero image 1" },
  { src: HeroImage2, alt: "Hero image 2" },
  { src: HeroImage3, alt: "Hero image 3" },
];

/* ─── Hero ──────────────────────────────────────────────────────── */

export function Hero() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    duration: 26,
    skipSnaps: false,
    dragFree: false,
    containScroll: "trimSnaps",
    slidesToScroll: 1,
  });
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [guests, setGuests] = useState<Guests | null>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const update = () => {
      setCanPrev(emblaApi.canScrollPrev());
      setCanNext(emblaApi.canScrollNext());
    };
    update();
    emblaApi.on("select", update);
    emblaApi.on("reInit", update);
    return () => {
      emblaApi.off("select", update);
      emblaApi.off("reInit", update);
    };
  }, [emblaApi]);

  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      {/* ── Carousel ── */}
      <div ref={emblaRef} className="absolute inset-0 overflow-hidden">
        <div className="flex h-full touch-pan-y will-change-transform [transform:translate3d(0,0,0)]">
          {SLIDES.map((slide, i) => (
            <div
              key={i}
              className="relative h-full min-w-full flex-[0_0_100%] [backface-visibility:hidden] [transform:translate3d(0,0,0)] [will-change:transform]"
            >
              <img
                src={slide.src}
                alt={slide.alt}
                className="h-full w-full object-cover [transform:translateZ(0)] [will-change:transform]"
                loading="eager"
                decoding="sync"
                fetchPriority={i === 0 ? "high" : "auto"}
                draggable={false}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── Gradient overlay ── */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/35 via-black/10 to-black/65" />

      {/* ── Carousel arrows — aligned to container left/right edges ── */}
      <div className="pointer-events-none absolute inset-x-0 top-1/2 z-20 -translate-y-1/2">
        <Container className="pointer-events-none flex items-center justify-between">
          <CarouselArrowButton
            direction="prev"
            onClick={scrollPrev}
            disabled={!canPrev}
            className="pointer-events-auto"
            bgColor="rgba(0,0,0,0.4)"
          />
          <CarouselArrowButton
            direction="next"
            onClick={scrollNext}
            disabled={!canNext}
            className="pointer-events-auto"
            bgColor="rgba(0,0,0,0.4)"
          />
        </Container>
      </div>

      {/* ── Hero content — pinned to bottom ── */}
      <div className="absolute bottom-0 left-0 right-0 z-10 pb-4 sm:pb-10">
        <Container className="flex flex-col items-center text-center text-white">

          {/* Title */}
          <h1
            className="manrope-regular mb-4 max-w-2xl text-white sm:mb-6"
            style={{ fontSize: "clamp(1rem, 4.8vw, 2rem)", lineHeight: 1.05 }}
          >
            The Silence of the Alps, Redefined.
          </h1>

          {/* Booking bar */}
          <HeroBookingBar
            dateRange={dateRange}
            onDateChange={setDateRange}
            guests={guests}
            onGuestsChange={setGuests}
          />
        </Container>
      </div>
    </section>
  );
}

/* ─── Hero Booking Bar ──────────────────────────────────────────── */

type HeroBookingBarProps = {
  dateRange: DateRange | undefined;
  onDateChange: (r?: DateRange) => void;
  guests: Guests | null;
  onGuestsChange: (g: Guests) => void;
};

const DEFAULT_GUESTS: Guests = { adults: 2, children: 0 };

function HeroBookingBar({ dateRange, onDateChange, guests, onGuestsChange }: HeroBookingBarProps) {
  const activeGuests = guests ?? DEFAULT_GUESTS;
  const [isMobile, setIsMobile] = useState(false);
  const total = activeGuests.adults + activeGuests.children;
  const guestLabel = guests
    ? `${total} ${total === 1 ? "guest" : "guests"}`
    : null;

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const dateLabel = () => {
    if (!dateRange?.from) return null;
    if (!dateRange.to) return format(dateRange.from, "MMM d");
    return `${format(dateRange.from, "MMM d")} – ${format(dateRange.to, "MMM d")}`;
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent("hero:reserve-request", {
          detail: {
            dateRange: dateRange ? { from: dateRange.from?.toISOString(), to: dateRange.to?.toISOString() } : null,
            guests: activeGuests,
          },
        }));
        document.getElementById("reserve")?.scrollIntoView({ behavior: "smooth" });
      }}
      className="w-full max-w-[765px] overflow-hidden rounded-xl shadow-2xl bg-[#40403F]"
    >
      {/* Guests + Arrival & Departure joined section */}
      <div className="flex flex-col md:flex-row">
        <div className="flex flex-1 flex-col bg-black/35 backdrop-blur-2xl md:flex-row md:bg-transparent md:backdrop-blur-none">
        {/* Guests */}
        <Popover> 
          <PopoverTrigger asChild>
            <button
              type="button"
              className="flex h-[70px] flex-1 items-center gap-3 px-4 py-2 text-left transition-colors md:h-[72px] md:px-5"
            >
              <img src={PeopleSrc} alt="" className="h-4 w-4 flex-shrink-0" style={{ filter: "brightness(0) invert(1)" }} />
              <div className="min-w-0 flex-1">
                <div className="monroe-regular text-[12px] uppercase text-white/60 md:text-[14px] md:text-white/70">
                  Guests        
                </div>
                <div className="monroe-regular mt-0.5 truncate text-[12px] text-white md:text-sm leading-normal">
                  {guestLabel ?? (
                    <span className="text-white">Number of Guests</span>
                  )}
                </div>
              </div>
              <img src={ArrowDownSrc} alt="" className="h-3.5 w-3.5 flex-shrink-0" style={{ opacity: 0.5 }} />
            </button>
          </PopoverTrigger>
          <PopoverContent
            align="start"
            className="w-72 border border-white/10 bg-[#1a1a18]/70 p-0 text-white shadow-2xl backdrop-blur-xl"
          >
            <div className="px-5 pt-5 pb-1">
              <p className="monroe-regular text-[10px] uppercase tracking-[0.15em] text-white/50">
                Select Guests
              </p>
            </div>
            <GuestStepper guests={activeGuests} onChange={onGuestsChange} />
            <div className="px-5 pb-4 pt-3">
              <div className="h-px bg-white/10" />
              <p className="mt-3 text-[10px] text-white/30">
                Max 8 adults · 6 children per booking
              </p>
            </div>
          </PopoverContent>
        </Popover>

        {/* Divider — desktop only (vertical between Guests & Arrival) */}
        <div
          aria-hidden
          className="hidden w-px flex-shrink-0 bg-white/20 md:my-4 md:block md:self-stretch"
        />

        {/* Arrival & Departure */}
        <Popover>
          <PopoverTrigger asChild>
            <button 
              type="button"
              className="flex h-[70px] flex-1 items-center gap-3 px-4 py-2 text-left transition-colors md:h-[72px] md:px-5 md:py-5"
            >
              <img src={CalenderSrc} alt="" className="h-4 w-4 flex-shrink-0" style={{ filter: "brightness(0) invert(1)" }} />
              <div className="min-w-0 flex-1">
                <div className="monroe-regular text-[12px] uppercase text-white/60 md:text-[14px] md:text-white/70">
                  Arrival &amp; Departure
                </div>
                <div className="monroe-regular mt-0.5 truncate text-[12px] leading-none text-white md:text-sm md:leading-normal">
                  {dateLabel() ?? (
                    <span className="text-white">Select Date</span>
                  )}
                </div>
              </div>
              <img src={ArrowDownSrc} alt="" className="h-3.5 w-3.5 flex-shrink-0" style={{ opacity: 0.5 }} />
            </button>
          </PopoverTrigger>
          <PopoverContent
            align="start"
            className="w-[calc(100vw-2rem)] max-w-[360px] border border-white/10 bg-[#1a1a18]/70 p-0 text-white shadow-2xl backdrop-blur-xl sm:w-auto sm:max-w-none"
          >
            <div className="px-5 pt-5 pb-1">
              <p className="monroe-regular text-[10px] uppercase tracking-[0.15em] text-white/50">
                Select Dates
              </p>
            </div>
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={onDateChange}
              fromDate={new Date()}
              numberOfMonths={isMobile ? 1 : 2}
              initialFocus
              classNames={{
                months: "flex flex-col sm:flex-row gap-6 p-4",
                month: "flex flex-col gap-3",
                caption: "flex justify-center relative items-center",
                caption_label: "monroe-regular text-sm uppercase tracking-[0.1em] text-white",
                nav: "flex items-center gap-1",
                nav_button: "h-7 w-7 flex items-center justify-center rounded-sm bg-white/5 hover:bg-white/15 transition-colors text-white/60 hover:text-white",
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
              }}
            />
          </PopoverContent>
        </Popover>
        </div>

        {/* Request CTA */}
        <button
          type="submit"
          className="monroe-regular h-[42px] w-full bg-[#A49781] text-[14px] uppercase tracking-[0.1em] text-white transition-colors hover:bg-[#8f8370] md:h-auto md:w-auto md:px-8 md:text-sm"
        >
          Request
        </button>
      </div>
    </form>
  );
}

/* ─── Guest Stepper ─────────────────────────────────────────────── */

function GuestStepper({
  guests,
  onChange,
}: {
  guests: Guests;
  onChange: (g: Guests) => void;
}) {
  return (
    <div className="px-5 py-3 space-y-1">
      <StepperRow
        label="Adults"
        sublabel="Ages 13 or above"
        value={guests.adults}
        min={1}
        max={8}
        onChange={(v) => onChange({ ...guests, adults: v })}
      />
      <div className="h-px bg-white/10" />
      <StepperRow
        label="Children"
        sublabel="Ages 0 – 12"
        value={guests.children}
        min={0}
        max={6}
        onChange={(v) => onChange({ ...guests, children: v })}
      />
    </div>
  );
}

function StepperRow({
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
    <div className="flex items-center justify-between py-3">
      <div>
        <div className="monroe-regular text-sm text-white">{label}</div>
        <div className="text-[11px] text-white/40 mt-0.5">{sublabel}</div>
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
        <span className="monroe-regular w-5 text-center tabular-nums text-base text-white">
          {value}
        </span>
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
