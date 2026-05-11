import ArrowSrc from "@/assets/icons/Arrow.svg";

type SliderNavButtonsProps = {
  onPrev: () => void;
  onNext: () => void;
  /** Size of each button in px. Default: 48 */
  size?: number;
  /** Border radius in px. Default: 8 */
  radius?: number;
  /** Active button color. Default: rgba(164,151,129,1) */
  activeColor?: string;
  /** Inactive button color. Default: rgba(164,151,129,0.5) */
  inactiveColor?: string;
  className?: string;
};

/**
 * Reusable prev/next arrow button pair for carousels and sliders.
 * Prev = inactive style, Next = active style.
 * On hover the arrow nudges in its direction.
 */
export function SliderNavButtons({
  onPrev,
  onNext,
  size = 48,
  radius = 8,
  activeColor = "rgba(164, 151, 129, 1)",
  inactiveColor = "rgba(164, 151, 129, 0.5)",
  className = "",
}: SliderNavButtonsProps) {
  return (
    <div className={`flex flex-shrink-0 items-center gap-2 ${className}`}>
      {/* Prev */}
      <button
        type="button"
        onClick={onPrev}
        aria-label="Previous"
        className="group flex items-center justify-center overflow-hidden"
        style={{ width: size, height: size, borderRadius: radius, backgroundColor: inactiveColor }}
      >
        <div className="transition-transform duration-300 group-hover:-translate-x-1">
          <img
            src={ArrowSrc}
            alt=""
            className="h-3 w-5"
            style={{ transform: "rotate(180deg)", filter: "brightness(0) opacity(0.8)" }}
          />
        </div>
      </button>

      {/* Next */}
      <button
        type="button"
        onClick={onNext}
        aria-label="Next"
        className="group flex items-center justify-center overflow-hidden"
        style={{ width: size, height: size, borderRadius: radius, backgroundColor: activeColor }}
      >
        <div className="transition-transform duration-300 group-hover:translate-x-1">
          <img
            src={ArrowSrc}
            alt=""
            className="h-3 w-5"
            style={{ filter: "brightness(0) invert(1)" }}
          />
        </div>
      </button>
    </div>
  );
}
