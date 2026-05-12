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
  const [openIdx, setOpenIdx] = useState(0);

  return (
    <section
      id="faq"
      className="py-20"
      style={{ backgroundColor: "rgba(244, 243, 240, 1)" }}
    >
      <Container>
        <div className="flex gap-14 items-start">

          {/* ── Left: heading + image ── */}
          <div className="flex flex-col" style={{ flex: 1, minWidth: 0 }}>
            <h2
              className="manrope-regular mb-4"
              style={{
                fontSize: "40px",
                fontWeight: 400,
                lineHeight: "140%",
                letterSpacing: "0%",
                color: "rgba(50,50,50,1)",
              }}
            >
              Frequently Asked Questions
            </h2>
            <p
              className="manrope-regular mb-8"
              style={{ fontSize: "16px", lineHeight: "150%", color: "rgba(50,50,50,0.7)" }}
            >
              Answers to the most common questions, so you can focus on enjoying
              your time with us.
            </p>           
            <div
              className="overflow-hidden"
              style={{ borderRadius: "1px", width: "100%" }}
            >
              <img
                src={QnASrc}
                alt="Hotel interior"
                draggable={false}
                className="w-full h-full object-cover"
                style={{ display: "block" }}
              />
            </div>
          </div>

          {/* ── Right: accordion ── */}
          <div className="flex flex-col gap-6" style={{ flex: 1, minWidth: 0 }}>
            {FAQS.map((item, i) => {
              const isOpen = openIdx === i;
              return (
                <div
                  key={i}
                  className="overflow-hidden"
                  style={{
                    backgroundColor: "rgba(255,255,255,1)",
                    borderRadius: "8px",
                  }}
                >
                  {/* Question row */}
                  <button
                    type="button"
                    onClick={() => setOpenIdx(isOpen ? -1 : i)}
                    className="manrope-regular w-full flex items-center justify-between text-left"
                    style={{
                      padding: "18px 20px",
                      fontSize: "15px",
                      fontWeight: 400,
                      color: "rgba(50,50,50,1)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    <span>{item.q}</span>
                    <img
                      src={ArrowDownSrc}
                      alt=""
                      style={{
                        width: "18px",
                        height: "auto",
                        flexShrink: 0,
                        marginLeft: "16px",
                        filter:
                          "brightness(0) invert(67%) sepia(10%) saturate(675%) hue-rotate(358deg) brightness(89%) contrast(89%)",
                        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.35s cubic-bezier(0.4,0,0.2,1)",
                      }}
                    />
                  </button>

                  {/* Answer — smooth expand/collapse via max-height */}
                  <div
                    style={{
                      maxHeight: isOpen ? "300px" : "0px",
                      overflow: "hidden",
                      transition: "max-height 0.35s cubic-bezier(0.4,0,0.2,1)",
                    }}
                  >
                    <p
                      className="manrope-regular"
                      style={{
                        padding: "0 20px 18px",
                        fontSize: "14px",
                        lineHeight: "165%",
                        color: "rgba(50,50,50,0.8)",
                      }}
                    >
                      {item.a}
                    </p>
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
