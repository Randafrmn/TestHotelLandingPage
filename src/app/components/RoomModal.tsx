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

const MODAL_H = 480;

export function RoomModal({ room, onClose }: Props) {
  const [modalEmblaRef, modalEmblaApi] = useEmblaCarousel({ loop: true, duration: 30 });
  const [selectedIdx, setSelectedIdx] = useState(0);

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

  const scrollPrev = useCallback(() => modalEmblaApi?.scrollPrev(), [modalEmblaApi]);
  const scrollNext = useCallback(() => modalEmblaApi?.scrollNext(), [modalEmblaApi]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.35)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
      onClick={onClose}
    >
      <div
        className="relative flex w-full overflow-hidden bg-white"
        style={{ borderRadius: "12px", maxWidth: "1060px", height: `${MODAL_H}px` }}
        onClick={(e) => e.stopPropagation()}
      >

        {/* ── Left: Carousel (framed) ── */}
        <div
          className="relative flex-shrink-0"
          style={{ width: "52%", height: "100%", padding: "16px 8px 16px 16px" }}
        >
          <div className="relative h-full overflow-hidden" style={{ borderRadius: "12px" }}>
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
          className="flex flex-col"
          style={{ flex: 1, overflow: "hidden", padding: "24px 28px 20px 24px" }}
        >
          <h2
            className="manrope-regular"
            style={{ fontSize: "18px", fontWeight: 500, color: "rgba(50,50,50,1)", marginBottom: "12px" }}
          >
            {room.name}
          </h2>

          <div
            className="grid grid-cols-2"
            style={{
              borderTop: "1px solid rgba(50,50,50,0.1)",
              borderBottom: "1px solid rgba(50,50,50,0.1)",
              padding: "10px 0",
              gap: "8px 16px",
              marginBottom: "12px",
            }}
          >
            {[
              { icon: ArrowDetailSrc, label: room.area },
              { icon: BedSrc, label: room.bed },
              { icon: PeopleDetailSrc, label: room.guests },
              { icon: TagSrc, label: room.price },
            ].map(({ icon, label }) => (
              <div key={label} className="flex items-center gap-2.5">
                <img
                  src={icon}
                  alt=""
                  style={{
                    width: "20px",
                    height: "13px",
                    objectFit: "contain",
                    flexShrink: 0,
                    filter: "brightness(0) invert(67%) sepia(10%) saturate(675%) hue-rotate(358deg) brightness(89%) contrast(89%)",
                  }}
                />
                <span className="manrope-regular" style={{ fontSize: "12px", color: "rgba(50,50,50,0.8)" }}>
                  {label}
                </span>
              </div>
            ))}
          </div>

          <p
            className="manrope-regular"
            style={{ fontSize: "11.5px", lineHeight: "165%", color: "rgba(50,50,50,1)", marginBottom: "12px", flexShrink: 0 }}
          >
            {room.longDesc}
          </p>

          <div style={{ marginBottom: "10px", flexShrink: 0 }}>
            <p className="manrope-regular" style={{ fontSize: "11.5px", fontWeight: 500, color: "rgba(50,50,50,1)", marginBottom: "6px" }}>
              Amenities:
            </p>
            <div className="flex items-center gap-5">
              {room.amenities.map(({ icon, label }) => (
                <div key={label} className="flex items-center gap-1.5">
                  <img src={icon} alt="" style={{ width: "18px", height: "13px", objectFit: "contain", flexShrink: 0, filter: "brightness(0) invert(67%) sepia(10%) saturate(675%) hue-rotate(358deg) brightness(89%) contrast(89%)" }} />
                  <span className="manrope-regular" style={{ fontSize: "11.5px", color: "rgba(50,50,50,0.75)" }}>
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ flexShrink: 0 }}>
            <p className="manrope-regular" style={{ fontSize: "11.5px", fontWeight: 500, color: "rgba(50,50,50,1)", marginBottom: "6px" }}>
              Included services:
            </p>
            <ul style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              {room.services.map((s) => (
                <li key={s} className="flex items-start gap-2">
                  <span
                    className="flex items-center justify-center flex-shrink-0"
                    style={{ marginTop: "2px", width: "13px", height: "13px", borderRadius: "50%", backgroundColor: "rgba(164,151,129,1)" }}
                  >
                    <svg width="7" height="5" viewBox="0 0 8 6" fill="none">
                      <path d="M1 3L3 5L7 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span className="manrope-regular" style={{ fontSize: "11px", lineHeight: "155%", color: "rgba(50,50,50,0.75)" }}>
                    {s}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div style={{ flex: 1 }} />

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="manrope-regular flex-1 transition-colors hover:bg-[rgba(50,50,50,0.04)]"
              style={{ padding: "11px 0", fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", border: "1px solid rgba(50,50,50,0.2)", borderRadius: "8px", color: "rgba(50,50,50,1)", background: "transparent" }}
            >
              Close
            </button>
            <button
              type="button"
              className="manrope-regular flex-1 text-white transition-opacity hover:opacity-90"
              style={{ padding: "11px 0", fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", backgroundColor: "rgba(164,151,129,1)", borderRadius: "8px", border: "none", cursor: "pointer" }}
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
