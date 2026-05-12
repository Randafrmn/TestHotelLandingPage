import { useState, useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Container } from "./shared/Container";
import { SliderNavButtons } from "./shared/SliderNavButtons";
import { RoomModal, type Room } from "./room-modal";
import Rooms1Src from "@/assets/images/Rooms1.svg";
import Rooms2Src from "@/assets/images/Rooms2.svg";
import Rooms3Src from "@/assets/images/Rooms3.svg";
import PeopleSrc from "@/assets/icons/People.svg";
import ArrowTwoSidesSrc from "@/assets/icons/ArrowTwoSides.svg";
import BathtubSrc from "@/assets/icons/bathub.svg";
import WifiSrc from "@/assets/icons/wifi.svg";
import MartiniSrc from "@/assets/icons/Martini.svg";

/* ─── Data ─────────────────────────────────────────────────────── */

const ROOMS: Room[] = [
  {
    img: Rooms1Src,
    price: "€280 / night",
    name: "Larch Junior Suite",
    desc: "Panoramic views with a private balcony and natural pine interiors.",
    guests: "2 Guests",
    area: "45 m²",
    imgW: 465, imgH: 327,
    bed: "King Size Bed",
    longDesc:
      "Nestled among the ancient larch trees, this intimate suite features a private balcony with sweeping mountain views. The interior blends hand-carved alpine pine with warm earth tones, creating a sanctuary of calm. A wood-burning stove and deep soaking tub complete the retreat experience.",
    gallery: [Rooms1Src, Rooms3Src, Rooms2Src],
    amenities: [
      { icon: BathtubSrc, label: "Bathtub" },
      { icon: WifiSrc, label: "Wifi" },
      { icon: MartiniSrc, label: "Mini Bar" },
    ],
    services: [
      "Complimentary bottle of South Tyrolean sparkling wine upon arrival.",
      "Reserved parking space in our underground garage.",
      "Daily \"Gourmet Breakfast\" served in the suite upon request.",
    ],
  },
  {
    img: Rooms3Src,
    price: "€450 / night",
    name: "Summit Royal Suite",
    desc: "Luxurious top-floor suite featuring an open fireplace and a freestanding bathtub.",
    guests: "2–4 Guests",
    area: "75 m²",
    imgW: 465, imgH: 327,
    bed: "King Size Luxury Bed",
    longDesc:
      "Experience the pinnacle of Alpine luxury. Located on the highest floor of Hotel L'Aura, the Summit Royal Suite offers an expansive living area with a private open fireplace and a freestanding designer bathtub with direct views of the Dolomites. The suite is furnished with hand-carved stone and local Swiss pine wood, known for its calming properties.",
    gallery: [Rooms3Src, Rooms1Src, Rooms2Src],
    amenities: [
      { icon: BathtubSrc, label: "Bathtub" },
      { icon: WifiSrc, label: "Wifi" },
      { icon: MartiniSrc, label: "Mini Bar" },
    ],
    services: [
      "Complimentary bottle of South Tyrolean sparkling wine upon arrival.",
      "Reserved parking space in our underground garage.",
      "Daily \"Gourmet Breakfast\" served in the suite upon request.",
    ],
  },
  {
    img: Rooms2Src,
    price: "€380 / night",
    name: "Family Alpine Lodge",
    desc: "Two separate bedrooms and a spacious living area, perfect for mountain families.",
    guests: "4 Guests",
    area: "65 m²",
    imgW: 446, imgH: 327,
    bed: "2 Queen Beds",
    longDesc:
      "The Family Alpine Lodge is designed for those who want to share the mountains together. Two separate bedrooms, a spacious living area with a fireplace, and a private garden terrace make this the perfect base for alpine adventures. Every detail is crafted for comfort and togetherness.",
    gallery: [Rooms2Src, Rooms1Src, Rooms3Src],
    amenities: [
      { icon: BathtubSrc, label: "Bathtub" },
      { icon: WifiSrc, label: "Wifi" },
      { icon: MartiniSrc, label: "Mini Bar" },
    ],
    services: [
      "Complimentary welcome gift for children upon arrival.",
      "Reserved parking space in our underground garage.",
      "Daily \"Gourmet Breakfast\" served in the suite upon request.",
    ],
  },
  {
    img: Rooms1Src,
    price: "€520 / night",
    name: "Panoramic Penthouse",
    desc: "Floor-to-ceiling windows with an unobstructed 270° view of the alpine landscape.",
    guests: "2 Guests",
    area: "90 m²",
    imgW: 465, imgH: 327,
    bed: "King Size Premium Bed",
    longDesc:
      "Perched at the very top of Hotel L'Aura, the Panoramic Penthouse offers a 270° view of the Dolomites through its floor-to-ceiling windows. The open-plan living space features a private rooftop terrace, a bespoke kitchen, and materials sourced entirely from local Alpine craftspeople.",
    gallery: [Rooms1Src, Rooms2Src, Rooms3Src],
    amenities: [
      { icon: BathtubSrc, label: "Bathtub" },
      { icon: WifiSrc, label: "Wifi" },
      { icon: MartiniSrc, label: "Mini Bar" },
    ],
    services: [
      "Complimentary bottle of South Tyrolean sparkling wine upon arrival.",
      "Private rooftop terrace with panoramic views.",
      "Daily \"Gourmet Breakfast\" served in the suite upon request.",
    ],
  },
];

/* ─── Section ───────────────────────────────────────────────────── */

export function Rooms() {
  const [activeRoom, setActiveRoom] = useState<Room | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
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

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return (
    <section id="rooms" style={{ backgroundColor: "rgba(244, 243, 240, 1)" }} className="py-20">

      {/* ── Header ── */}
      <Container className="mb-10 text-center md:mb-12">
        <p className="monroe-regular mb-3 text-[14px] text-[rgba(50,50,50,1)] md:text-[16px]">
          — Your Private Sanctuary —
        </p>
        <h2
          className="manrope-regular mb-4 text-[24px] md:text-[40px]"
          style={{ fontWeight: 400, lineHeight: "140%", letterSpacing: "0%", color: "rgba(50, 50, 50, 1)" }}
        >
          Designed for Deep Rest
        </h2>
        <p
          className="manrope-regular text-muted-foreground"
          style={{ fontSize: "16px", maxWidth: isMobile ? "320px" : "none", margin: "0 auto" }}
        >
          Explore our selection of light-flooded suites, each featuring a private panoramic
          terrace and the soothing scent of natural pine wood.
        </p>
      </Container>

      {/* ── Carousel ── */}
      <div ref={emblaRef} className={isMobile ? "overflow-hidden px-6" : "overflow-hidden"}>
        <div
          className="flex"
          style={{
            paddingLeft: isMobile ? "0px" : "max(24px, calc((100vw - 1152px) / 2 + 24px))",
            paddingRight: isMobile ? "0px" : "max(24px, calc((100vw - 1152px) / 2 + 24px))",
            gap: isMobile ? "25px" : "20px",
          }}
        >
          {ROOMS.map((room, i) => (
            <div
              key={i}
              className="flex-shrink-0 overflow-hidden bg-white"
              style={{
                width: isMobile
                  ? "100%"
                  : "calc((min(100vw, 1152px) - 48px - 48px) / 3)",
                borderRadius: "8px",
              }}
            >
              <div className="relative">
                <div
                  role="img"
                  aria-label={room.name}
                  style={{
                    width: "100%",
                    height: "250px",
                    backgroundImage: `url(${room.img})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
                <div
                  className="absolute manrope-regular"
                  style={{
                    top: "12px",
                    right: "12px",
                    backgroundColor: "rgba(255,255,255,0.92)",
                    backdropFilter: "blur(8px)",
                    WebkitBackdropFilter: "blur(8px)",
                    borderRadius: "8px",
                    padding: "5px 12px",
                    fontSize: "12px",
                    color: "rgba(50,50,50,1)",
                  }}
                >
                  {room.price}
                </div>
              </div>

              <div className="px-5 py-5">
                <h3
                  className="manrope-regular mb-2"
                  style={{ fontSize: "18px", fontWeight: 500, color: "rgba(50,50,50,1)" }}
                >
                  {room.name}
                </h3>
                <p
                  className="manrope-regular mb-4"
                  style={{ fontSize: "13px", lineHeight: "150%", color: "rgba(50,50,50,0.7)" }}
                >
                  {room.desc}
                </p>

                <div className="mb-5 flex items-center gap-5">
                  <div className="flex items-center gap-1.5">
                    <img src={PeopleSrc} alt="" className="h-3.5 w-auto flex-shrink-0" style={{ filter: "brightness(0) opacity(1)" }} />
                    <span className="manrope-regular" style={{ fontSize: "12px", color: "rgba(50,50,50,1)" }}>
                      {room.guests}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <img src={ArrowTwoSidesSrc} alt="" className="h-2 w-auto flex-shrink-0" style={{ filter: "brightness(0) opacity(1)" }} />
                    <span className="manrope-regular" style={{ fontSize: "12px", color: "rgba(50,50,50,1)" }}>
                      {room.area}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveRoom(room)}
                  className="manrope-regular w-full py-3 text-xs uppercase tracking-[0.15em] text-[rgba(50,50,50,1)] hover:bg-[#A49781] hover:text-white hover:border-[#A49781] transition-colors duration-200"
                  style={{ border: "1px solid rgba(50,50,50,0.2)", borderRadius: "8px" }}
                >
                  See Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Nav ── */}
      <div className="mt-10 flex justify-center">
        <SliderNavButtons
          onPrev={scrollPrev}
          onNext={scrollNext}
          prevDisabled={!canPrev}
          nextDisabled={!canNext}
          activeArrowFilter="brightness(0) invert(1)"
          inactiveArrowFilter="brightness(0) invert(1) brightness(0.596)"
        />
      </div>

      {/* ── Modal ── */}
      {activeRoom && (
        <RoomModal room={activeRoom} onClose={() => setActiveRoom(null)} />
      )}

    </section>
  );
}
