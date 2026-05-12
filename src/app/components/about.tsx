import { useState, useRef } from "react";
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
  const [index, setIndex] = useState(1);
  const [animating, setAnimating] = useState(false);
  const dragStart = useRef<number | null>(null);
  const DRAG_THRESHOLD = 50; // px needed to trigger slide change

  // translateX so that SLIDES[index] aligns after the peek gap
  const offsetVw = -(index * SLIDE_W);
  const offsetPx = -(index * GAP_PX) + PEEK_PX + GAP_PX;

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
    <section className="overflow-hidden bg-white py-16">

      {/* ── Header row ── */}
      <Container className="mb-10">
        <div className="flex items-end justify-between gap-2">
          <div className="max-w-4xl">
            <p className="monroe-regular mb-3 text-[16px] text-[rgba(50, 50, 50, 1)]">
              — Our Heritage — 
            </p>
            <h2
              className="manrope-regular mb-4"
              style={{
                fontSize: "40px",
                fontWeight: 400,
                lineHeight: "140%",
                letterSpacing: "0%",
                color: "rgba(50, 50, 50, 1)",
              }}
            >
              Nature, Design, and Soul
            </h2>
            <p className="manrope-regular text-muted-foreground" style={{ fontSize: "16px"}}>
            Born from a passion for architecture and deep respect for the Alpine landscape, L’Aura is more than a hotel—it’s a private retreat where every window frames a masterpiece of nature.
            </p>
          </div>

          {/* Arrows */}
          <SliderNavButtons
            onPrev={() => go(-1)}
            onNext={() => go(1)}
            prevDisabled={index === 0}
            nextDisabled={index === SLIDES.length - 1}
            activeArrowFilter="brightness(0) invert(1)"
            inactiveArrowFilter="brightness(0) invert(1) brightness(0.596)"
          />
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
            gap: `${GAP_PX}px`,
            transform: `translateX(calc(${offsetVw}vw + ${offsetPx}px))`,
            transition: "transform 0.55s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
            willChange: "transform",
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          {SLIDES.map((img, i) => (
            <div
              key={i}
              className="h-[460px] flex-shrink-0 overflow-hidden"
              style={{ width: `${SLIDE_W}vw` }}
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

    </section>
  );
}
