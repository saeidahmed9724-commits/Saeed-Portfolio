import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { siteConfig } from "../config/site";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { useRouter } from "../hooks/useRouter";
import { MediaFrame } from "./MediaFrame";

export function FloatingCards({ ready }: { ready: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const { navigate } = useRouter();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const yCard1 = useTransform(scrollYProgress, [0, 1], [0, -52]);
  const yCard2 = useTransform(scrollYProgress, [0, 1], [0, -84]);
  const yCard3 = useTransform(scrollYProgress, [0, 1], [0, -34]);

  const cards = siteConfig.hero.floatingCards;

  return (
    <div
      ref={containerRef}
      className="relative mx-auto mt-8 h-[390px] w-full max-w-lg sm:h-[450px] lg:mt-0 lg:h-[500px]"
    >
      {/* Subtle architectural accent glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 sm:h-88 sm:w-88 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/15 blur-3xl"
      />

      {/* Card 1: Back Left */}
      {cards[0] && (
        <motion.div
          style={reducedMotion ? undefined : { y: yCard1 }}
          initial={reducedMotion ? false : { opacity: 0, scale: 0.94, rotate: -6 }}
          animate={ready ? { opacity: 1, scale: 1, rotate: -6 } : undefined}
          transition={{ duration: 0.65, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="absolute left-2 top-6 w-36 sm:left-0 sm:w-52"
        >
          <a
            href={`/work/${cards[0].slug}`}
            onClick={(e) => {
              e.preventDefault();
              navigate(`/work/${cards[0].slug}`);
            }}
            data-cursor="view"
            className="block overflow-hidden rounded-3xl border border-border bg-surface p-2.5 shadow-elevated transition-transform duration-200 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[18px] bg-accent-tint">
              <MediaFrame
                src={cards[0].image}
                alt={cards[0].title}
                loading="eager"
              />
            </div>
            <div className="mt-2.5 px-1 pb-1">
              <p className="text-[11px] font-medium text-accent-ink">
                {cards[0].tag}
              </p>
              <p className="mt-0.5 truncate text-xs font-semibold text-foreground">
                {cards[0].title}
              </p>
            </div>
          </a>
        </motion.div>
      )}

      {/* Card 2: Front Center */}
      {cards[1] && (
        <motion.div
          style={reducedMotion ? undefined : { y: yCard2 }}
          initial={reducedMotion ? false : { opacity: 0, scale: 0.92, y: 20 }}
          animate={ready ? { opacity: 1, scale: 1, y: 0 } : undefined}
          transition={{ duration: 0.7, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
          className="absolute left-1/2 top-14 z-20 w-44 -translate-x-1/2 sm:w-58"
        >
          <a
            href={`/work/${cards[1].slug}`}
            onClick={(e) => {
              e.preventDefault();
              navigate(`/work/${cards[1].slug}`);
            }}
            data-cursor="view"
            className="block overflow-hidden rounded-3xl border border-accent/20 bg-surface p-3 shadow-elevated transition-transform duration-200 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[16px] bg-accent-tint">
              <MediaFrame
                src={cards[1].image}
                alt={cards[1].title}
                loading="eager"
              />
            </div>
            <div className="mt-3 px-1 pb-0.5">
              <p className="text-[11px] font-medium text-accent-ink">
                {cards[1].tag}
              </p>
              <p className="mt-0.5 truncate text-sm font-semibold text-foreground">
                {cards[1].title}
              </p>
            </div>
          </a>
        </motion.div>
      )}

      {/* Card 3: Back Right */}
      {cards[2] && (
        <motion.div
          style={reducedMotion ? undefined : { y: yCard3 }}
          initial={reducedMotion ? false : { opacity: 0, scale: 0.94, rotate: 6 }}
          animate={ready ? { opacity: 1, scale: 1, rotate: 6 } : undefined}
          transition={{ duration: 0.65, delay: 0.44, ease: [0.16, 1, 0.3, 1] }}
          className="absolute right-2 bottom-4 z-10 w-36 sm:right-0 sm:w-50"
        >
          <a
            href={`/work/${cards[2].slug}`}
            onClick={(e) => {
              e.preventDefault();
              navigate(`/work/${cards[2].slug}`);
            }}
            data-cursor="view"
            className="block overflow-hidden rounded-3xl border border-border bg-surface p-2.5 shadow-elevated transition-transform duration-200 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[18px] bg-accent-tint">
              <MediaFrame
                src={cards[2].image}
                alt={cards[2].title}
                loading="eager"
              />
            </div>
            <div className="mt-2.5 px-1 pb-1">
              <p className="text-[11px] font-medium text-accent-ink">
                {cards[2].tag}
              </p>
              <p className="mt-0.5 truncate text-xs font-semibold text-foreground">
                {cards[2].title}
              </p>
            </div>
          </a>
        </motion.div>
      )}
    </div>
  );
}
