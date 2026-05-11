import { useState, useEffect, useRef } from "react";
import { Container } from "./shared/Container";
import logomarkSrc from "@/assets/icons/logomark.svg";
import logotypeSrc from "@/assets/icons/logotype.svg";

const NAV_LINKS = [
  { label: "ROOMS", href: "#rooms" },
  { label: "AMENITIES", href: "#amenities" },
  { label: "RESERVE", href: "#reserve" },
] as const;

type NavbarProps = {
  transparent?: boolean;
};

export function Navbar({ transparent = false }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 80);
      // hide when scrolling down past threshold, show when scrolling up
      if (y > 120) {
        setHidden(y > lastY.current);
      } else {
        setHidden(false);
      }
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isScrolled = transparent && scrolled;

  return (
    <nav
      className={[
        "fixed inset-x-0 top-0 z-50 text-white transition-all duration-500",
        isScrolled ? "py-3 backdrop-blur-xl" : "py-4",
        hidden ? "-translate-y-full" : "translate-y-0",
      ].join(" ")}
      style={{
        backgroundColor: isScrolled ? "rgba(18, 17, 14, 0.82)" : "transparent",
      }}
    >
      <Container className="flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center" style={{ gap: "10px" }}>
          <img src={logomarkSrc} alt="" width={29} height={23} />
          <img src={logotypeSrc} alt="Logoipsum" width={110} height={23} />
        </a>

        {/* Nav links */}
        <ul className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map(({ label, href }) => (
            <li key={label}>
              <a
                href={href}
                className="manrope-regular text-sm leading-[1.5] tracking-[0.05em] uppercase opacity-70 transition-opacity hover:opacity-100"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <a
          href="#reserve"
          className="manrope-regular hidden items-center rounded-sm px-5 py-2 text-sm leading-[1.5] tracking-[0.05em] uppercase transition-opacity hover:opacity-80 md:flex"
          style={{
            backgroundColor: isScrolled
              ? "rgba(164, 151, 129, 0.15)"
              : "rgba(0, 0, 0, 0.15)",
          }}
        >
          Book Now
        </a>

        {/* Mobile hamburger */}
        <button
          type="button"
          aria-label="Open menu"
          className="flex flex-col gap-1.5 md:hidden"
        >
          <span className="block h-px w-6 bg-current" />
          <span className="block h-px w-6 bg-current" />
          <span className="block h-px w-4 bg-current" />
        </button>
      </Container>
    </nav>
  );
}
