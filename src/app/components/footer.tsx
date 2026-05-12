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
  "manrope-regular mb-4 text-[14px] font-semibold leading-none tracking-normal text-[rgba(255,255,255,1)]";

const linkClass =
  "manrope-regular block text-[14px] font-normal leading-normal text-[rgba(255,255,255,1)] transition-opacity opacity-80 hover:opacity-100";

export function Footer() {
  return (
    <footer
      id="contact"
      className="w-full"
      style={{ backgroundColor: "rgba(50, 50, 50, 1)" }}
    >
      <Container className="px-6 py-12 md:py-14">
        {/* Top: four columns, top-aligned like reference */}
        <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2 lg:grid-cols-[3fr_0.9fr_0.9fr_2fr] lg:gap-x-12 lg:gap-y-10">
          {/* Brand + address — kolom pertama lebih lebar (memanjang) */}
          <div className="flex min-w-0 w-full flex-col lg:pr-4">
            <a href="#" className="mb-6 flex items-center gap-3" aria-label="Home">
              <img src={logomarkSrc} alt="" width={50} height={40} className="block shrink-0" />
              <img src={logotypeSrc} alt="Logoipsum" width={163} height={33} className="block h-[33px] w-auto max-w-full" />
            </a>
            <p
              className="manrope-regular mt-6 max-w-md text-[14px] leading-[1.55]"
              style={{ color: "rgba(255, 255, 255, 0.8)" }}
            >
              San Valentino,<br />
              South Tyrol, Italy.
            </p>
          </div>

          {/* Links */}
          <div>
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

          {/* Legals */}
          <div>
            <h3 className={headingClass}>Legals</h3>
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

          {/* Contact */}
          <div>
            <h3 className={headingClass}>Contact</h3>

            <div
              className="mb-3 flex w-full items-center gap-3 px-3 py-2.5"
              style={{
                border: "1px solid rgba(255, 255, 255, 0.22)",
                borderRadius: 8,
              }}
            >
              <img src={TelephoneSrc} alt="" width={18} height={18} style={iconLight} className="shrink-0" />
              <span className="manrope-regular min-w-0 flex-1 truncate text-[14px] text-[rgba(255,255,255,1)]">
                {PHONE}
              </span>
              <button
                type="button"
                aria-label="Copy phone number"
                className="shrink-0 rounded p-1 opacity-90 transition-opacity hover:opacity-100"
                onClick={() => copyToClipboard(PHONE, "Phone number")}
              >
                <img src={CopySrc} alt="" width={16} height={16} style={iconLight} />
              </button>
            </div>

            <div
              className="mb-5 flex w-full items-center gap-3 px-3 py-2.5"
              style={{
                border: "1px solid rgba(255, 255, 255, 0.22)",
                borderRadius: 8,
              }}
            >
              <img src={MailSrc} alt="" width={18} height={18} style={iconLight} className="shrink-0" />
              <span className="manrope-regular min-w-0 flex-1 truncate text-[14px] text-[rgba(255,255,255,1)]">
                {EMAIL}
              </span>
              <button
                type="button"
                aria-label="Copy email"
                className="shrink-0 rounded p-1 opacity-90 transition-opacity hover:opacity-100"
                onClick={() => copyToClipboard(EMAIL, "Email")}
              >
                <img src={CopySrc} alt="" width={16} height={16} style={iconLight} />
              </button>
            </div>

            <div className="flex w-full items-center gap-2.5">
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

        {/* Full-width rule + bottom row */}
        <div
          className="mt-10 border-t pt-6 sm:mt-12 sm:pt-8"
          style={{ borderColor: "rgba(255, 255, 255, 0.12)" }}
        >
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
            <p className="manrope-regular text-[16px] text-[rgba(255,255,255,1)] sm:order-1">
              © 2026 Hotel Ipsum
            </p>
            <div className="flex w-[164px] max-w-full flex-col items-end gap-1.5 sm:order-2 sm:ml-auto">
              <span className="manrope-regular w-full text-right text-[16px] leading-snug text-[rgba(255,255,255,1)]">
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
