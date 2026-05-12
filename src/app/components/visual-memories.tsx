import { useState } from "react";
import type { CSSProperties } from "react";
import { Container } from "./shared/Container";
import { ModalMemories } from "./modal-memories";
import Memories1Src from "@/assets/images/memories1.svg";
import Memories2Src from "@/assets/images/memories2.svg";
import Memories3Src from "@/assets/images/memories3.svg";
import Memories4Src from "@/assets/images/memories4.svg";
import About2Src from "@/assets/images/About2.svg";
import HeroImage2Src from "@/assets/images/HeroImage2.svg";
import GalerySrc from "@/assets/icons/Galery.svg";

/*
  Desktop: 3 cols × 3 rows mosaic (md+)

  Col1        Col2            Col3
  [mem1]      [About2↕]       [HeroImg2]       row 1
  [mem2]      [About2↕]       [mem4+SeeAll↕]   row 2
  [mem3↔↔↔]                   [mem4+SeeAll↕]   row 3

  Mobile: 2-column top (mem1 + mem2 stacked left, tall About2 right) + full-width mem3 + See All overlay
*/

const GRID_H = 700;
const GAP = 10;

export function VisualMemories() {
  const [galleryOpen, setGalleryOpen] = useState(false);

  return (
    <section data-section-animate id="visual-memories" className="bg-white py-20">
      <Container>
        {/* ── Header (centered mobile, left desktop) ── */}
        <div className="mb-10 text-center md:mb-10 md:text-left">
          <p data-reveal className="monroe-regular mb-3 text-[14px] text-[rgba(50,50,50,1)] md:text-[16px]">
            — Visual Memories —
          </p>
          <h2
            data-reveal
            className="manrope-regular mb-4 text-[24px] md:text-[40px]"
            style={{
              fontWeight: 400,
              lineHeight: "140%",
              letterSpacing: "0%",
              color: "rgba(50, 50, 50, 1)",
            }}
          >
            A Glimpse of Paradise
          </h2>
          <p
            data-reveal
            className="manrope-regular mx-auto text-muted-foreground md:mx-0"
            style={{ fontSize: "16px" }}
          >
            From golden sunrises on the terrace to cozy evenings by the fireplace.
          </p>
        </div>

        {/* ── Mobile gallery ── */}
        <div data-reveal className="flex flex-col md:hidden" style={{ gap: GAP }}>
          <div
            className="grid w-full grid-cols-2 grid-rows-2"
            style={{ gap: GAP }}
          >
            <div
              className="aspect-square min-h-0 w-full overflow-hidden rounded-[1px]"
              style={{ gridColumn: 1, gridRow: 1, ...imgStyle(Memories1Src) }}
            />
            <div
              className="row-span-2 min-h-0 w-full overflow-hidden rounded-[1px]"
              style={{ gridColumn: 2, gridRow: "1 / 3", ...imgStyle(About2Src) }}
            />
            <div
              className="aspect-square min-h-0 w-full overflow-hidden rounded-[1px]"
              style={{ gridColumn: 1, gridRow: 2, ...imgStyle(Memories2Src) }}
            />
          </div>

          <button
            type="button"
            className="relative w-full overflow-hidden rounded-[1px] text-left outline-none"
            style={{ aspectRatio: "16 / 9", minHeight: "160px" }}
            onClick={() => setGalleryOpen(true)}
          >
            <div className="absolute inset-0" style={{ ...imgStyle(Memories3Src) }} />
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex items-center gap-2.5">
                <img
                  src={GalerySrc}
                  alt=""
                  style={{ width: "22px", height: "auto", filter: "brightness(0) invert(1)" }}
                />
                <span
                  className="manrope-regular"
                  style={{
                    fontSize: "14px",
                    color: "rgba(255,255,255,1)",
                    borderBottom: "1px solid rgba(255,255,255,0.7)",
                    paddingBottom: "1px",
                  }}
                >
                  See All Photos
                </span>
              </div>
            </div>
          </button>
        </div>

        {/* ── Desktop mosaic ── */}
        <div
          data-reveal
          className="hidden md:grid"
          style={{
            gridTemplateColumns: "1fr 1fr 1fr",
            gridTemplateRows: "1fr 1fr 1fr",
            gap: `${GAP}px`,
            height: `${GRID_H}px`,
          }}
        >
          <div style={{ gridColumn: "1", gridRow: "1", borderRadius: "1px", ...imgStyle(Memories1Src) }} />

          <div style={{ gridColumn: "2", gridRow: "1 / 3", borderRadius: "1px", ...imgStyle(About2Src) }} />

          <div style={{ gridColumn: "3", gridRow: "1", borderRadius: "1px", ...imgStyle(HeroImage2Src) }} />

          <div style={{ gridColumn: "1", gridRow: "2", borderRadius: "1px", ...imgStyle(Memories2Src) }} />

          <div style={{ gridColumn: "1 / 3", gridRow: "3", borderRadius: "1px", ...imgStyle(Memories3Src) }} />

          <div
            className="relative cursor-pointer overflow-hidden"
            style={{ gridColumn: "3", gridRow: "2 / 4", borderRadius: "1px" }}
            onClick={() => setGalleryOpen(true)}
          >
            <div className="absolute inset-0" style={{ ...imgStyle(Memories4Src), filter: "brightness(0.5)" }} />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex items-center gap-2.5">
                <img
                  src={GalerySrc}
                  alt=""
                  style={{ width: "22px", height: "auto", filter: "brightness(0) invert(1)" }}
                />
                <span
                  className="manrope-regular"
                  style={{
                    fontSize: "14px",
                    color: "rgba(255,255,255,1)",
                    borderBottom: "1px solid rgba(255,255,255,0.7)",
                    paddingBottom: "1px",
                  }}
                >
                  See All Photos
                </span>
              </div>
            </div>
          </div>
        </div>
      </Container>

      {galleryOpen && <ModalMemories onClose={() => setGalleryOpen(false)} />}
    </section>
  );
}

function imgStyle(src: string): CSSProperties {
  return {
    width: "100%",
    height: "100%",
    backgroundImage: `url(${src})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };
}
