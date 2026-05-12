import { useState, useRef, useEffect } from "react";
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

export function About() {
  const [index, setIndex] = useState(START_IDX);
  const [animating, setAnimating] = useState(false);
  const [noTransition, setNoTransition] = useState(false);
  const [viewportW, setViewportW] = useState(390);
  const indexRef = useRef(START_IDX);
  const trackRef = useRef<HTMLDivElement>(null);
  const swipeListenersCleanup = useRef<(() => void) | null>(null);
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

  useEffect(() => {
    return () => {
      swipeListenersCleanup.current?.();
      swipeListenersCleanup.current = null;
    };
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
    if (!e.isPrimary) return;
    const startX = e.clientX;
    const pointerId = e.pointerId;

    const finish = (ev: PointerEvent) => {
      if (ev.pointerId !== pointerId) return;
      window.removeEventListener("pointerup", finish);
      window.removeEventListener("pointercancel", finish);
      swipeListenersCleanup.current = null;
      if (ev.type !== "pointerup") return;
      const delta = ev.clientX - startX;
      if (Math.abs(delta) >= DRAG_THRESHOLD) {
        go(delta < 0 ? 1 : -1);
      }
    };

    swipeListenersCleanup.current?.();
    swipeListenersCleanup.current = () => {
      window.removeEventListener("pointerup", finish);
      window.removeEventListener("pointercancel", finish);
    };

    window.addEventListener("pointerup", finish, { passive: true });
    window.addEventListener("pointercancel", finish, { passive: true });
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
        className="touch-pan-x select-none overflow-hidden"
        onPointerDown={handlePointerDown}
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
            <div
              key={`${i}-${img.alt}`}
              role="img"
              aria-label={img.alt}
              className="flex-shrink-0 touch-pan-x overflow-hidden bg-[#ebe8e4] [backface-visibility:hidden] [transform:translateZ(0)]"
              style={{
                width: `${slideW}vw`,
                backgroundImage: `url(${img.src})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                WebkitTransform: "translateZ(0)",
                ...(isMobile
                  ? { aspectRatio: "1 / 1" as const }
                  : { height: "460px" }),
              }}
            />
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
