import { Container } from "./shared/Container";
import Amenities1Src from "@/assets/icons/Amenities1.svg";
import Amenities2Src from "@/assets/icons/Amenities2.svg";
import Amenities3Src from "@/assets/icons/Amenities3.svg";
import Amenities4Src from "@/assets/icons/Amenities4.svg";
import Amenities5Src from "@/assets/icons/Amenities5.svg";
import Amenities6Src from "@/assets/icons/Amenities6.svg";

/* ─── Data ─────────────────────────────────────────────────────── */

const ITEMS = [
  {
    icon: Amenities1Src,
    title: "Sky Infinity Pool",
    desc: "Experience the sensation of swimming in our 25-meter heated pool that appears to float directly into the rugged Dolomite peaks.",
  },
  {
    icon: Amenities2Src,
    title: "Forest-to-Table Dining",
    desc: "Indulge in 5-course gourmet dinners featuring organic ingredients sourced daily from our own gardens and local Alpine farmers.",
  },
  {
    icon: Amenities3Src,
    title: "Vitalis Panoramic Spa",
    desc: "Recharge in our panoramic saunas and enjoy authentic herbal treatments inspired by ancient Alpine healing traditions.",
  },
  {
    icon: Amenities4Src,
    title: "Ski-In / Ski-Out Access",
    desc: "Enjoy seamless access to the Dolomiti Superski slopes directly from the hotel's ski room—no shuttles, no waiting.",
  },
  {
    icon: Amenities5Src,
    title: "E-Bike & Hiking Hub",
    desc: "Explore the mountains with ease using our premium fleet of e-bikes and professional hiking gear available exclusively for guests.",
  },
  {
    icon: Amenities6Src,
    title: "Mindful Yoga Studio",
    desc: "Find your inner peace in our glass-walled studio overlooking the pine forest, offering daily guided meditation and yoga sessions.",
  },
];

/* ─── Component ─────────────────────────────────────────────────── */

export function Amenities() {
  return (
    <section id="amenities" className="bg-white py-20">
      <Container>

        {/* ── Header ── */}
        <div className="mb-12 text-center">
          <p className="monroe-regular mb-3 text-[16px] text-[rgba(50,50,50,1)]">
            — Amenities —
          </p>
          <h2
            className="manrope-regular"
            style={{
              fontSize: "40px",
              fontWeight: 400,
              lineHeight: "140%",
              letterSpacing: "0%",
              color: "rgba(50, 50, 50, 1)",
            }}
          >
            Everything you'd hope for, and more.
          </h2>
        </div>

        {/* ── Grid ── */}
        <div className="grid grid-cols-3 gap-5">
          {ITEMS.map((item) => (
            <div
              key={item.title}
              className="flex flex-col"
              style={{
                backgroundColor: "rgba(244, 243, 240, 1)",
                borderRadius: "8px",
                padding: "28px",
              }}
            >
              {/* Icon box */}
              <div
                className="mb-5 flex items-center justify-center"
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "8px",
                  backgroundColor: "rgba(255, 255, 255, 1)",
                  flexShrink: 0,
                }}
              >
                <img
                  src={item.icon}
                  alt=""
                  style={{
                    width: "28px",
                    height: "28px",
                    objectFit: "contain",
                    filter: "brightness(0) invert(67%) sepia(10%) saturate(675%) hue-rotate(358deg) brightness(89%) contrast(89%)",
                  }}
                />
              </div>

              {/* Title */}
              <h3
                className="manrope-regular mb-3"
                style={{ fontSize: "18px", fontWeight: 500, color: "rgba(50, 50, 50, 1)" }}
              >
                {item.title}
              </h3>

              {/* Description */}
              <p
                className="manrope-regular"
                style={{ fontSize: "13px", lineHeight: "160%", color: "rgba(50, 50, 50, 0.7)" }}
              >
                {item.desc}
              </p>
            </div>
          ))}
        </div>

      </Container>
    </section>
  );
}
