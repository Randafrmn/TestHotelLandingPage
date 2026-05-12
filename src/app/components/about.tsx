import { useState, useRef, useEffect, useLayoutEffect } from "react";
import gsap from "gsap";
import { Container } from "./shared/Container";
import AboutImage1 from "@/assets/images/HeroImage1.svg";
import AboutImage2 from "@/assets/images/HeroImage2.svg";
import AboutImage3 from "@/assets/images/About2.svg";
import { SliderNavButtons } from "./shared/SliderNavButtons";

const SLIDES = [
  { src: AboutImage1, alt: "Heritage image 1" },
  { src: AboutImage2, alt: "Heritage image 2" },
  { src: AboutImage3, alt: "Heritage image 3" },
];

const N = SLIDES.length;

/**
 * Triple strip: [ …slides | …slides | …slides ]
 * Start in the middle copy; at edges we jump one full cycle with transition off.
 * Same visual position as the old 2-clone trick, but no “wrong” frame at the wrap.
 */
const slidesTriple = [...SLIDES, ...SLIDES, ...SLIDES] as typeof SLIDES;
const START_IDX = N;
/** After animating to this index (start of 3rd copy), snap back to middle copy. */
const JUMP_LEFT_FROM = 2 * N;
/** After animating to this index (end of 1st copy), snap to end of middle copy. */
const JUMP_RIGHT_FROM = N - 1;
const JUMP_RIGHT_TO = 2 * N - 1;

const SLIDE_W = 52;   // vw
const GAP_PX = 16;    // px gap between slides
const PEEK_PX = 52;   // px of previous slide visible on left

/** Same-origin slide URLs — warm as early as possible (HTTP cache + decode). */
const SLIDE_SRC_LIST = SLIDES.map((s) => s.src);

function warmSlideBitmaps(urls: readonly string[]) {
  if (typeof window === "undefined") return;
  for (const src of new Set(urls)) {
    const im = new window.Image();
    im.src = src;
    void im.decode?.().catch(() => {});
  }
}

warmSlideBitmaps(SLIDE_SRC_LIST);

/** Warm browser image cache + decode so slides never flash white between snaps. */
function preloadSlideImages(urls: readonly string[]) {
  const unique = [...new Set(urls)];
  return Promise.all(
    unique.map(
      (src) =>
        new Promise<void>((resolve) => {
          const im = new Image();
          im.onload = () => {
            im.decode?.().then(resolve).catch(() => resolve());
          };
          im.onerror = () => resolve();
          im.src = src;
        }),
    ),
  );
}

type SlideDef = (typeof SLIDES)[number];

/** Carousel slide: subtle “liquid” pan on move + ripple on press (GSAP). */
function AboutSlideCell({
  img,
  slideW,
  isMobile,
}: {
  img: SlideDef;
  slideW: number;
  isMobile: boolean;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const rippleHostRef = useRef<HTMLDivElement>(null);
  const xToRef = useRef<((v: string) => void) | null>(null);
  const yToRef = useRef<((v: string) => void) | null>(null);
  const lastRippleMs = useRef(0);

  useLayoutEffect(() => {
    const bg = bgRef.current;
    if (!bg) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    xToRef.current = gsap.quickTo(bg, "backgroundPositionX", { duration: 0.72, ease: "power3.out" }) as unknown as (
      v: string,
    ) => void;
    yToRef.current = gsap.quickTo(bg, "backgroundPositionY", { duration: 0.72, ease: "power3.out" }) as unknown as (
      v: string,
    ) => void;
    return () => {
      xToRef.current = null;
      yToRef.current = null;
    };
  }, []);

  useEffect(() => {
    return () => {
      const layer = rippleHostRef.current;
      if (!layer) return;
      layer.querySelectorAll(":scope > div").forEach((el) => {
        gsap.killTweensOf(el);
        el.remove();
      });
    };
  }, []);

  const spawnRipple = (clientX: number, clientY: number) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const layer = rippleHostRef.current;
    if (!layer) return;
    const now = performance.now();
    if (now - lastRippleMs.current < 160) return;
    lastRippleMs.current = now;
    const b = layer.getBoundingClientRect();
    const x = clientX - b.left;
    const y = clientY - b.top;
    const ring = document.createElement("div");
    ring.className = "pointer-events-none absolute rounded-full";
    ring.setAttribute("aria-hidden", "true");
    ring.style.left = `${x}px`;
    ring.style.top = `${y}px`;
    ring.style.width = "28px";
    ring.style.height = "28px";
    ring.style.border = "1.5px solid rgba(255,255,255,0.55)";
    ring.style.boxShadow =
      "0 0 20px rgba(200, 235, 255, 0.4), inset 0 0 12px rgba(255,255,255,0.12)";
    ring.style.mixBlendMode = "soft-light";
    layer.appendChild(ring);
    gsap.set(ring, { xPercent: -50, yPercent: -50, scale: 0.25, opacity: 0.72 });
    gsap.to(ring, {
      scale: 3.8,
      opacity: 0,
      duration: 1.05,
      ease: "power2.out",
      onComplete: () => ring.remove(),
    });
  };

  const onPointerMoveFluid = (e: React.PointerEvent) => {
    const wrap = wrapRef.current;
    const xTo = xToRef.current;
    const yTo = yToRef.current;
    if (!wrap || !xTo || !yTo) return;
    const r = wrap.getBoundingClientRect();
    const px = ((e.clientX - r.left) / Math.max(1, r.width)) * 100;
    const py = ((e.clientY - r.top) / Math.max(1, r.height)) * 100;
    xTo(`${px}%`);
    yTo(`${py}%`);
  };

  const onPointerLeaveFluid = () => {
    xToRef.current?.("50%");
    yToRef.current?.("50%");
  };

  return (
    <div
      ref={wrapRef}
      className="relative flex-shrink-0 overflow-hidden bg-[#ebe8e4] [backface-visibility:hidden] [transform:translateZ(0)]"
      style={{
        width: `${slideW}vw`,
        WebkitTransform: "translateZ(0)",
        ...(isMobile ? { aspectRatio: "1 / 1" as const } : { height: "460px" }),
      }}
    >
      <div
        ref={bgRef}
        role="img"
        aria-label={img.alt}
        className="pointer-events-none absolute inset-0 [backface-visibility:hidden]"
        style={{
          backgroundImage: `url(${img.src})`,
          backgroundSize: "118% 118%",
          backgroundPosition: "50% 50%",
          backgroundRepeat: "no-repeat",
        }}
      />
      <div
        ref={rippleHostRef}
        className="absolute inset-0 z-[1] touch-pan-x"
        onPointerMove={onPointerMoveFluid}
        onPointerLeave={onPointerLeaveFluid}
        onPointerDown={(e) => spawnRipple(e.clientX, e.clientY)}
        aria-hidden
      />
    </div>
  );
}

export function About() {
  const [index, setIndex] = useState(START_IDX);
  const [animating, setAnimating] = useState(false);
  const [noTransition, setNoTransition] = useState(false);
  const [viewportW, setViewportW] = useState(390);
  const dragStart = useRef<number | null>(null);
  const indexRef = useRef(START_IDX);
  const trackRef = useRef<HTMLDivElement>(null);
  const DRAG_THRESHOLD = 50; // px needed to trigger slide change
  const isMobile = viewportW < 768;

  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  useEffect(() => {
    const urls = SLIDES.map((s) => s.src);
    void preloadSlideImages(urls);
    const links: HTMLLinkElement[] = [];
    for (const src of new Set(urls)) {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = src;
      document.head.appendChild(link);
      links.push(link);
    }
    return () => {
      links.forEach((l) => l.remove());
    };
  }, []);

  useEffect(() => {
    const update = () => setViewportW(window.innerWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const slideW = isMobile ? 84 : SLIDE_W;
  const gapPx = isMobile ? 8 : GAP_PX;
  const peekPx = isMobile
    ? Math.max((viewportW * ((100 - slideW) / 100)) / 2, 0)
    : PEEK_PX;

  // translateX so that current slide aligns after the peek gap
  const offsetVw = -(index * slideW);
  const offsetPx = -(index * gapPx) + peekPx;

  const go = (dir: 1 | -1) => {
    if (animating) return;
    setAnimating(true);
    setNoTransition(false);
    setIndex((i) => i + dir);
  };

  const handleTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    if (e.propertyName !== "transform") return;
    if (trackRef.current && e.target !== trackRef.current) return;
    setAnimating(false);
    const i = indexRef.current;
    if (i === JUMP_LEFT_FROM) {
      setNoTransition(true);
      setIndex(START_IDX);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setNoTransition(false));
      });
      return;
    }
    if (i === JUMP_RIGHT_FROM) {
      setNoTransition(true);
      setIndex(JUMP_RIGHT_TO);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setNoTransition(false));
      });
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    dragStart.current = e.clientX;
    const el = e.currentTarget as HTMLElement;
    el.setPointerCapture(e.pointerId);
  };

  const releaseCapture = (e: React.PointerEvent) => {
    const el = e.currentTarget as HTMLElement;
    try {
      if (el.hasPointerCapture?.(e.pointerId)) el.releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    releaseCapture(e);
    if (dragStart.current === null) return;
    const delta = e.clientX - dragStart.current;
    dragStart.current = null;
    if (Math.abs(delta) >= DRAG_THRESHOLD) {
      go(delta < 0 ? 1 : -1);
    }
  };

  return (
    <section data-section-animate className="overflow-hidden bg-white py-14 md:py-16">

      {/* ── Header row ── */}
      <Container className="mb-8 md:mb-10">
        <div className="flex flex-col items-center gap-6 md:flex-row md:items-end md:justify-between md:gap-2">
          <div className="text-center md:text-left">
            <p data-reveal className="monroe-regular mb-3 text-[14px] text-[rgba(50, 50, 50, 1)] md:text-[16px]">
              — Our Heritage — 
            </p>
            <h2
              data-reveal
              className="manrope-regular mb-4 text-[24px] leading-[1.3] text-[rgba(50,50,50,1)] md:text-[40px] md:leading-[1.4]"
              style={{
                fontWeight: 400,
                letterSpacing: "0%",
              }}
            >
              Nature, Design, and Soul
            </h2>
            <p
              data-reveal
              className="manrope-regular text-center text-muted-foreground md:text-left pr-0 md:pr-6"
              style={{ fontSize: "16px", margin: isMobile ? "0 auto" : "0" }}
            >
            Born from a passion for architecture and deep respect for the Alpine landscape, L’Aura is more than a hotel—it’s a private retreat where every window frames a masterpiece of nature.
            </p>
          </div>

          {/* Arrows (desktop/tablet) */}
          <div className="hidden md:flex">
            <SliderNavButtons
              onPrev={() => go(-1)}
              onNext={() => go(1)}
              prevDisabled={false}
              nextDisabled={false}
              activeArrowFilter="brightness(0) invert(1)"
              inactiveArrowFilter="brightness(0) invert(1) brightness(0.596)"
            />
          </div>

        </div>
      </Container>

      {/* ── Track ── */}
      <div
        className="overflow-hidden"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={(e) => {
          releaseCapture(e);
          dragStart.current = null;
        }}
      >
        <div
          ref={trackRef}
          className="flex touch-pan-x isolate [transform:translate3d(0,0,0)]"
          style={{
            gap: `${gapPx}px`,
            transform: `translate3d(calc(${offsetVw}vw + ${offsetPx}px), 0, 0)`,
            transition: noTransition
              ? "none"
              : "transform 0.55s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
            willChange: "transform",
            WebkitBackfaceVisibility: "hidden",
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          {slidesTriple.map((img, i) => (
            <AboutSlideCell key={`${i}-${img.alt}`} img={img} slideW={slideW} isMobile={isMobile} />
          ))}
        </div>
      </div>

      {/* Arrows below carousel (mobile only) */}
      <Container className="mt-6 flex justify-center md:hidden">
        <SliderNavButtons
          onPrev={() => go(-1)}
          onNext={() => go(1)}
          prevDisabled={false}
          nextDisabled={false}
          activeArrowFilter="brightness(0) invert(1)"
          inactiveArrowFilter="brightness(0) invert(1) brightness(0.596)"
        />
      </Container>

    </section>
  );
}
