import {
  useRef,
  useCallback,
  useMemo,
  type ComponentPropsWithoutRef,
  type CSSProperties,
} from "react";
import gsap from "gsap";
import { cn } from "../ui/utils";

const FILL_MASK =
  "linear-gradient(135deg, #000 0%, #000 34%, rgba(0,0,0,0.92) 40%, rgba(0,0,0,0.62) 46%, rgba(0,0,0,0.28) 51%, rgba(0,0,0,0.08) 54.5%, rgba(0,0,0,0) 58%, transparent 100%)";

function motionJitterFromKey(key: string | number): number {
  if (typeof key === "number" && !Number.isNaN(key)) {
    return Math.abs(Math.floor(key)) % 1000;
  }
  const s = String(key);
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h % 1000;
}

export type GsapLiquidFillButtonProps = {
  children: React.ReactNode;
  /** Slight per-button variation in duration / delay (hashed). */
  motionKey?: string | number;
  /** Color of the animated liquid layer (sweep). */
  fillColor?: string;
  /** Solid button background always visible (e.g. brand #A49781 under the sweep). */
  baseBackgroundColor?: string;
  defaultTextColor?: string;
  hoverTextColor?: string;
} & Omit<ComponentPropsWithoutRef<"button">, "children">;

export function GsapLiquidFillButton({
  children,
  className,
  type = "button",
  disabled,
  motionKey = 0,
  fillColor = "#A49781",
  baseBackgroundColor,
  defaultTextColor = "rgba(50, 50, 50, 1)",
  hoverTextColor = "#ffffff",
  style,
  onPointerEnter,
  onPointerLeave,
  onFocus,
  onBlur,
  ...rest
}: GsapLiquidFillButtonProps) {
  const fillRef = useRef<HTMLSpanElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  const j = useMemo(() => motionJitterFromKey(motionKey), [motionKey]);
  const timing = useMemo(
    () => ({
      fillIn: 0.45 + (j % 5) * 0.012,
      fillOut: 0.38 + (j % 4) * 0.01,
      textIn: 0.28 + (j % 4) * 0.008,
      textOut: 0.26 + (j % 3) * 0.006,
      textDelay: 0,
    }),
    [j],
  );

  const mergedStyle = useMemo((): CSSProperties => {
    const base: CSSProperties = { ...style };
    if (baseBackgroundColor) {
      base.backgroundColor = baseBackgroundColor;
    }
    return base;
  }, [style, baseBackgroundColor]);

  const playIn = useCallback(() => {
    if (disabled) return;
    const fill = fillRef.current;
    const text = textRef.current;
    if (!fill || !text) return;
    gsap.killTweensOf([fill, text]);
    gsap.to(fill, {
      webkitMaskPosition: "0% 0%",
      maskPosition: "0% 0%",
      duration: timing.fillIn,
      ease: "power2.out",
    });
    gsap.to(text, {
      color: hoverTextColor,
      duration: timing.textIn,
      delay: timing.textDelay,
      ease: "power2.out",
    });
  }, [disabled, hoverTextColor, timing.fillIn, timing.textDelay, timing.textIn]);

  const playOut = useCallback(() => {
    if (disabled) return;
    const fill = fillRef.current;
    const text = textRef.current;
    if (!fill || !text) return;
    gsap.killTweensOf([fill, text]);
    gsap.to(fill, {
      webkitMaskPosition: "100% 100%",
      maskPosition: "100% 100%",
      duration: timing.fillOut,
      ease: "power2.inOut",
    });
    gsap.to(text, {
      color: defaultTextColor,
      duration: timing.textOut,
      ease: "sine.inOut",
    });
  }, [defaultTextColor, disabled, timing.fillOut, timing.textOut]);

  return (
    <button
      {...rest}
      type={type}
      disabled={disabled}
      className={cn("relative overflow-hidden", className)}
      style={mergedStyle}
      onPointerEnter={(e) => {
        onPointerEnter?.(e);
        playIn();
      }}
      onPointerLeave={(e) => {
        onPointerLeave?.(e);
        playOut();
      }}
      onFocus={(e) => {
        onFocus?.(e);
        playIn();
      }}
      onBlur={(e) => {
        onBlur?.(e);
        playOut();
      }}
    >
      <span
        ref={fillRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={
          {
            backgroundColor: fillColor,
            WebkitMaskImage: FILL_MASK,
            maskImage: FILL_MASK,
            WebkitMaskSize: "340% 340%",
            maskSize: "340% 340%",
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
            WebkitMaskPosition: "100% 100%",
            maskPosition: "100% 100%",
          } as CSSProperties
        }
      />
      <span
        ref={textRef}
        className="relative z-10"
        style={{ color: defaultTextColor }}
      >
        {children}
      </span>
    </button>
  );
}
