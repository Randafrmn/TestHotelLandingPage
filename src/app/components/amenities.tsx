  import { useCallback, useEffect, useState } from "react";
  import useEmblaCarousel from "embla-carousel-react";
import { Container } from "./shared/Container";
import { SliderNavButtons } from "./shared/SliderNavButtons";
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
    const [emblaRef, emblaApi] = useEmblaCarousel({
      loop: true,
      align: "start",
      slidesToScroll: 1,
      duration: 25,
    });

    const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
    const [canPrev, setCanPrev] = useState(false);
    const [canNext, setCanNext] = useState(true);

    useEffect(() => {
      if (!emblaApi) return;
      const update = () => {
        setCanPrev(emblaApi.canScrollPrev());
        setCanNext(emblaApi.canScrollNext());
      };
      update();
      emblaApi.on("select", update);
      emblaApi.on("reInit", update);
      return () => {
        emblaApi.off("select", update);
        emblaApi.off("reInit", update);
      };
    }, [emblaApi]);

  return (
    <section data-section-animate id="amenities" className="bg-white py-20">
      {/* ── Header ── */}
      <Container className="mb-10 text-center md:mb-12">
        <div className="mx-auto w-full">
          <p data-reveal className="monroe-regular mb-3 text-[14px] text-[rgba(50,50,50,1)] md:text-[16px]">
            — Amenities —
          </p>
          <h2
            data-reveal
            className="manrope-regular"
            style={{
              fontSize: "clamp(24px, 3.6vw, 40px)",
              fontWeight: 400,
              lineHeight: "140%",
              letterSpacing: "0%",
              color: "rgba(50, 50, 50, 1)",
            }}
          >
            Everything you'd hope for, and more.
          </h2>
        </div>
      </Container>

      {/* ── Desktop grid ── */}
      <Container className="hidden md:block">
        <div data-reveal className="grid grid-cols-3 gap-5">
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

              <h3
                className="manrope-regular mb-3"
                style={{ fontSize: "18px", fontWeight: 500, color: "rgba(50, 50, 50, 1)" }}
              >
                {item.title}
              </h3>

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

      {/* ── Mobile carousel ── */}
      <div data-reveal className="md:hidden">
        <div className="mx-auto w-full overflow-hidden px-6">
          <div ref={emblaRef}>
            <div className="flex gap-[25px]">
              {ITEMS.map((item) => (
                <div
                  key={item.title}
                  className="relative z-10 min-w-0 flex-[0_0_100%] rounded-[8px]"
                  style={{
                    backgroundColor: "rgba(244, 243, 240, 1)",
                    padding: "16px",
                  }}
                >
                  <div
                    className="mb-8 flex items-center justify-center"
                    style={{
                      width: "48px",
                      height: "48px",
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

                  <h3
                    className="manrope-regular mb-6"
                    style={{ fontSize: "18px", fontWeight: 500, color: "rgba(50, 50, 50, 1)", lineHeight: "1.25" }}
                  >
                    {item.title}
                  </h3>

                  <p
                    className="manrope-regular"
                    style={{ fontSize: "13px", lineHeight: "160%", color: "rgba(50, 50, 50, 0.7)" }}
                  >
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <SliderNavButtons
            onPrev={scrollPrev}
            onNext={scrollNext}
            prevDisabled={!canPrev}
            nextDisabled={!canNext}
            activeArrowFilter="brightness(0) invert(1)"
            inactiveArrowFilter="brightness(0) invert(1) brightness(0.596)"
          />
        </div>
      </div>
    </section>
  );
}
