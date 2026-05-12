import gsap from "gsap";

/** Easing lembut & “mahal” — tidak tajam seperti template default */
const E_LUXURY = "sine.inOut";
const E_LUXURY_OUT = "sine.in";

/**
 * Modal layar penuh (room detail, gallery): nuansa hotel mewah —
 * lambat, halus, backdrop memudar lembut, panel naik sedikit dengan
 * perspective sangat ringan + blur yang hilang seperti kabut.
 */
export function playAuraModalEnter(backdrop: HTMLElement, panel: HTMLElement) {
  gsap.killTweensOf([backdrop, panel]);

  gsap.set(backdrop, {
    autoAlpha: 0,
    scale: 1.012,
    filter: "brightness(0.82)",
  });

  gsap.set(panel, {
    autoAlpha: 0,
    y: 40,
    scale: 0.982,
    rotationX: 5,
    transformPerspective: 2400,
    transformOrigin: "50% 92%",
    filter: "blur(10px)",
  });

  const tl = gsap.timeline();
  tl.to(
    backdrop,
    {
      autoAlpha: 1,
      scale: 1,
      filter: "brightness(1)",
      duration: 0.68,
      ease: E_LUXURY,
    },
    0,
  );
  tl.to(
    panel,
    {
      autoAlpha: 1,
      y: 0,
      scale: 1,
      rotationX: 0,
      filter: "blur(0px)",
      duration: 0.88,
      ease: E_LUXURY,
    },
    0.14,
  );
}

export function playAuraModalExit(
  backdrop: HTMLElement,
  panel: HTMLElement,
  onComplete: () => void,
) {
  gsap.killTweensOf([backdrop, panel]);

  const tl = gsap.timeline({ onComplete });
  tl.to(
    panel,
    {
      autoAlpha: 0,
      y: -22,
      scale: 0.988,
      rotationX: -4,
      filter: "blur(8px)",
      duration: 0.56,
      ease: E_LUXURY_OUT,
    },
    0,
  );
  tl.to(
    backdrop,
    {
      autoAlpha: 0,
      scale: 1.008,
      filter: "brightness(0.88)",
      duration: 0.52,
      ease: E_LUXURY_OUT,
    },
    0.12,
  );
}
