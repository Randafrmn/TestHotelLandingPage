import ArrowSrc from "@/assets/icons/Arrow.svg";
import { cn } from "../ui/utils";

type CarouselArrowButtonProps = {
  direction: "prev" | "next";
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  /** Background color of the button. */
  bgColor?: string;
  /** Accessible label override. Defaults to "Previous slide" / "Next slide". */
  label?: string;
};

/**
 * Reusable carousel navigation arrow button.
 * Size: 40×40 px.
 * When disabled: small backdrop blur (4px).
 * When enabled:  large backdrop blur (16px).
 */
export function CarouselArrowButton({
  direction,
  onClick,
  disabled = false,
  className,
  bgColor = "var(--carousel-control-bg)",
  label,
}: CarouselArrowButtonProps) {
  const defaultLabel = direction === "prev" ? "Previous slide" : "Next slide";
  const blur = disabled ? "blur(4px)" : "blur(16px)";

  return (
    <button
      type="button"
      aria-label={label ?? defaultLabel}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "flex h-10 w-10 flex-shrink-0 items-center justify-center text-white transition-all duration-300",
        "disabled:cursor-default",
        className,
      )}
      style={{
        backgroundColor: bgColor,
        backdropFilter: blur,
        WebkitBackdropFilter: blur,
        opacity: disabled ? 0.45 : 1,
      }}
      onMouseEnter={(e) => {
        if (!disabled)
          (e.currentTarget as HTMLButtonElement).style.backgroundColor =
            "var(--carousel-control-bg-hover)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.backgroundColor = bgColor;
      }}
    >
      <img
        src={ArrowSrc}
        alt=""
        className="h-4 w-6"
        style={{
          filter: "brightness(0) invert(1) opacity(0.7)",
          ...(direction === "prev" && { transform: "rotate(180deg)" }),
        }}
      />
    </button>
  );
}
