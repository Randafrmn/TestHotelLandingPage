import { useState } from "react";
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
  Grid layout (3 cols × 3 rows):

  Col1        Col2            Col3
  [mem1]      [ImgDetail1↕]   [HeroImg2]       row 1
  [mem2]      [ImgDetail1↕]   [mem4+SeeAll↕]   row 2
  [mem3↔↔↔↔↔↔↔↔↔↔↔]          [mem4+SeeAll↕]   row 3
*/

const GRID_H = 700; /* total height of the photo mosaic in px */
const GAP = 10;

export function VisualMemories() {
  const [galleryOpen, setGalleryOpen] = useState(false);

  return (
    <section id="visual-memories" className="bg-white py-20">
      <Container>

        {/* ── Header (left-aligned) ── */}
        <div className="mb-10">
          <p className="monroe-regular mb-3 text-[16px] text-[rgba(50,50,50,1)]">
            — Visual Memories —
          </p>
          <h2
            className="manrope-regular mb-4"
            style={{
              fontSize: "40px",
              fontWeight: 400,
              lineHeight: "140%",
              letterSpacing: "0%",
              color: "rgba(50, 50, 50, 1)",
            }}
          >
            A Glimpse of Paradise
          </h2>
          <p className="manrope-regular text-muted-foreground" style={{ fontSize: "16px" }}>
            From golden sunrises on the terrace to cozy evenings by the fireplace.
          </p>
        </div>

        {/* ── Mosaic grid ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gridTemplateRows: `1fr 1fr 1fr`,
            gap: `${GAP}px`,
            height: `${GRID_H}px`,
          }}
        >
          {/* 1 — memories1 · col1/row1 */}
          <div style={{ gridColumn: "1", gridRow: "1", borderRadius: "1px", ...imgStyle(Memories1Src) }} />

          {/* 2 — ImageDetail1 · col2/rows1–2 (tall) */}
          <div style={{ gridColumn: "2", gridRow: "1 / 3", borderRadius: "1px", ...imgStyle(About2Src) }} />

          {/* 3 — HeroImage2 · col3/row1 */}
          <div style={{ gridColumn: "3", gridRow: "1", borderRadius: "1px", ...imgStyle(HeroImage2Src) }} />

          {/* 4 — memories2 · col1/row2 */}
          <div style={{ gridColumn: "1", gridRow: "2", borderRadius: "1px", ...imgStyle(Memories2Src) }} />

          {/* 6 — memories3 · cols1–2/row3 (wide) */}
          <div style={{ gridColumn: "1 / 3", gridRow: "3", borderRadius: "1px", ...imgStyle(Memories3Src) }} />

          {/* 7 — memories4 · col3/rows2–3 (tall) + See All Photos */}
          <div
            className="relative overflow-hidden"
            style={{ gridColumn: "3", gridRow: "2 / 4", borderRadius: "1px", cursor: "pointer" }}
            onClick={() => setGalleryOpen(true)}
          >
            {/* dimmed background */}
            <div className="absolute inset-0" style={{ ...imgStyle(Memories4Src), filter: "brightness(0.5)" }} />
            {/* overlay content */}
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

/* helper: full-size background image div */
function imgStyle(src: string): React.CSSProperties {
  return {
    width: "100%",
    height: "100%",
    backgroundImage: `url(${src})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };
}
