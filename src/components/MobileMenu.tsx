import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, X } from "lucide-react";
import { siteConfig } from "../config/site";
import { useReducedMotion } from "../hooks/useReducedMotion";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  onNavigate: (href: string) => void;
}

export function MobileMenu({ open, onClose, onNavigate }: MobileMenuProps) {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation menu"
          initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: "-100%" }}
          animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: "0%" }}
          exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: "-100%" }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-50 flex flex-col justify-between bg-[#0B0B0F] px-6 py-8 text-[#FAFAF7] md:hidden"
        >
          <div className="flex items-center justify-between">
            <span className="font-heading text-2xl font-bold tracking-tight">
              {siteConfig.brandMark}
            </span>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close navigation menu"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-[#FAFAF7] transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav
            aria-label="Mobile primary navigation"
            className="flex flex-col gap-5"
          >
            {siteConfig.navLinks.map((link, idx) => (
              <motion.button
                key={link.href}
                type="button"
                initial={reducedMotion ? undefined : { opacity: 0, x: -16 }}
                animate={reducedMotion ? undefined : { opacity: 1, x: 0 }}
                transition={{ delay: 0.08 + idx * 0.05 }}
                onClick={() => {
                  onClose();
                  onNavigate(link.href);
                }}
                className="text-left font-heading text-4xl font-bold tracking-tight text-[#FAFAF7] transition-colors hover:text-accent-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                {link.label}
              </motion.button>
            ))}

            <button
              type="button"
              onClick={() => {
                onClose();
                onNavigate("#contact");
              }}
              className="mt-4 inline-flex w-fit items-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-semibold text-white shadow-accent"
            >
              Hire me <ArrowUpRight className="h-4 w-4" />
            </button>
          </nav>

          <div className="flex flex-wrap gap-5 border-t border-white/15 pt-6 text-sm text-white/70">
            {siteConfig.socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-white"
              >
                {social.label}
              </a>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
