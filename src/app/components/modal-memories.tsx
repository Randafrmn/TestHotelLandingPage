import { useState, useEffect } from "react";
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
const THUMBS_PER_PAGE = 8;

interface Props {
  onClose: () => void;
}

export function ModalMemories({ onClose }: Props) {
  const [activeCategory, setActiveCategory] = useState<Category>("All Photos");
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [thumbPage, setThumbPage] = useState(0);

  const images = GALLERY[activeCategory];
  const totalPages = Math.ceil(images.length / THUMBS_PER_PAGE);
  const visibleThumbs = images.slice(
    thumbPage * THUMBS_PER_PAGE,
    (thumbPage + 1) * THUMBS_PER_PAGE,
  );
  const mainImage = images[selectedIdx] ?? images[0];

  function handleCategory(cat: Category) {
    setActiveCategory(cat);
    setSelectedIdx(0);
    setThumbPage(0);
  }

  function handleThumbClick(pageRelativeIdx: number) {
    setSelectedIdx(thumbPage * THUMBS_PER_PAGE + pageRelativeIdx);
  }

  function handlePrevPage() {
    setThumbPage((p) => Math.max(0, p - 1));
  }

  function handleNextPage() {
    setThumbPage((p) => Math.min(totalPages - 1, p + 1));
  }

  /* lock body scroll */
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  /* close on Escape */
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
      `}</style>

      {/* Backdrop — click outside to close */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center"
        style={{
          backgroundColor: "rgba(50,50,50,0.8)",
          backdropFilter: "blur(22px)",
          WebkitBackdropFilter: "blur(22px)",
          padding: "48px 24px 24px",
        }}
        onClick={onClose}
      >
        {/* X close button — floats at top-right of viewport */}
        <button
          type="button"
          onClick={onClose}
          className="fixed flex items-center justify-center transition-opacity hover:opacity-70"
          style={{
            top: "20px",
            right: "24px",
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

        {/* Modal card — transparent, content floats on backdrop */}
        <div
          className="flex w-full flex-col"
          style={{
            maxWidth: "500px",
            backgroundColor: "transparent",
            padding: "0px",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Category tabs — centered */}
          <div
            className="mb-4 flex items-center justify-center gap-2"
          >
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => handleCategory(cat)}
                  className="manrope-regular transition-colors"
                  style={{
                    padding: "7px 18px",
                    borderRadius: "8px",
                    fontSize: "13px",
                    border: isActive
                      ? "1px solid transparent"
                      : "1px solid rgba(255,255,255,0.22)",
                    backgroundColor: isActive
                      ? "rgba(255,255,255,1)"
                      : "transparent",
                    color: isActive
                      ? "rgba(25,25,25,1)"
                      : "rgba(255,255,255,0.82)",
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

          {/* Main preview — with dark frame border */}
          <div
            style={{
              width: "100%",
              aspectRatio: "7 / 5",
              borderRadius: "1px",
              overflow: "hidden",
              marginBottom: "8px",
              position: "relative",
              flexShrink: 0,
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
                borderRadius: "1px",
              }}
            />
          </div>

          {/* Thumbnail strip — always 8 equal slots, same total width as main image */}
          <div
            style={{
              display: "flex",
              gap: "5px",
              marginBottom: "14px",
              borderRadius: "1px",
            }}
          >
            {Array.from({ length: THUMBS_PER_PAGE }).map((_, i) => {
              const src = visibleThumbs[i];
              const globalIdx = thumbPage * THUMBS_PER_PAGE + i;
              const isSelected = globalIdx === selectedIdx;

              if (!src) {
                /* empty slot — keeps layout stable */
                return (
                  <div
                    key={`empty-${i}`}
                    style={{
                      flex: 1,
                      minWidth: 0,
                      height: "56px",
                      borderRadius: "1px",
                      backgroundColor: "rgba(255,255,255,0.04)",
                    }}
                  />
                );
              }

              return (
                <button
                  key={`${src}-${globalIdx}`}
                  type="button"
                  onClick={() => handleThumbClick(i)}
                  style={{
                    flex: 1,
                    minWidth: 0,
                    height: "56px",
                    border: "none",
                    padding: 0,
                    cursor: "pointer",
                    backgroundImage: `url(${src})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    opacity: isSelected ? 1 : 0.55,
                    transition: "opacity 0.2s",
                    borderRadius: "1px",
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
          <div className="flex items-center justify-center gap-3">
            {/* Prev */}
            <button
              type="button"
              onClick={handlePrevPage}
              aria-label="Previous page"
              className="flex items-center justify-center overflow-hidden"
              style={{
                width: 40,
                height: 40,
                borderRadius: 8,
                border: "none",
                cursor: "pointer",
                flexShrink: 0,
                backgroundColor: thumbPage === 0
                  ? "rgba(255,255,255,0.5)"
                  : "rgba(255,255,255,1)",
                transition: "background-color 0.3s",
              }}
            >
              <img
                src={ArrowSrc}
                alt=""
                className="h-3 w-5"
                style={{
                  transform: "rotate(180deg)",
                  filter: thumbPage === 0
                    ? "brightness(0.243)"
                    : "brightness(0) invert(67%) sepia(10%) saturate(675%) hue-rotate(358deg) brightness(89%) contrast(89%)",
                  transition: "filter 0.3s",
                }}
              />
            </button>

            {/* Page counter */}
            <span
              className="manrope-regular"
              style={{
                fontSize: "13px",
                color: "rgba(255,255,255,0.72)",
                minWidth: "40px",
                textAlign: "center",
                letterSpacing: "0.03em",
              }}
            >
              {thumbPage + 1} / {totalPages}
            </span>

            {/* Next */}
            <button
              type="button"
              onClick={handleNextPage}
              aria-label="Next page"
              className="flex items-center justify-center overflow-hidden"
              style={{
                width: 40,
                height: 40,
                borderRadius: 8,
                border: "none",
                cursor: "pointer",
                flexShrink: 0,
                backgroundColor: thumbPage >= totalPages - 1
                  ? "rgba(255,255,255,0.5)"
                  : "rgba(255,255,255,1)",
                transition: "background-color 0.3s",
              }}
            >
              <img
                src={ArrowSrc}
                alt=""
                className="h-3 w-5"
                style={{
                  filter: thumbPage >= totalPages - 1
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
