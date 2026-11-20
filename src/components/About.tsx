import { useEffect, useRef, useState } from "react";
import { motion, useInView, useScroll, useTransform } from "motion/react";
import { siteConfig } from "../config/site";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { MediaFrame } from "./MediaFrame";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { SkillBars } from "./SkillBars";
import { ToolIcons } from "./ToolIcons";

function CountUpStat({
  value,
  suffix,
  label,
  context,
}: {
  value: number;
  suffix: string;
  label: string;
  context: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });
  const reducedMotion = useReducedMotion();
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (!inView || reducedMotion) {
      setDisplay(value);
      return;
    }

    const duration = 800;
    const start = performance.now();
    let rafId = 0;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));
      if (progress < 1) {
        rafId = window.requestAnimationFrame(tick);
      }
    };

    rafId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(rafId);
  }, [inView, value, reducedMotion]);

  return (
    <div
      ref={ref}
      className="border-t border-border pt-4"
    >
      <p className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-foreground tabular-nums">
        {display}
        <span className="text-accent-ink">{suffix}</span>
      </p>
      <p className="mt-1 text-sm font-semibold text-foreground">{label}</p>
      <p className="mt-0.5 text-xs text-muted">{context}</p>
    </div>
  );
}

export function About() {
  const portraitRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: portraitRef,
    offset: ["start end", "end start"],
  });
  const portraitY = useTransform(scrollYProgress, [0, 1], [-18, 18]);

  return (
    <section
      id="about"
      className="border-y border-border bg-surface py-20 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Portrait */}
          <div className="lg:col-span-5">
            <Reveal>
              <div
                ref={portraitRef}
                className="overflow-hidden rounded-3xl border border-border bg-background p-3"
              >
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[16px] bg-accent-tint">
                  <motion.div
                    style={reducedMotion ? undefined : { y: portraitY }}
                    className="relative -top-[5%] h-[110%] w-full"
                  >
                    <MediaFrame
                      src={siteConfig.about.portraitImage}
                      alt={siteConfig.about.portraitAlt}
                      fallbackTitle={siteConfig.name}
                    />
                  </motion.div>
                </div>
                <div className="mt-3 flex items-center justify-between px-2 pb-1 text-xs font-medium text-muted">
                  <span className="text-foreground">{siteConfig.location}</span>
                  <span className="text-accent-ink">{siteConfig.role}</span>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Bio, Stats, Skills, Tools */}
          <div className="space-y-10 lg:col-span-7">
            <SectionHeading
              eyebrow={siteConfig.about.eyebrow}
              heading={siteConfig.about.heading}
            />

            <Reveal delay={0.08} className="space-y-4">
              {siteConfig.about.bio.map((paragraph, idx) => (
                <p
                  key={idx}
                  className="text-base sm:text-[17px] leading-relaxed text-muted"
                >
                  {paragraph}
                </p>
              ))}
            </Reveal>

            <Reveal delay={0.12}>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                {siteConfig.about.stats.map((stat) => (
                  <CountUpStat
                    key={stat.label}
                    value={stat.value}
                    suffix={stat.suffix}
                    label={stat.label}
                    context={stat.context}
                  />
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.16}>
              <div className="border-t border-border pt-8">
                <h3 className="mb-5 font-heading text-lg font-bold text-foreground">
                  Core Specialties
                </h3>
                <SkillBars />
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="border-t border-border pt-8">
                <h3 className="mb-4 font-heading text-sm font-semibold text-muted">
                  Daily Toolkit
                </h3>
                <ToolIcons />
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
