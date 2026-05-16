import gsap from "gsap";

export type RadixPresenceVariant =
  | "fade"
  | "zoom"
  | "smooth"
  | "sheet-right"
  | "sheet-left"
  | "sheet-top"
  | "sheet-bottom";

const E_SOFT = "sine.inOut";
const E_SOFT_CLOSE = "sine.in";

/** Radix + Popper: tanpa transform scale/y pada zoom — hanya cahaya & kabut halus */
function presetClosed(el: HTMLElement, variant: RadixPresenceVariant) {
  switch (variant) {
    case "fade":
      gsap.set(el, { autoAlpha: 0, filter: "brightness(0.88)" });
      break;
    case "zoom":
      gsap.set(el, {
        autoAlpha: 0,
        filter: "blur(8px) brightness(0.94)",
      });
      break;
    case "smooth":
      gsap.set(el, {
        autoAlpha: 0,
        filter: "blur(16px) brightness(0.8)",
      });
      break;
    case "sheet-right":
      gsap.set(el, { xPercent: 100, autoAlpha: 1 });
      break;
    case "sheet-left":
      gsap.set(el, { xPercent: -100, autoAlpha: 1 });
      break;
    case "sheet-top":
      gsap.set(el, { yPercent: -100, autoAlpha: 1 });
      break;
    case "sheet-bottom":
      gsap.set(el, { yPercent: 100, autoAlpha: 1 });
      break;
    default:
      break;
  }
}

function animateOpen(el: HTMLElement, variant: RadixPresenceVariant) {
  gsap.killTweensOf(el);
  switch (variant) {
    case "fade":
      gsap.fromTo(
        el,
        { autoAlpha: 0, filter: "brightness(0.9)" },
        { autoAlpha: 1, filter: "brightness(1)", duration: 0.52, ease: E_SOFT },
      );
      break;
    case "zoom":
      gsap.fromTo(
        el,
        { autoAlpha: 0, filter: "blur(8px) brightness(0.94)" },
        { autoAlpha: 1, filter: "blur(0px) brightness(1)", duration: 0.58, ease: E_SOFT },
      );
      break;
    case "smooth":
      gsap.fromTo(
        el,
        { autoAlpha: 0, filter: "blur(16px) brightness(0.8)" },
        {
          autoAlpha: 1,
          filter: "blur(0px) brightness(1)",
          duration: 0.82,
          ease: "power3.out",
        },
      );
      break;
    case "sheet-right":
      gsap.fromTo(
        el,
        { xPercent: 100 },
        { xPercent: 0, duration: 0.64, ease: E_SOFT },
      );
      break;
    case "sheet-left":
      gsap.fromTo(
        el,
        { xPercent: -100 },
        { xPercent: 0, duration: 0.64, ease: E_SOFT },
      );
      break;
    case "sheet-top":
      gsap.fromTo(
        el,
        { yPercent: -100 },
        { yPercent: 0, duration: 0.64, ease: E_SOFT },
      );
      break;
    case "sheet-bottom":
      gsap.fromTo(
        el,
        { yPercent: 100 },
        { yPercent: 0, duration: 0.64, ease: E_SOFT },
      );
      break;
    default:
      break;
  }
}

function animateClosed(el: HTMLElement, variant: RadixPresenceVariant) {
  gsap.killTweensOf(el);
  switch (variant) {
    case "fade":
      gsap.to(el, {
        autoAlpha: 0,
        filter: "brightness(0.9)",
        duration: 0.42,
        ease: E_SOFT_CLOSE,
      });
      break;
    case "zoom":
      gsap.to(el, {
        autoAlpha: 0,
        filter: "blur(6px) brightness(0.95)",
        duration: 0.44,
        ease: E_SOFT_CLOSE,
      });
      break;
    case "smooth":
      gsap.to(el, {
        autoAlpha: 0,
        filter: "blur(12px) brightness(0.88)",
        duration: 0.52,
        ease: "power2.inOut",
      });
      break;
    case "sheet-right":
      gsap.to(el, { xPercent: 100, duration: 0.52, ease: E_SOFT_CLOSE });
      break;
    case "sheet-left":
      gsap.to(el, { xPercent: -100, duration: 0.52, ease: E_SOFT_CLOSE });
      break;
    case "sheet-top":
      gsap.to(el, { yPercent: -100, duration: 0.52, ease: E_SOFT_CLOSE });
      break;
    case "sheet-bottom":
      gsap.to(el, { yPercent: 100, duration: 0.52, ease: E_SOFT_CLOSE });
      break;
    default:
      break;
  }
}

export function bindGsapRadixPresence(el: HTMLElement, variant: RadixPresenceVariant): () => void {
  let prev = el.getAttribute("data-state");

  if (prev !== "open") {
    presetClosed(el, variant);
  }

  const sync = () => {
    const next = el.getAttribute("data-state");
    if (next === prev) return;
    prev = next;
    if (next === "open") {
      animateOpen(el, variant);
    } else {
      animateClosed(el, variant);
    }
  };

  const mo = new MutationObserver(sync);
  mo.observe(el, { attributes: true, attributeFilter: ["data-state"] });

  return () => {
    mo.disconnect();
    gsap.killTweensOf(el);
  };
}
