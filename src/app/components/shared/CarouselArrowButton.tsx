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

  return (
    <button
      type="button"
      aria-label={label ?? defaultLabel}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "flex h-10 w-10 flex-shrink-0 items-center justify-center text-white transition-colors",
        "disabled:cursor-not-allowed disabled:opacity-40",
        className,
      )}
      style={{ backgroundColor: bgColor }}
      onMouseEnter={(e) => {
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
          filter: "brightness(0) invert(1)",
          ...(direction === "prev" && { transform: "rotate(180deg)" }),
        }}
      />
    </button>
  );
}
