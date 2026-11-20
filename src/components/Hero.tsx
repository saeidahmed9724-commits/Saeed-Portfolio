import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { siteConfig } from "../config/site";
import type { Work } from "../lib/types";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { useRouter } from "../hooks/useRouter";
import { FloatingCards } from "./FloatingCards";
import { MagneticButton } from "./MagneticButton";
import { SplitText } from "./SplitText";

export function Hero({ works }: { works: Work[] }) {
  const { scrollToTarget } = useRouter();
  const reducedMotion = useReducedMotion();
  const [preloaderDone, setPreloaderDone] = useState(() => {
    if (typeof window === "undefined") return true;
    const params = new URLSearchParams(window.location.search);
    return (
      params.get("autostart") === "1" ||
      sessionStorage.getItem("saeed_preloader_done") === "1"
    );
  });

  useEffect(() => {
    if (reducedMotion || preloaderDone) {
      setPreloaderDone(true);
      return;
    }

    const handleComplete = () => setPreloaderDone(true);
    window.addEventListener("preloader:complete", handleComplete);
    const fallbackTimer = window.setTimeout(() => setPreloaderDone(true), 1600);
    return () => {
      window.removeEventListener("preloader:complete", handleComplete);
      window.clearTimeout(fallbackTimer);
    };
  }, [reducedMotion, preloaderDone]);

  return (
    <section
      id="hero"
      className="relative overflow-hidden pt-28 pb-16 sm:pt-34 sm:pb-22 lg:pt-38 lg:pb-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <motion.p
              initial={reducedMotion ? false : { opacity: 0, y: 10 }}
              animate={preloaderDone ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.45, delay: 0.04 }}
              className="text-sm font-medium text-accent-ink"
            >
              {siteConfig.hero.availabilityText}
            </motion.p>

            <SplitText
              text="I design scroll-stopping social media content"
              highlightWords={["scroll-stopping", "social", "media"]}
              as="h1"
              animateOnMount
              ready={preloaderDone}
              delay={0.1}
              className="mt-4 max-w-2xl font-heading text-4xl sm:text-5xl xl:text-[3.75rem] font-bold tracking-tight text-foreground leading-[1.06]"
            />

            <motion.p
              initial={reducedMotion ? false : { opacity: 0, y: 14 }}
              animate={preloaderDone ? { opacity: 1, y: 0 } : undefined}
              transition={{
                duration: 0.5,
                delay: 0.35,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="mt-6 max-w-xl text-base sm:text-[17px] text-muted leading-relaxed"
            >
              {siteConfig.hero.subline}
            </motion.p>

            <motion.div
              initial={reducedMotion ? false : { opacity: 0, y: 14 }}
              animate={preloaderDone ? { opacity: 1, y: 0 } : undefined}
              transition={{
                duration: 0.5,
                delay: 0.45,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="mt-8 flex flex-wrap items-center gap-4"
            >
              <MagneticButton
                href="#work"
                onClick={() => scrollToTarget("#work", -88)}
                className="gap-2 rounded-full bg-accent px-7 py-3.5 text-sm sm:text-base font-semibold text-white shadow-accent transition-colors hover:bg-accent-dark"
              >
                {siteConfig.hero.primaryCta}
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </MagneticButton>

              <MagneticButton
                href="#contact"
                onClick={() => scrollToTarget("#contact", -88)}
                className="gap-2 rounded-full border border-border bg-surface px-7 py-3.5 text-sm sm:text-base font-semibold text-foreground transition-colors hover:border-accent/40 hover:text-accent-ink"
              >
                {siteConfig.hero.secondaryCta}
              </MagneticButton>
            </motion.div>
          </div>

          <div className="lg:col-span-5">
            <FloatingCards ready={preloaderDone} works={works} />
          </div>
        </div>

        {/* Full-width footer row below Hero split */}
        <motion.div
          initial={reducedMotion ? false : { opacity: 0 }}
          animate={preloaderDone ? { opacity: 1 } : undefined}
          transition={{ delay: 0.65, duration: 0.45 }}
          className="mt-14 hidden items-center justify-between border-t border-border pt-6 text-xs font-medium text-muted sm:flex"
        >
          <span>
            {siteConfig.role} · {siteConfig.location}
          </span>
          <button
            type="button"
            onClick={() => scrollToTarget("#work", -88)}
            className="inline-flex items-center gap-2 font-semibold text-foreground transition-colors hover:text-accent-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-md px-1 py-0.5"
          >
            Scroll to explore
            <ArrowDown className="h-3.5 w-3.5 text-accent-ink" aria-hidden="true" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
