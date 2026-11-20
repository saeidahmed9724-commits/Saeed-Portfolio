import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { siteConfig } from "../config/site";

const SESSION_KEY = "saeed_preloader_done";

export function Preloader() {
  const reducedMotion = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const autostart = params.get("autostart") === "1";
    const isSubRoute = window.location.pathname.startsWith("/admin");
    const alreadySeen = sessionStorage.getItem(SESSION_KEY) === "1";

    if (autostart || isSubRoute || alreadySeen || reducedMotion) {
      sessionStorage.setItem(SESSION_KEY, "1");
      window.dispatchEvent(new CustomEvent("preloader:complete"));
      return;
    }

    setVisible(true);
    let current = 0;
    const interval = window.setInterval(() => {
      current += Math.floor(Math.random() * 18) + 14;
      if (current >= 100) {
        current = 100;
        setProgress(100);
        window.clearInterval(interval);
        window.setTimeout(() => {
          sessionStorage.setItem(SESSION_KEY, "1");
          setVisible(false);
          window.dispatchEvent(new CustomEvent("preloader:complete"));
        }, 220);
      } else {
        setProgress(current);
      }
    }, 45);

    return () => {
      window.clearInterval(interval);
    };
  }, [reducedMotion]);

  const letters = siteConfig.name.split("");

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="preloader"
          initial={{ y: "0%" }}
          exit={{
            y: "-100%",
            transition: { duration: 0.65, ease: [0.76, 0, 0.24, 1] },
          }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-between bg-[#0B0B0F] px-6 py-12 text-[#FAFAF7]"
          aria-live="polite"
          aria-label="Loading portfolio"
        >
          <div className="flex w-full max-w-7xl items-center justify-between text-xs tracking-wider text-white/65">
            <span>{siteConfig.role}</span>
            <span>{siteConfig.location}</span>
          </div>

          <div className="flex flex-col items-center gap-6">
            <div className="overflow-hidden">
              <p className="flex font-heading text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight">
                {letters.map((char, idx) => (
                  <motion.span
                    key={`${char}-${idx}`}
                    initial={{ y: "100%", opacity: 0 }}
                    animate={{ y: "0%", opacity: 1 }}
                    transition={{
                      duration: 0.4,
                      delay: idx * 0.025,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className={char === " " ? "w-3 sm:w-4" : "inline-block"}
                  >
                    {char}
                  </motion.span>
                ))}
              </p>
            </div>
            <div className="h-[2px] w-48 sm:w-64 overflow-hidden rounded-full bg-white/15">
              <div
                className="h-full bg-accent transition-all duration-100"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="flex w-full max-w-7xl items-end justify-between">
            <span className="text-xs tracking-wider text-white/55">
              Selected Portfolio · 2026
            </span>
            <span className="font-heading text-5xl sm:text-7xl font-bold tabular-nums tracking-tighter text-[#FAFAF7]">
              {String(progress).padStart(3, "0")}%
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
