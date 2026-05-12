import { useState, useEffect, useRef, useId, useLayoutEffect, type CSSProperties } from "react";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { Container } from "./shared/Container";
import { cn } from "./ui/utils";
import logomarkSrc from "@/assets/icons/logomark.svg";
import logotypeSrc from "@/assets/icons/logotype.svg";

gsap.registerPlugin(ScrollToPlugin);

const NAV_LINKS = [
  { label: "ROOMS", href: "#rooms" },
  { label: "AMENITIES", href: "#amenities" },
  { label: "RESERVE", href: "#reserve" },
] as const;

/** Offset so section titles clear the fixed navbar */
const SCROLL_OFFSET_Y = 80;

function scrollToHash(href: string) {
  const id = href.slice(1);
  const el = document.getElementById(id);
  if (!el) return;
  gsap.to(window, {
    duration: 0.85,
    scrollTo: { y: el, offsetY: SCROLL_OFFSET_Y, autoKill: true },
    ease: "sine.inOut",
  });
}

function onInPageNavClick(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
  if (!href.startsWith("#")) return;
  e.preventDefault();
  scrollToHash(href);
  window.history.pushState(null, "", href);
}

/** Perimeter of an axis-aligned rounded rect (uniform corner radius r). */
function roundedRectPerimeter(w: number, h: number, r: number) {
  const rx = Math.max(0, Math.min(r, w / 2, h / 2));
  if (rx <= 0) return 2 * (w + h);
  return 2 * (w + h - 4 * rx) + 2 * Math.PI * rx;
}

/** One bright spec + gap = full perimeter → seamless loop when offset moves by −P. */
function dashPatternForLoop(P: number) {
  const dot = Math.max(2.5, Math.min(P * 0.035, 9));
  return { dot, gap: Math.max(0.01, P - dot) };
}

function applyLinkOutlineGeometry(
  wrap: HTMLElement,
  svg: SVGSVGElement,
  track: SVGRectElement,
  glow: SVGRectElement,
) {
  const { width: w0, height: h0 } = wrap.getBoundingClientRect();
  const w = Math.max(1, Math.round(w0 * 100) / 100);
  const h = Math.max(1, Math.round(h0 * 100) / 100);
  const stroke = 1.05;
  const inset = stroke / 2 + 0.35;
  const rw = Math.max(0.5, w - inset * 2);
  const rh = Math.max(0.5, h - inset * 2);
  const rx = Math.min(5, rw / 2, rh / 2);
  svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
  svg.style.width = `${w}px`;
  svg.style.height = `${h}px`;
  for (const rect of [track, glow]) {
    rect.setAttribute("x", String(inset));
    rect.setAttribute("y", String(inset));
    rect.setAttribute("width", String(rw));
    rect.setAttribute("height", String(rh));
    rect.setAttribute("rx", String(rx));
  }
  const P = roundedRectPerimeter(rw, rh, rx);
  glow.dataset.perimeter = String(P);
}

/** Soft highlight that travels exactly one lap per loop — no “worm” segment. */
function NavbarLinkWater({
  href,
  children,
  className,
  onClick,
  anchorStyle,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  anchorStyle?: CSSProperties;
}) {
  const wrapRef = useRef<HTMLSpanElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const trackRef = useRef<SVGRectElement>(null);
  const glowRef = useRef<SVGRectElement>(null);
  const flowTweenRef = useRef<gsap.core.Tween | null>(null);
  const isHoveringRef = useRef(false);
  const gradId = `nav-water-${useId().replace(/:/g, "")}`;

  const applyGeometry = () => {
    const wrap = wrapRef.current;
    const svg = svgRef.current;
    const track = trackRef.current;
    const glow = glowRef.current;
    if (!wrap || !svg || !track || !glow) return;
    applyLinkOutlineGeometry(wrap, svg, track, glow);
  };

  const resetStrokeHidden = () => {
    const glow = glowRef.current;
    const track = trackRef.current;
    flowTweenRef.current?.kill();
    flowTweenRef.current = null;
    if (glow) gsap.killTweensOf(glow);
    if (track) gsap.killTweensOf(track);
    if (glow) gsap.set(glow, { opacity: 0, strokeDashoffset: 0 });
    if (track) gsap.set(track, { opacity: 0 });
  };

  const startFlowTween = () => {
    const glow = glowRef.current;
    const track = trackRef.current;
    if (!glow || !track) return;
    const P = Number(glow.dataset.perimeter) || 400;
    const { dot, gap } = dashPatternForLoop(P);
    flowTweenRef.current?.kill();
    gsap.killTweensOf([glow, track]);
    gsap.set(glow, {
      opacity: 0,
      strokeDasharray: `${dot} ${gap}`,
      strokeDashoffset: 0,
    });
    gsap.set(track, { opacity: 0 });
    gsap.to(glow, { opacity: 1, duration: 0.22, ease: "power1.out" });
    gsap.to(track, { opacity: 1, duration: 0.22, ease: "power1.out" });
    flowTweenRef.current = gsap.to(glow, {
      strokeDashoffset: -P,
      duration: 3.4,
      ease: "none",
      repeat: -1,
    });
  };

  useLayoutEffect(() => {
    applyGeometry();
    resetStrokeHidden();
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      applyGeometry();
      if (isHoveringRef.current) {
        startFlowTween();
      } else {
        resetStrokeHidden();
      }
    });
    ro.observe(el);
    window.addEventListener("resize", applyGeometry);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", applyGeometry);
      flowTweenRef.current?.kill();
    };
  }, []);

  const startFlow = () => {
    isHoveringRef.current = true;
    applyGeometry();
    startFlowTween();
  };

  const stopFlow = () => {
    isHoveringRef.current = false;
    flowTweenRef.current?.kill();
    flowTweenRef.current = null;
    const glow = glowRef.current;
    const track = trackRef.current;
    if (glow) gsap.killTweensOf(glow);
    if (track) gsap.killTweensOf(track);
    if (track) gsap.to(track, { opacity: 0, duration: 0.28, ease: "power2.out" });
    if (glow) gsap.to(glow, { opacity: 0, duration: 0.28, ease: "power2.out" });
  };

  return (
    <span
      ref={wrapRef}
      className="relative inline-block"
      onPointerEnter={startFlow}
      onPointerLeave={stopFlow}
    >
      <svg
        ref={svgRef}
        className="pointer-events-none absolute left-0 top-0 overflow-visible"
        aria-hidden
      >
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(220, 245, 255, 0.5)" />
            <stop offset="45%" stopColor="rgba(255, 255, 255, 0.95)" />
            <stop offset="100%" stopColor="rgba(185, 225, 255, 0.65)" />
          </linearGradient>
        </defs>
        <rect
          ref={trackRef}
          fill="none"
          stroke="rgba(255,255,255,0.14)"
          strokeWidth={1}
          strokeLinecap="round"
        />
        <rect
          ref={glowRef}
          fill="none"
          stroke={`url(#${gradId})`}
          strokeWidth={1.05}
          strokeLinecap="round"
          style={{ filter: "drop-shadow(0 0 2px rgba(200, 235, 255, 0.55))" }}
        />
      </svg>
      <a
        href={href}
        onClick={onClick}
        style={anchorStyle}
        className={cn("relative z-[1]", className)}
      >
        {children}
      </a>
    </span>
  );
}

type NavbarProps = {
  transparent?: boolean;
};

export function Navbar({ transparent = false }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 80);
      // hide when scrolling down past threshold, show when scrolling up
      if (y > 120) {
        setHidden(y > lastY.current);
      } else {
        setHidden(false);
      }
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isScrolled = transparent && scrolled;

  return (
    <nav
      className={[
        "fixed inset-x-0 top-0 z-50 text-white transition-all duration-500",
        isScrolled ? "py-3 backdrop-blur-xl" : "py-4",
        hidden ? "-translate-y-full" : "translate-y-0",
      ].join(" ")}
      style={{
        backgroundColor: isScrolled ? "rgba(18, 17, 14, 0.82)" : "transparent",
      }}
    >
      <Container className="flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center" style={{ gap: "10px" }}>
          <img src={logomarkSrc} alt="" width={29} height={23} />
          <img src={logotypeSrc} alt="Logoipsum" width={110} height={23} />
        </a>

        {/* Nav links */}
        <ul className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map(({ label, href }) => (
            <li key={label}>
              <NavbarLinkWater
                href={href}
                onClick={(e) => onInPageNavClick(e, href)}
                className="manrope-regular block text-sm leading-[1.5] tracking-[0.05em] uppercase opacity-70 transition-opacity hover:opacity-100"
              >
                {label}
              </NavbarLinkWater>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <NavbarLinkWater
          href="#reserve"
          onClick={(e) => onInPageNavClick(e, "#reserve")}
          className="manrope-regular inline-flex items-center rounded-lg px-4 py-2 text-[12px] leading-[1.5] tracking-[0.05em] uppercase transition-opacity hover:opacity-80 md:rounded-sm md:px-5 md:text-sm"
          anchorStyle={{
            backgroundColor: isScrolled ? "rgba(164, 151, 129, 0.15)" : "rgba(0, 0, 0, 0.15)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          Book Now
        </NavbarLinkWater>
      </Container>
    </nav>
  );
}
