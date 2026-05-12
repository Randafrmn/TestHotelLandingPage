import { useState, useEffect, useMemo } from "react";
import ArrowSrc from "@/assets/icons/Arrow.svg";

import Memories1Src from "@/assets/images/memories1.svg";
import Memories2Src from "@/assets/images/memories2.svg";
import Memories3Src from "@/assets/images/memories3.svg";
import Memories4Src from "@/assets/images/memories4.svg";
import About2Src from "@/assets/images/About2.svg";
import HeroImage1Src from "@/assets/images/HeroImage1.svg";
import HeroImage2Src from "@/assets/images/HeroImage2.svg";
import Rooms1Src from "@/assets/images/Rooms1.svg";
import Rooms2Src from "@/assets/images/Rooms2.svg";
import Rooms3Src from "@/assets/images/Rooms3.svg";
import ImageDetail1Src from "@/assets/images/ImageDetail1.svg";

type Category = "All Photos" | "Rooms" | "Wellness" | "Culinary";

const GALLERY: Record<Category, string[]> = {
  "All Photos": [
    Memories1Src,
    About2Src,
    HeroImage2Src,
    Memories2Src,
    Memories3Src,
    Memories4Src,
    Rooms1Src,
    Rooms2Src,
    HeroImage1Src,
    Rooms3Src,
    ImageDetail1Src,
  ],
  Rooms: [Rooms1Src, Rooms2Src, Rooms3Src, HeroImage2Src, ImageDetail1Src],
  Wellness: [Memories1Src, Memories2Src, About2Src],
  Culinary: [Memories3Src, Memories4Src, HeroImage1Src],
};

const CATEGORIES: Category[] = ["All Photos", "Rooms", "Wellness", "Culinary"];
const THUMBS_DESKTOP = 8;
const THUMBS_MOBILE = 4;

interface Props {
  onClose: () => void;
}

export function ModalMemories({ onClose }: Props) {
  const [activeCategory, setActiveCategory] = useState<Category>("All Photos");
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [thumbPage, setThumbPage] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const thumbsPerPage = isMobile ? THUMBS_MOBILE : THUMBS_DESKTOP;

  const images = GALLERY[activeCategory];

  const visibleThumbs = useMemo(
    () => images.slice(thumbPage * thumbsPerPage, (thumbPage + 1) * thumbsPerPage),
    [images, thumbPage, thumbsPerPage],
  );

  const mainImage = images[selectedIdx] ?? images[0];

  useEffect(() => {
    if (images.length === 0) return;
    const maxPage = Math.max(0, Math.ceil(images.length / thumbsPerPage) - 1);
    const idealPage = Math.floor(selectedIdx / thumbsPerPage);
    setThumbPage(Math.min(idealPage, maxPage));
  }, [selectedIdx, images.length, thumbsPerPage]);

  function handleCategory(cat: Category) {
    setActiveCategory(cat);
    setSelectedIdx(0);
    setThumbPage(0);
  }

  function handleThumbClick(pageRelativeIdx: number) {
    setSelectedIdx(thumbPage * thumbsPerPage + pageRelativeIdx);
  }

  function handlePrevImage() {
    setSelectedIdx((i) => {
      const n = images.length;
      if (n <= 1) return 0;
      return (i - 1 + n) % n;
    });
  }

  function handleNextImage() {
    setSelectedIdx((i) => {
      const n = images.length;
      if (n <= 1) return 0;
      return (i + 1) % n;
    });
  }

  const atSingleImage = images.length <= 1;
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <>
      <style>{`
        @keyframes gallery-fade {
          from { opacity: 0; transform: scale(1.012); }
          to   { opacity: 1; transform: scale(1); }
        }
        .gallery-preview-enter {
          animation: gallery-fade 0.3s ease forwards;
        }
        .modal-memories-tabs::-webkit-scrollbar {
          display: none;
        }
        .modal-memories-tabs {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      <div
        className="fixed inset-0 z-50 flex w-full flex-col items-center justify-center px-4 py-8 md:px-6 md:py-10"
        style={{
          backgroundColor: "rgba(50,50,50,0.92)",
          backdropFilter: "blur(22px)",
          WebkitBackdropFilter: "blur(22px)",
        }}
        onClick={onClose}
      >
        <button
          type="button"
          onClick={onClose}
          className="fixed flex items-center justify-center transition-opacity hover:opacity-70"
          style={{
            top: "20px",
            right: "20px",
            width: "34px",
            height: "34px",
            border: "none",
            cursor: "pointer",
            zIndex: 51,
          }}
          aria-label="Close gallery"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M1 1L11 11M11 1L1 11"
              stroke="white"
              strokeWidth="1.7"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <div
          className="relative z-10 mx-auto flex w-full min-w-0 max-w-[min(100%,560px)] flex-col md:max-w-[min(100%,640px)]"
          style={{ backgroundColor: "transparent" }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Category pills — horizontal scroll (mobile); centered wrap (desktop) */}
          <div
            className="modal-memories-tabs mb-4 w-full min-w-0 shrink-0 touch-pan-x overflow-x-auto overflow-y-hidden overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:touch-auto md:overflow-visible"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            <div
              className="flex w-max flex-nowrap gap-2 md:mx-auto md:w-full md:flex-wrap md:justify-center"
              role="tablist"
              aria-label="Gallery categories"
            >
              {CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => handleCategory(cat)}
                    className="manrope-regular shrink-0 whitespace-nowrap transition-colors"
                    style={{
                      padding: isMobile ? "10px 20px" : "7px 18px",
                      borderRadius: "8px",
                      fontSize: isMobile ? "14px" : "13px",
                      border: isActive
                        ? "1px solid transparent"
                        : "1px solid rgba(255,255,255,0.35)",
                      backgroundColor: isActive
                        ? "rgba(255,255,255,1)"
                        : "transparent",
                      color: isActive
                        ? "rgba(25,25,25,1)"
                        : "rgba(255,255,255,0.95)",
                      cursor: "pointer",
                      fontWeight: isActive ? 500 : 400,
                      letterSpacing: "0.01em",
                    }}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main preview — width + max-height cap so the gallery does not fill the screen */}
          <div
            className="mx-auto w-full shrink-0"
            style={{
              aspectRatio: isMobile ? "4 / 5" : "7 / 5",
              maxHeight: isMobile ? "min(38vh, 320px)" : "min(62vh, 480px)",
              borderRadius: isMobile ? "6px" : "1px",
              overflow: "hidden",
              marginBottom: isMobile ? "12px" : "8px",
              position: "relative",
            }}
          >
            <div
              key={mainImage}
              className="gallery-preview-enter"
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: `url(${mainImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                borderRadius: isMobile ? "6px" : "1px",
              }}
            />
          </div>

          {/* Thumbnail strip — square cells (4 cols mobile, 8 desktop) */}
          <div
            className="grid w-full shrink-0 grid-cols-4 gap-1.5 md:grid-cols-8 md:gap-[5px]"
            style={{
              marginBottom: isMobile ? "18px" : "14px",
            }}
          >
            {Array.from({ length: thumbsPerPage }).map((_, i) => {
              const src = visibleThumbs[i];
              const globalIdx = thumbPage * thumbsPerPage + i;
              const isSelected = globalIdx === selectedIdx;

              if (!src) {
                return (
                  <div
                    key={`empty-${i}`}
                    className={`aspect-square w-full min-h-0 ${isMobile ? "rounded-[4px]" : "rounded-[1px]"}`}
                    style={{
                      backgroundColor: "rgba(255,255,255,0.06)",
                    }}
                  />
                );
              }

              return (
                <button
                  key={`${src}-${globalIdx}`}
                  type="button"
                  onClick={() => handleThumbClick(i)}
                  className={`aspect-square w-full min-h-0 overflow-hidden ${isMobile ? "rounded-[4px]" : "rounded-[1px]"}`}
                  style={{
                    border: "none",
                    padding: 0,
                    cursor: "pointer",
                    backgroundImage: `url(${src})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    opacity: isSelected ? 1 : 0.55,
                    transition: "opacity 0.2s",
                    outline: isSelected
                      ? "2px solid rgba(164,151,129,1)"
                      : "none",
                    outlineOffset: "-2px",
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) e.currentTarget.style.opacity = "0.85";
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) e.currentTarget.style.opacity = "0.55";
                  }}
                  aria-label={`View photo ${globalIdx + 1}`}
                />
              );
            })}
          </div>

          {/* Pagination */}
          <div className="flex shrink-0 items-center justify-center gap-3 pb-2">
            <button
              type="button"
              onClick={handlePrevImage}
              aria-label="Previous photo"
              disabled={atSingleImage}
              className="flex items-center justify-center overflow-hidden disabled:cursor-not-allowed"
              style={{
                width: 40,
                height: 40,
                borderRadius: 8,
                border: "none",
                cursor: atSingleImage ? "default" : "pointer",
                flexShrink: 0,
                backgroundColor: atSingleImage
                  ? "rgba(255,255,255,0.35)"
                  : "rgba(255,255,255,1)",
                transition: "background-color 0.3s",
                opacity: atSingleImage ? 0.6 : 1,
              }}
            >
              <img
                src={ArrowSrc}
                alt=""
                className="h-3 w-5"
                style={{
                  transform: "rotate(180deg)",
                  filter: atSingleImage
                    ? "brightness(0.243)"
                    : "brightness(0) invert(67%) sepia(10%) saturate(675%) hue-rotate(358deg) brightness(89%) contrast(89%)",
                  transition: "filter 0.3s",
                }}
              />
            </button>

            <span
              className="manrope-regular"
              style={{
                fontSize: "13px",
                color: "rgba(255,255,255,0.85)",
                minWidth: "52px",
                textAlign: "center",
                letterSpacing: "0.03em",
              }}
            >
              {images.length ? selectedIdx + 1 : 0} / {images.length}
            </span>

            <button
              type="button"
              onClick={handleNextImage}
              aria-label="Next photo"
              disabled={atSingleImage}
              className="flex items-center justify-center overflow-hidden disabled:cursor-not-allowed"
              style={{
                width: 40,
                height: 40,
                borderRadius: 8,
                border: "none",
                cursor: atSingleImage ? "default" : "pointer",
                flexShrink: 0,
                backgroundColor: atSingleImage
                  ? "rgba(255,255,255,0.35)"
                  : "rgba(255,255,255,1)",
                transition: "background-color 0.3s",
                opacity: atSingleImage ? 0.6 : 1,
              }}
            >
              <img
                src={ArrowSrc}
                alt=""
                className="h-3 w-5"
                style={{
                  filter: atSingleImage
                    ? "brightness(0.243)"
                    : "brightness(0) invert(67%) sepia(10%) saturate(675%) hue-rotate(358deg) brightness(89%) contrast(89%)",
                  transition: "filter 0.3s",
                }}
              />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
