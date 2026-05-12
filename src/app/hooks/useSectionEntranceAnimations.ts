import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SECTION_SEL = "[data-section-animate]";
const ITEM_SEL = "[data-reveal]";

const FROM_Y = 22;
const DURATION = 0.68;
const STAGGER = 0.065;
const EASE = "power2.out";
const START = "top 86%";

function isSectionInView(el: HTMLElement) {
  const r = el.getBoundingClientRect();
  const vh = window.innerHeight;
  return r.top < vh * 0.9 && r.bottom > vh * 0.1;
}

function revealItems(items: gsap.utils.ArrayLike) {
  gsap.to(items, {
    opacity: 1,
    y: 0,
    duration: DURATION,
    stagger: { each: STAGGER, from: "start" },
    ease: EASE,
    overwrite: "auto",
  });
}

/**
 * Per-section scroll entrance: minimal fade + slight rise.
 * Sections mark root with `data-section-animate`; children to animate use `data-reveal`.
 */
export function useSectionEntranceAnimations() {
  useLayoutEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const sections = gsap.utils.toArray<HTMLElement>(SECTION_SEL);

    const ctx = gsap.context(() => {
      for (const section of sections) {
        const items = section.querySelectorAll<HTMLElement>(ITEM_SEL);
        if (!items.length) continue;

        if (reduced) {
          gsap.set(items, { opacity: 1, y: 0 });
          continue;
        }

        if (isSectionInView(section)) {
          gsap.fromTo(
            items,
            { opacity: 0, y: FROM_Y },
            {
              opacity: 1,
              y: 0,
              duration: DURATION,
              stagger: { each: STAGGER, from: "start" },
              ease: EASE,
              overwrite: "auto",
            },
          );
          continue;
        }

        gsap.set(items, { opacity: 0, y: FROM_Y });
        ScrollTrigger.create({
          trigger: section,
          start: START,
          once: true,
          onEnter: () => revealItems(items),
        });
      }
    });

    const onResize = () => {
      ScrollTrigger.refresh();
    };
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      window.removeEventListener("resize", onResize);
      ctx.revert();
    };
  }, []);
}
