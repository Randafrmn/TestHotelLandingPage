import { useState, useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { CarouselArrowButton } from "./shared/CarouselArrowButton";
import ArrowDetailSrc from "@/assets/icons/arrowdetaildesktop.svg";
import PeopleDetailSrc from "@/assets/icons/peopledetaildesktop.svg";
import BedSrc from "@/assets/icons/bed.svg";
import TagSrc from "@/assets/icons/Tag.svg";

/* ─── Types (exported so rooms.tsx can use them) ─────────────────── */

export type Amenity = { icon: string; label: string };

export type Room = {
  img: string;
  price: string;
  name: string;
  desc: string;
  guests: string;
  area: string;
  imgW: number;
  imgH: number;
  bed: string;
  longDesc: string;
  gallery: string[];
  amenities: Amenity[];
  services: string[];
};

/* ─── Component ─────────────────────────────────────────────────── */

type Props = {
  room: Room;
  onClose: () => void;
};

const MODAL_H = 480; /* desktop minimum height */

export function RoomModal({ room, onClose }: Props) {
  const [modalEmblaRef, modalEmblaApi] = useEmblaCarousel({ loop: true, duration: 30 });
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (!modalEmblaApi) return;
    const onSelect = () => setSelectedIdx(modalEmblaApi.selectedScrollSnap());
    modalEmblaApi.on("select", onSelect);
    return () => { modalEmblaApi.off("select", onSelect); };
  }, [modalEmblaApi]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const scrollPrev = useCallback(() => modalEmblaApi?.scrollPrev(), [modalEmblaApi]);
  const scrollNext = useCallback(() => modalEmblaApi?.scrollNext(), [modalEmblaApi]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-3 py-8 md:p-4 md:py-10"
      style={{ backgroundColor: "rgba(0,0,0,0.35)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
      onClick={onClose}
    >
      <div
        className="relative my-auto flex w-full overflow-hidden bg-white"
        style={{
          borderRadius: "12px",
          maxWidth: isMobile ? "350px" : "1060px",
          minHeight: isMobile ? undefined : MODAL_H,
          flexDirection: isMobile ? "column" : "row",
          gap: isMobile ? "8px" : "0px",
        }}
        onClick={(e) => e.stopPropagation()}
      >

        {/* ── Left: Carousel (framed) ── */}
        <div
          className="relative flex flex-shrink-0 flex-col"
          style={{
            width: isMobile ? "100%" : "52%",
            minHeight: isMobile ? 210 : MODAL_H,
            alignSelf: isMobile ? undefined : "stretch",
            padding: isMobile ? "0px" : "16px 8px 16px 16px",
          }}
        >
          <div
            className="relative flex-1 overflow-hidden"
            style={{
              borderRadius: "12px",
              height: isMobile ? "210px" : "100%",
              minHeight: isMobile ? "210px" : MODAL_H - 32,
            }}
          >
            <div ref={modalEmblaRef} style={{ overflow: "hidden", height: "100%" }}>
              <div className="flex" style={{ height: "100%" }}>
                {room.gallery.map((src, i) => (
                  <div
                    key={i}
                    className="flex-shrink-0"
                    style={{
                      width: "100%",
                      height: "100%",
                      backgroundImage: `url(${src})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <CarouselArrowButton direction="prev" onClick={scrollPrev} className="rounded-2px" />
            </div>
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <CarouselArrowButton direction="next" onClick={scrollNext} className="rounded-2px" />
            </div>

            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2">
              {room.gallery.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Slide ${i + 1}`}
                  onClick={() => modalEmblaApi?.scrollTo(i)}
                  style={{
                    height: "3px",
                    width: i === selectedIdx ? "28px" : "14px",
                    borderRadius: "2px",
                    backgroundColor: i === selectedIdx ? "rgba(255,255,255,1)" : "rgba(255,255,255,0.45)",
                    border: "none",
                    padding: 0,
                    cursor: "pointer",
                    transition: "width 0.3s, background-color 0.3s",
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ── Right: Details ── */}
        <div
          className="flex min-w-0 flex-col"
          style={{
            flex: 1,
            overflow: "visible",
            padding: isMobile ? "10px 12px 12px 12px" : "24px 28px 20px 24px",
          }}
        >
          <h2
            className="manrope-regular"
            style={{
              fontSize: "20px",
              fontWeight: 400,
              color: "rgba(50,50,50,1)",
              marginBottom: isMobile ? "8px" : "12px",
              lineHeight: isMobile ? "1.2" : "1.25",
            }}
          >
            {room.name}
          </h2>

          <div
            className={isMobile ? "flex flex-col" : "grid grid-cols-2"}
            style={{
              borderTop: "1px solid rgba(50,50,50,0.1)",
              borderBottom: "1px solid rgba(50,50,50,0.1)",
              padding: isMobile ? "12px 0" : "10px 0",
              gap: isMobile ? "12px" : "8px 16px",
              marginBottom: isMobile ? "10px" : "12px",
            }}
          >
            {[
              { icon: ArrowDetailSrc, label: room.area },
              { icon: BedSrc, label: room.bed },
              { icon: PeopleDetailSrc, label: room.guests },
              { icon: TagSrc, label: room.price },
            ].map(({ icon, label }) => (
              <div key={label} className="flex items-center gap-3">
                <img
                  src={icon}
                  alt=""
                  style={{
                    width: isMobile ? "20px" : "20px",
                    height: isMobile ? "14px" : "13px",
                    objectFit: "contain",
                    flexShrink: 0,
                    filter: "brightness(0)",
                  }}
                />
                <span className="manrope-regular" style={{ fontSize: "16px", fontWeight: 400, color: "rgba(50,50,50,0.9)", lineHeight: "1.35" }}>
                  {label}
                </span>
              </div>
            ))}
          </div>

          <p
            className="manrope-regular"
            style={{
              fontSize: "16px",
              fontWeight: 400,
              lineHeight: "160%",
              color: "rgba(50,50,50,1)",
              marginBottom: isMobile ? "8px" : "12px",
              flexShrink: 0,
            }}
          >
            {room.longDesc}
          </p>

          <div style={{ marginBottom: isMobile ? "8px" : "10px", flexShrink: 0 }}>
            <p className="manrope-regular" style={{ fontSize: "16px", fontWeight: 500, color: "rgba(50,50,50,1)", marginBottom: "6px" }}>
              Amenities:
            </p>
            <div className={isMobile ? "flex flex-col items-start gap-2.5" : "flex items-center gap-4"}>
              {room.amenities.map(({ icon, label }) => (
                <div key={label} className="flex items-center gap-1.5">
                  <img src={icon} alt="" style={{ width: isMobile ? "14px" : "18px", height: isMobile ? "10px" : "13px", objectFit: "contain", flexShrink: 0, filter: "brightness(0) invert(67%) sepia(10%) saturate(675%) hue-rotate(358deg) brightness(89%) contrast(89%)" }} />
                  <span className="manrope-regular" style={{ fontSize: "16px", fontWeight: 400, color: "rgba(50,50,50,1)" }}>
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ flexShrink: 0 }}>
            <p className="manrope-regular" style={{ fontSize: "16px", fontWeight: 500, color: "rgba(50,50,50,1)", marginBottom: "6px" }}>
              Included services:
            </p>
            <ul
              className="flex flex-col"
              style={{ gap: isMobile ? "12px" : "5px" }}
            >
              {room.services.map((s) => (
                <li
                  key={s}
                  className={`flex text-left ${isMobile ? "items-center gap-2" : "items-start gap-2"}`}
                >
                  <span
                    className="flex flex-shrink-0 items-center justify-center rounded-full"
                    style={{
                      width: isMobile ? "13px" : "13px",
                      height: isMobile ? "13px" : "13px",
                      marginTop: isMobile ? 0 : "3px",
                      backgroundColor: "rgba(164,151,129,1)",
                    }}
                  >
                    <svg
                      width={isMobile ? 10 : 7}
                      height={isMobile ? 7 : 5}
                      viewBox="0 0 8 6"
                      fill="none"
                      aria-hidden
                    >
                      <path d="M1 3L3 5L7 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span
                    className="manrope-regular min-w-0 flex-1"
                    style={{
                      fontSize: "16px",
                      fontWeight: 400,
                      lineHeight: "150%",
                      color: "rgba(50,50,50,1)",
                    }}
                  >
                    {s}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-auto flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="manrope-regular flex-1 transition-colors hover:bg-[rgba(50,50,50,0.04)]"
              style={{ padding: isMobile ? "9px 0" : "11px 0", fontSize: isMobile ? "10px" : "11px", letterSpacing: "0.12em", textTransform: "uppercase", border: "1px solid rgba(50,50,50,0.2)", borderRadius: "8px", color: "rgba(50,50,50,1)", background: "transparent" }}
            >
              Close
            </button>
            <button
              type="button"
              className="manrope-regular flex-1 text-white transition-opacity hover:opacity-90"
              style={{ padding: isMobile ? "9px 0" : "11px 0", fontSize: isMobile ? "10px" : "11px", letterSpacing: "0.12em", textTransform: "uppercase", backgroundColor: "rgba(164,151,129,1)", borderRadius: "8px", border: "none", cursor: "pointer" }}
              onClick={() => {
                window.dispatchEvent(new CustomEvent("room:reserve-request", { detail: { room: room.name } }));
                onClose();
                setTimeout(() => {
                  document.getElementById("reserve")?.scrollIntoView({ behavior: "smooth" });
                }, 50);
              }}
            >
              Reserve This Suite
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
