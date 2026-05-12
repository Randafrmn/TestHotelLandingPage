import { Container } from "./shared/Container";
import { toast } from "sonner";
import logomarkSrc from "@/assets/icons/logomark.svg";
import logotypeSrc from "@/assets/icons/logotype.svg";
import TelephoneSrc from "@/assets/icons/Telephone.svg";
import MailSrc from "@/assets/icons/Mail.svg";
import CopySrc from "@/assets/icons/Copy.svg";
import YoutubeSrc from "@/assets/icons/youtuber.svg";
import WhatsappSrc from "@/assets/icons/whatsapp.svg";
import InstagramSrc from "@/assets/icons/instagram.svg";
import FacebookSrc from "@/assets/icons/facebook.svg";
import AlpinLogoSrc from "@/assets/icons/Logo.svg";

const PHONE = "+43 123456789";
const EMAIL = "info@hotel.com";

const iconLight = { filter: "brightness(0) invert(1)" } as const;

function copyToClipboard(text: string, label: string) {
  void navigator.clipboard.writeText(text).then(
    () => toast.success(`${label} copied`),
    () => toast.error("Could not copy"),
  );
}

const headingClass =
  "manrope-regular mb-3 text-left text-[14px] font-semibold leading-none tracking-normal text-[rgba(255,255,255,1)] lg:mb-4";

const linkClass =
  "manrope-regular block text-left text-[14px] font-normal leading-normal text-[rgba(255,255,255,1)] transition-opacity opacity-80 hover:opacity-100";

const contactRow =
  "flex w-full items-center gap-3 px-3 py-2.5";

const contactBoxStyle = {
  border: "1px solid rgba(255, 255, 255, 0.22)",
  borderRadius: 8,
  backgroundColor: "rgba(255, 255, 255, 0.04)",
} as const;

export function Footer() {
  return (
    <footer
      id="contact"
      className="w-full"
      style={{ backgroundColor: "rgba(50, 50, 50, 1)" }}
    >
      <Container className="px-6 py-12 md:py-14">
        {/*
          Mobile: [ brand full width, centered ]
                  [ Links | Legal ] 2 cols
                  [ Contact full ]
          Desktop (lg): 4 columns — brand | Links | Legal | Contact
        */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 lg:grid-cols-[minmax(0,3fr)_minmax(0,0.9fr)_minmax(0,0.9fr)_minmax(0,2fr)] lg:gap-x-12 lg:gap-y-10">
          {/* Brand + address — centered on mobile, left on desktop */}
          <div className="col-span-2 flex flex-col items-center text-center lg:col-span-1 lg:items-start lg:pr-4 lg:text-left">
            <a href="#" className="flex items-center justify-center gap-3 lg:justify-start" aria-label="Home">
              <img src={logomarkSrc} alt="" width={50} height={40} className="block shrink-0" />
              <img src={logotypeSrc} alt="Logoipsum" width={163} height={33} className="block h-[33px] w-auto max-w-full" />
            </a>
            <p
              className="manrope-regular mt-4 max-w-md text-[14px] leading-[1.55] lg:mt-6"
              style={{ color: "rgba(255, 255, 255, 0.8)" }}
            >
              San Valentino,
              <br />
              South Tyrol, Italy.
            </p>
          </div>

          {/* Links */}
          <div className="min-w-0">
            <h3 className={headingClass}>Links</h3>
            <nav className="flex flex-col gap-[14px]">
              <a href="#" className={linkClass}>
                Home
              </a>
              <a href="#rooms" className={linkClass}>
                Rooms
              </a>
              <a href="#amenities" className={linkClass}>
                Amenities
              </a>
              <a href="#visual-memories" className={linkClass}>
                Gallery
              </a>
            </nav>
          </div>

          {/* Legal (label per mockup) */}
          <div className="min-w-0">
            <h3 className={headingClass}>Legal</h3>
            <nav className="flex flex-col gap-[14px]">
              <a href="#" className={linkClass}>
                Imprint
              </a>
              <a href="#" className={linkClass}>
                Data Protection
              </a>
              <a href="#" className={linkClass}>
                Privacy Settings
              </a>
              <a href="#" className={linkClass}>
                Sitemap
              </a>
            </nav>
          </div>

          {/* Contact + social — full width row on mobile */}
          <div className="col-span-2 min-w-0 lg:col-span-1">
            <h3 className={headingClass}>Contact</h3>

            <div className={`${contactRow} mb-3`} style={contactBoxStyle}>
              <img src={TelephoneSrc} alt="" width={18} height={18} style={iconLight} className="shrink-0" />
              <span className="manrope-regular min-w-0 flex-1 truncate text-[14px] text-[rgba(255,255,255,1)]">
                {PHONE}
              </span>
              <button
                type="button"
                aria-label="Copy phone number"
                className="shrink-0 rounded p-1 opacity-50 transition-opacity hover:opacity-90"
                onClick={() => copyToClipboard(PHONE, "Phone number")}
              >
                <img src={CopySrc} alt="" width={16} height={16} style={iconLight} />
              </button>
            </div>

            <div className={`${contactRow} mb-5`} style={contactBoxStyle}>
              <img src={MailSrc} alt="" width={18} height={18} style={iconLight} className="shrink-0" />
              <span className="manrope-regular min-w-0 flex-1 truncate text-[14px] text-[rgba(255,255,255,1)]">
                {EMAIL}
              </span>
              <button
                type="button"
                aria-label="Copy email"
                className="shrink-0 rounded p-1 opacity-50 transition-opacity hover:opacity-90"
                onClick={() => copyToClipboard(EMAIL, "Email")}
              >
                <img src={CopySrc} alt="" width={16} height={16} style={iconLight} />
              </button>
            </div>

            <div className="flex w-full flex-wrap items-center gap-2.5">
              {[
                { src: YoutubeSrc, label: "YouTube", href: "#" },
                { src: WhatsappSrc, label: "WhatsApp", href: "#" },
                { src: InstagramSrc, label: "Instagram", href: "#" },
                { src: FacebookSrc, label: "Facebook", href: "#" },
              ].map(({ src, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-[8px] transition-opacity hover:opacity-85"
                  style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                >
                  <img src={src} alt="" width={32} height={32} className="size-8 object-contain" style={iconLight} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom: divider + copyright + attribution (left stack on mobile) */}
        <div
          className="mt-10 border-t pt-6 sm:mt-12 sm:pt-8"
          style={{ borderColor: "rgba(255, 255, 255, 0.15)" }}
        >
          <div className="flex flex-col items-start gap-4 lg:flex-row lg:items-start lg:justify-between lg:gap-6">
            <p className="manrope-regular text-[14px] text-[rgba(255,255,255,0.9)] lg:text-[16px]">
              © 2026 Hotel Ipsum
            </p>
            <div className="flex flex-col items-start gap-2 lg:items-end">
              <span className="manrope-regular text-left text-[14px] leading-snug text-[rgba(255,255,255,0.9)] lg:text-right lg:text-[16px]">
                Design and Code by
              </span>
              <img
                src={AlpinLogoSrc}
                alt="Alpin Ads"
                className="block h-[22px] w-auto shrink-0 sm:h-[26px]"
              />
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
