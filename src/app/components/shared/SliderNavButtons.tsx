import ArrowSrc from "@/assets/icons/Arrow.svg";

type SliderNavButtonsProps = {
  onPrev: () => void;
  onNext: () => void;
  /** Size of each button in px. Default: 48 */
  size?: number;
  /** Border radius in px. Default: 8 */
  radius?: number;
  /** Active button color. Default: #A49781 */
  activeColor?: string;
  /** Inactive button color. Default: #CCC5B9 */
  inactiveColor?: string;
  /** Functionally disable prev — blocks click + shows inactive color */
  prevDisabled?: boolean;
  /** Functionally disable next — blocks click + shows inactive color */
  nextDisabled?: boolean;
  /** Visual-only inactive for prev — shows inactive color but still clickable */
  prevInactive?: boolean;
  /** Visual-only inactive for next — shows inactive color but still clickable */
  nextInactive?: boolean;
  /** CSS filter for arrow when button is active. Default: none (natural dark) */
  activeArrowFilter?: string;
  /** CSS filter for arrow when button is inactive/disabled. Default: none (natural dark) */
  inactiveArrowFilter?: string;
  className?: string;
};

/**
 * Reusable prev/next arrow button pair for carousels and sliders.
 * prevDisabled / nextDisabled  → blocks click + inactive color
 * prevInactive / nextInactive  → inactive color only, still clickable
 * activeArrowFilter / inactiveArrowFilter → control arrow icon color per state
 */
export function SliderNavButtons({
  onPrev,
  onNext,
  size = 48,
  radius = 8,
  activeColor = "#A49781",
  inactiveColor = "#CCC5B9",
  prevDisabled = false,
  nextDisabled = false,
  prevInactive = false,
  nextInactive = false,
  activeArrowFilter,
  inactiveArrowFilter,
  className = "",
}: SliderNavButtonsProps) {
  const prevIsInactive = prevDisabled || prevInactive;
  const nextIsInactive = nextDisabled || nextInactive;

  const prevArrowFilter = prevIsInactive ? inactiveArrowFilter : activeArrowFilter;
  const nextArrowFilter = nextIsInactive ? inactiveArrowFilter : activeArrowFilter;

  return (
    <div className={`flex flex-shrink-0 items-center gap-2 ${className}`}>
      {/* Prev */}
      <button
        type="button"
        onClick={prevDisabled ? undefined : onPrev}
        aria-label="Previous"
        className="flex items-center justify-center overflow-hidden"
        style={{
          width: size,
          height: size,
          borderRadius: radius,
          backgroundColor: prevIsInactive ? inactiveColor : activeColor,
          cursor: prevDisabled ? "default" : "pointer",
          transition: "background-color 0.3s",
        }}
      >
        <img
          src={ArrowSrc}
          alt=""
          className="h-3 w-5"
          style={{
            transform: "rotate(180deg)",
            ...(prevArrowFilter ? { filter: prevArrowFilter } : {}),
            transition: "filter 0.3s",
          }}
        />
      </button>

      {/* Next */}
      <button
        type="button"
        onClick={nextDisabled ? undefined : onNext}
        aria-label="Next"
        className="flex items-center justify-center overflow-hidden"
        style={{
          width: size,
          height: size,
          borderRadius: radius,
          backgroundColor: nextIsInactive ? inactiveColor : activeColor,
          cursor: nextDisabled ? "default" : "pointer",
          transition: "background-color 0.3s",
        }}
      >
        <img
          src={ArrowSrc}
          alt=""
          className="h-3 w-5"
          style={{
            ...(nextArrowFilter ? { filter: nextArrowFilter } : {}),
            transition: "filter 0.3s",
          }}
        />
      </button>
    </div>
  );
}
