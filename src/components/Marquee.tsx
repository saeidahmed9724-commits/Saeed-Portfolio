import { useRef, useState } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import { siteConfig } from "../config/site";
import { useReducedMotion } from "../hooks/useReducedMotion";

function MarqueeRow({
  baseVelocity,
  paused,
  accent = false,
}: {
  baseVelocity: number;
  paused: boolean;
  accent?: boolean;
}) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 3.5], {
    clamp: false,
  });

  const directionFactor = useRef<number>(1);

  useAnimationFrame((_, delta) => {
    if (paused) return;

    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);
    const v = velocityFactor.get();
    if (v < 0) {
      directionFactor.current = -1;
    } else if (v > 0) {
      directionFactor.current = 1;
    }

    moveBy += directionFactor.current * moveBy * Math.min(Math.abs(v), 4);
    let next = baseX.get() + moveBy;

    if (next <= -50) {
      next = 0;
    } else if (next >= 0) {
      next = -50;
    }

    baseX.set(next);
  });

  const x = useTransform(baseX, (val) => `${val}%`);
  const items = [
    ...siteConfig.marqueeItems,
    ...siteConfig.marqueeItems,
    ...siteConfig.marqueeItems,
    ...siteConfig.marqueeItems,
  ];

  return (
    <div className="overflow-hidden whitespace-nowrap py-1.5">
      <motion.div
        style={{ x }}
        className="inline-flex items-center gap-6 will-change-transform"
      >
        {items.map((item, idx) => (
          <span
            key={`${item}-${idx}`}
            className={`inline-flex items-center gap-6 font-heading text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight ${
              accent ? "text-accent-ink" : "text-foreground"
            }`}
          >
            <span>{item}</span>
            <span className="text-accent-ink/70" aria-hidden="true">
              ·
            </span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export function Marquee() {
  const reducedMotion = useReducedMotion();
  const [paused, setPaused] = useState(false);

  if (reducedMotion) {
    return (
      <section
        aria-label="Specialties marquee"
        className="border-y border-border bg-surface py-6"
      >
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-6 px-4 text-center sm:px-6 lg:px-8">
          {siteConfig.marqueeItems.map((item, idx) => (
            <span
              key={item}
              className="font-heading text-xl sm:text-2xl font-bold text-foreground"
            >
              {item}
              {idx < siteConfig.marqueeItems.length - 1 && (
                <span className="ml-6 text-accent-ink" aria-hidden="true">
                  ·
                </span>
              )}
            </span>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      aria-label="Specialties marquee"
      data-cursor="drag"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="select-none overflow-hidden border-y border-border bg-surface py-6"
    >
      <MarqueeRow baseVelocity={-3.2} paused={paused} />
      <MarqueeRow baseVelocity={3.2} paused={paused} accent />
    </section>
  );
}
