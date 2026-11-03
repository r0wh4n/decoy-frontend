"use client";
import { ElementType, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Word-by-word masked heading reveal. Each word rises out of an overflow-hidden
// mask on scroll. Pass `accent` (lowercased, punctuation-free words) to italic-
// colour those words. useGSAP is a layout effect, so there's no flash.
export default function Reveal({
  text,
  as = "h2",
  className = "",
  accent = [],
  start = "top 82%",
  stagger = 0.06,
}: {
  text: string;
  as?: ElementType;
  className?: string;
  accent?: string[];
  start?: string;
  stagger?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const Tag = as as ElementType;
  useGSAP(
    () => {
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.from(ref.current!.querySelectorAll(".rw-word"), {
        yPercent: 115,
        duration: 0.8,
        ease: "power3.out",
        stagger,
        scrollTrigger: { trigger: ref.current, start },
      });
    },
    { scope: ref }
  );
  const clean = (w: string) => w.replace(/[.,]/g, "").toLowerCase();
  const words = text.split(" ");
  return (
    <Tag className={className} ref={ref as never}>
      {words.map((w, i) => (
        <span className="rw-mask" key={i}>
          <span className={`rw-word${accent.includes(clean(w)) ? " it" : ""}`}>{w}</span>
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </Tag>
  );
}
