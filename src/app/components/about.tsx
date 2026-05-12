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
const SLIDE_W = 52;   // vw
const GAP_PX = 16;    // px gap between slides
const PEEK_PX = 52;   // px of previous slide visible on left

export function About() {
  const slidesWithClones = SLIDES;
  const [index, setIndex] = useState(1);
  const [animating, setAnimating] = useState(false);
  const [viewportW, setViewportW] = useState(390);
  const dragStart = useRef<number | null>(null);
  const DRAG_THRESHOLD = 50; // px needed to trigger slide change
  const isMobile = viewportW < 768;

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
  const offsetPx = -(index * gapPx) + peekPx + gapPx;

  const go = (dir: 1 | -1) => {
    if (animating) return;
    const next = index + dir;
    if (next < 0 || next >= SLIDES.length) return;
    setAnimating(true);
    setIndex(next);
  };

  const handleTransitionEnd = () => setAnimating(false);

  const handlePointerDown = (e: React.PointerEvent) => {
    dragStart.current = e.clientX;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (dragStart.current === null) return;
    const delta = e.clientX - dragStart.current;
    dragStart.current = null;
    if (Math.abs(delta) >= DRAG_THRESHOLD) {
      go(delta < 0 ? 1 : -1);
    }
  };

  return (
    <section className="overflow-hidden bg-white py-14 md:py-16">

      {/* ── Header row ── */}
      <Container className="mb-8 md:mb-10">
        <div className="flex flex-col items-center gap-6 md:flex-row md:items-end md:justify-between md:gap-2">
          <div className="max-w-4xl text-center md:text-left">
            <p className="monroe-regular mb-3 text-[14px] text-[rgba(50, 50, 50, 1)] md:text-[16px]">
              — Our Heritage — 
            </p>
            <h2
              className="manrope-regular mb-4 text-[24px] leading-[1.3] text-[rgba(50,50,50,1)] md:text-[40px] md:leading-[1.4]"
              style={{
                fontWeight: 400,
                letterSpacing: "0%",
              }}
            >
              Nature, Design, and Soul
            </h2>
            <p
              className="manrope-regular text-center text-muted-foreground md:text-left"
              style={{ fontSize: "16px", maxWidth: "720px", margin: isMobile ? "0 auto" : "0" }}
            >
            Born from a passion for architecture and deep respect for the Alpine landscape, L’Aura is more than a hotel—it’s a private retreat where every window frames a masterpiece of nature.
            </p>
          </div>

        </div>
      </Container>

      {/* ── Track ── */}
      <div
        className="overflow-hidden"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={() => { dragStart.current = null; }}
      >
        <div
          className="flex"
          style={{
            gap: `${gapPx}px`,
            transform: `translateX(calc(${offsetVw}vw + ${offsetPx}px))`,
            transition: "transform 0.55s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
            willChange: "transform",
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          {slidesWithClones.map((img, i) => (
            <div
              key={i}
              className="flex-shrink-0 overflow-hidden"
              style={{
                width: `${slideW}vw`,
                ...(isMobile
                  ? { aspectRatio: "1 / 1" as const }
                  : { height: "460px" }),
              }}
            >
              <img
                src={img.src}
                alt={img.alt}
                draggable={false}
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Arrows below carousel */}
      <Container className="mt-6 flex justify-center">
        <SliderNavButtons
          onPrev={() => go(-1)}
          onNext={() => go(1)}
          prevDisabled={index === 0}
          nextDisabled={false}
          prevInactive
          activeArrowFilter="brightness(0) invert(1)"
          inactiveArrowFilter="brightness(0) invert(1) brightness(0.596)"
        />
      </Container>

    </section>
  );
}
