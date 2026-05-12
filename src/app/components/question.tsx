import { useState } from "react";
import { Container } from "./shared/Container";
import QnASrc from "@/assets/images/qna.svg";
import ArrowDownSrc from "@/assets/icons/ArrowDown.svg";

const FAQS = [
  {
    q: "What is the check-in and check-out time?",
    a: "Check-in is from 3:00 PM, and check-out is until 11:00 AM.",
  },
  {
    q: "Is the hotel pet-friendly?",
    a: "We welcome well-behaved pets in selected rooms. Please inform us at the time of booking so we can prepare accordingly.",
  },
  {
    q: "Do you offer shuttle services?",
    a: "Yes, we offer complimentary shuttle service to and from the nearest train station. Private transfers to the airport can be arranged upon request.",
  },
  {
    q: "Are lift passes included in the price?",
    a: "Lift passes are not included in the room rate but can be added as part of our ski packages at a discounted rate.",
  },
  {
    q: "Is there a vegan option in the restaurant?",
    a: "Absolutely. Our kitchen embraces local and seasonal ingredients and offers a dedicated plant-based menu for every meal.",
  },
];

export function Question() {
  const [openSet, setOpenSet] = useState<Set<number>>(() => new Set([0]));

  return (
    <section
      data-section-animate
      id="faq"
      className="py-20"
      style={{ backgroundColor: "rgba(244, 243, 240, 1)" }}
    >
      <Container>
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:gap-14">
          {/* ── Title + description + image (vertical; design: image between copy and FAQ) ── */}
          <div className="flex min-w-0 flex-col gap-6 text-center md:flex-1 md:gap-8 md:text-left">
            <h2
              data-reveal
              className="manrope-regular"
              style={{
                fontSize: "clamp(24px, 5vw, 40px)",
                fontWeight: 400,
                lineHeight: "140%",
                letterSpacing: "0%",
                color: "rgba(50,50,50,1)",
              }}
            >
              Frequently Asked Questions
            </h2>
            <p
              data-reveal
              className="manrope-regular mx-auto md:mx-0"
              style={{ fontSize: "16px", lineHeight: "150%", color: "rgba(50,50,50,0.7)" }}
            >
              Answers to the most common questions, so you can focus on enjoying
              your time with us.
            </p>
            <div data-reveal className="w-full overflow-hidden rounded-[1px] bg-[rgba(50,50,50,0.04)]">
              <img
                src={QnASrc}
                alt="Hotel interior"
                draggable={false}
                className="block aspect-[16/10] h-auto w-full object-cover md:aspect-auto md:max-h-[min(360px,50vh)] md:w-full md:object-cover"
              />
            </div>
          </div>

          {/* ── Accordion — stacked cards below image on mobile, right column on desktop ── */}
          <div data-reveal className="flex min-w-0 w-full flex-col gap-4 md:flex-1 md:gap-5">
            {FAQS.map((item, i) => {
              const isOpen = openSet.has(i);
              return (
                <div
                  key={i}
                  className="overflow-hidden bg-white shadow-sm"
                  style={{ borderRadius: "8px" }}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setOpenSet((prev) => {
                        const next = new Set(prev);
                        if (next.has(i)) next.delete(i);
                        else next.add(i);
                        return next;
                      });
                    }}
                    className="manrope-regular flex w-full items-start justify-between gap-4 text-left"
                    style={{
                      padding: "20px 22px",
                      fontSize: "15px",
                      fontWeight: 400,
                      color: "rgba(50,50,50,1)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    <span className="min-w-0 flex-1 leading-snug">{item.q}</span>
                    <img
                      src={ArrowDownSrc}
                      alt=""
                      className="mt-0.5 flex-shrink-0"
                      style={{
                        width: "18px",
                        height: "auto",
                        filter:
                          "brightness(0) invert(67%) sepia(10%) saturate(675%) hue-rotate(358deg) brightness(89%) contrast(89%)",
                        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.35s cubic-bezier(0.4,0,0.2,1)",
                      }}
                    />
                  </button>

                  <div
                    className="grid ease-out motion-reduce:transition-none"
                    style={{
                      gridTemplateRows: isOpen ? "1fr" : "0fr",
                      transition: "grid-template-rows 0.35s cubic-bezier(0.4,0,0.2,1)",
                    }}
                  >
                    <div className="min-h-0 overflow-hidden">
                      <p
                        className="manrope-regular"
                        style={{
                          padding: "0 22px 20px",
                          marginTop: "-4px",
                          fontSize: "14px",
                          lineHeight: "165%",
                          color: "rgba(50,50,50,0.8)",
                        }}
                      >
                        {item.a}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
