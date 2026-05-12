import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SECTION_SEL = "[data-section-animate]";
const ITEM_SEL = "[data-reveal]";

type EntranceConfig = {
  fromY: number;
  duration: number;
  staggerEach: number;
  ease: string;
};

const DEFAULT_ENTRANCE: EntranceConfig = {
  fromY: 22,
  duration: 0.68,
  staggerEach: 0.065,
  ease: "power2.out",
};

/** Hero title + booking bar: slower, softer stagger. */
const SLOW_ENTRANCE: EntranceConfig = {
  fromY: 16,
  duration: 1.12,
  staggerEach: 0.14,
  ease: "power3.out",
};

const START = "top 86%";

function entranceForSection(section: HTMLElement): EntranceConfig {
  return section.dataset.entrancePace === "slow" ? SLOW_ENTRANCE : DEFAULT_ENTRANCE;
}

function isSectionInView(el: HTMLElement) {
  const r = el.getBoundingClientRect();
  const vh = window.innerHeight;
  return r.top < vh * 0.9 && r.bottom > vh * 0.1;
}

function revealItems(items: gsap.utils.ArrayLike, cfg: EntranceConfig) {
  gsap.to(items, {
    opacity: 1,
    y: 0,
    duration: cfg.duration,
    stagger: { each: cfg.staggerEach, from: "start" },
    ease: cfg.ease,
    overwrite: "auto",
  });
}

/**
 * Per-section scroll entrance: minimal fade + slight rise.
 * Sections mark root with `data-section-animate`; children to animate use `data-reveal`.
 * Optional `data-entrance-pace="slow"` on the section root for longer, softer timing (hero).
 */
export function useSectionEntranceAnimations() {
  useLayoutEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const sections = gsap.utils.toArray<HTMLElement>(SECTION_SEL);

    const ctx = gsap.context(() => {
      for (const section of sections) {
        const items = section.querySelectorAll<HTMLElement>(ITEM_SEL);
        if (!items.length) continue;

        const cfg = entranceForSection(section);

        if (reduced) {
          gsap.set(items, { opacity: 1, y: 0 });
          continue;
        }

        if (isSectionInView(section)) {
          gsap.fromTo(
            items,
            { opacity: 0, y: cfg.fromY },
            {
              opacity: 1,
              y: 0,
              duration: cfg.duration,
              stagger: { each: cfg.staggerEach, from: "start" },
              ease: cfg.ease,
              overwrite: "auto",
            },
          );
          continue;
        }

        gsap.set(items, { opacity: 0, y: cfg.fromY });
        ScrollTrigger.create({
          trigger: section,
          start: START,
          once: true,
          onEnter: () => revealItems(items, cfg),
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
