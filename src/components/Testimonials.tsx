import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Quote } from "lucide-react";
import { siteConfig } from "../config/site";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { Reveal, RevealItem } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

export function Testimonials() {
  const items = siteConfig.testimonials.items;
  const reducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (reducedMotion || items.length <= 1) return;
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % items.length);
    }, 5500);
    return () => window.clearInterval(timer);
  }, [reducedMotion, items.length]);

  const currentItem = items[activeIndex];

  return (
    <section
      id="testimonials"
      className="border-y border-border bg-surface py-20 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={siteConfig.testimonials.eyebrow}
          heading={siteConfig.testimonials.heading}
          align="center"
        />

        {/* Desktop 3-column grid */}
        <Reveal
          staggerChildren={0.08}
          className="mt-12 hidden gap-6 md:grid md:grid-cols-3"
        >
          {items.map((item) => (
            <RevealItem key={item.id}>
              <article className="flex h-full flex-col justify-between rounded-3xl border border-border bg-background p-7">
                <div>
                  <Quote
                    className="h-6 w-6 text-accent-ink/55"
                    aria-hidden="true"
                  />
                  <p className="mt-4 text-base leading-relaxed text-foreground/90">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-3 border-t border-border pt-5">
                  <div
                    aria-hidden="true"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-tint font-heading text-xs font-bold text-accent-ink"
                  >
                    {item.initials}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-heading text-sm font-bold text-foreground">
                      {item.name}
                    </p>
                    <p className="truncate text-xs text-muted">
                      {item.role} · {item.company}
                    </p>
                  </div>
                </div>
              </article>
            </RevealItem>
          ))}
        </Reveal>

        {/* Mobile carousel */}
        <div className="mt-10 md:hidden">
          <div className="relative min-h-[240px] overflow-hidden rounded-3xl border border-border bg-background p-6">
            <AnimatePresence mode="wait">
              {currentItem && (
                <motion.article
                  key={currentItem.id}
                  initial={reducedMotion ? false : { opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={reducedMotion ? undefined : { opacity: 0, x: -16 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col justify-between"
                >
                  <div>
                    <Quote
                      className="h-6 w-6 text-accent-ink/55"
                      aria-hidden="true"
                    />
                    <p className="mt-3 text-base leading-relaxed text-foreground/90">
                      &ldquo;{currentItem.quote}&rdquo;
                    </p>
                  </div>
                  <div className="mt-6 flex items-center gap-3 border-t border-border pt-4">
                    <div
                      aria-hidden="true"
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-tint font-heading text-xs font-bold text-accent-ink"
                    >
                      {currentItem.initials}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-heading text-sm font-bold text-foreground">
                        {currentItem.name}
                      </p>
                      <p className="truncate text-xs text-muted">
                        {currentItem.role} · {currentItem.company}
                      </p>
                    </div>
                  </div>
                </motion.article>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-4 flex items-center justify-center gap-2">
            {items.map((item, idx) => (
              <button
                key={item.id}
                type="button"
                aria-label={`View testimonial from ${item.name}`}
                onClick={() => setActiveIndex(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === activeIndex ? "w-6 bg-accent" : "w-2 bg-border"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
