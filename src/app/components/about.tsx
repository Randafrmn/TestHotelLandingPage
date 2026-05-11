import { useState } from "react";
import { Container } from "./shared/Container";
import AboutImage1 from "@/assets/images/HeroImage1.svg";
import AboutImage2 from "@/assets/images/HeroImage2.svg";
import AboutImage3 from "@/assets/images/About2.svg";
import { SliderNavButtons } from "./shared/SliderNavButtons";

const BASE = [
  { src: AboutImage1, alt: "Heritage image 1" },
  { src: AboutImage2, alt: "Heritage image 2" },
  { src: AboutImage3, alt: "Heritage image 3" },
];

// Pad with clones on both ends for seamless loop: [last, ...all, first]
const SLIDES = [BASE[BASE.length - 1], ...BASE, BASE[0]];
const SLIDE_W = 52;   // vw
const GAP_PX = 16;    // px gap between slides
const PEEK_PX = 52;   // px of previous slide visible on left

export function About() {
  // realIndex: 0-based index into BASE
  const [realIndex, setRealIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [transition, setTransition] = useState(true);

  // SLIDES[0] = clone of last, SLIDES[1..3] = real, SLIDES[4] = clone of first
  // So the SLIDES index for realIndex is realIndex + 1
  const slidesIndex = realIndex + 1;

  // translateX so that SLIDES[slidesIndex] aligns after the peek gap:
  // offset = -( slidesIndex * (SLIDE_W vw + GAP_PX) ) + PEEK_PX + GAP_PX
  const offsetVw = -(slidesIndex * SLIDE_W);
  const offsetPx = -(slidesIndex * GAP_PX) + PEEK_PX + GAP_PX;

  const go = (dir: 1 | -1) => {
    if (animating) return;
    setAnimating(true);
    setTransition(true);
    setRealIndex((prev) => (prev + dir + BASE.length) % BASE.length);
  };

  const handleTransitionEnd = () => {
    setAnimating(false);
    // If we've landed on a clone, instantly jump to the real slide (no transition)
    // For this simple implementation, clones are only used for visual continuity;
    // the realIndex already wraps via modulo so no jump is needed.
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
          <SliderNavButtons onPrev={() => go(-1)} onNext={() => go(1)} />
        </div>
      </Container>

      {/* ── Track ── */}
      <div className="overflow-hidden">
        <div
          className="flex"
          style={{
            gap: `${GAP_PX}px`,
            transform: `translateX(calc(${offsetVw}vw + ${offsetPx}px))`,
            transition: transition ? "transform 0.55s cubic-bezier(0.25, 0.46, 0.45, 0.94)" : "none",
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
