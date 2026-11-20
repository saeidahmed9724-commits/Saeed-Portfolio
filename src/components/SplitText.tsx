import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { cn } from "../lib/portfolioLogic";

interface SplitTextProps {
  text: string;
  highlightWords?: string[];
  className?: string;
  delay?: number;
  animateOnMount?: boolean;
  ready?: boolean;
  as?: "h1" | "h2" | "h3" | "p";
}

export function SplitText({
  text,
  highlightWords = [],
  className,
  delay = 0,
  animateOnMount = false,
  ready = true,
  as: Tag = "h2",
}: SplitTextProps) {
  const reducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLHeadingElement & HTMLParagraphElement>(null);
  const inView = useInView(containerRef, { once: true, amount: 0.05 });
  const words = text.split(" ");
  const normalizedHighlights = highlightWords.map((w) => w.toLowerCase());

  if (reducedMotion) {
    return (
      <Tag className={className}>
        {words.map((word, idx) => {
          const clean = word.replace(/[^a-zA-Z0-9-]/g, "").toLowerCase();
          const isAccent = normalizedHighlights.includes(clean);
          return (
            <span
              key={`${word}-${idx}`}
              className={cn(isAccent && "text-accent-ink")}
            >
              {word}
              {idx < words.length - 1 ? " " : ""}
            </span>
          );
        })}
      </Tag>
    );
  }

  const shouldShow = animateOnMount ? ready : inView;

  return (
    <Tag ref={containerRef} className={className}>
      {words.map((word, idx) => {
        const clean = word.replace(/[^a-zA-Z0-9-]/g, "").toLowerCase();
        const isAccent = normalizedHighlights.includes(clean);

        return (
          <span
            key={`${word}-${idx}`}
            className="inline-block overflow-hidden align-bottom pb-[0.06em]"
          >
            <motion.span
              className={cn("inline-block", isAccent && "text-accent-ink")}
              initial={{ y: "105%", opacity: 0 }}
              animate={
                shouldShow ? { y: "0%", opacity: 1 } : { y: "105%", opacity: 0 }
              }
              transition={{
                duration: 0.5,
                delay: delay + idx * 0.04,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {word}
            </motion.span>
            {idx < words.length - 1 ? "\u00A0" : ""}
          </span>
        );
      })}
    </Tag>
  );
}
