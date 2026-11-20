import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { WorkImage } from "../lib/types";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { MediaFrame } from "./MediaFrame";

interface LightboxProps {
  images: WorkImage[];
  activeIndex: number | null;
  onClose: () => void;
  onChangeIndex: (index: number) => void;
}

export function Lightbox({
  images,
  activeIndex,
  onClose,
  onChangeIndex,
}: LightboxProps) {
  const reducedMotion = useReducedMotion();
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const isOpen = activeIndex !== null && images[activeIndex] !== undefined;

  useEffect(() => {
    if (!isOpen || activeIndex === null) return;

    closeBtnRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key === "ArrowRight") {
        onChangeIndex((activeIndex + 1) % images.length);
        return;
      }
      if (event.key === "ArrowLeft") {
        onChangeIndex((activeIndex - 1 + images.length) % images.length);
        return;
      }

      if (event.key === "Tab" && dialogRef.current) {
        const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, activeIndex, images.length, onClose, onChangeIndex]);

  const currentImage = activeIndex !== null ? images[activeIndex] : null;

  return (
    <AnimatePresence>
      {isOpen && currentImage && activeIndex !== null && (
        <motion.div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox viewer"
          initial={reducedMotion ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-[#09090D]/95 p-4 sm:p-8 backdrop-blur-md"
          onClick={onClose}
        >
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            aria-label="Close lightbox"
            className="absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent sm:right-8 sm:top-8"
          >
            <X className="h-5 w-5" />
          </button>

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onChangeIndex(
                    (activeIndex - 1 + images.length) % images.length
                  );
                }}
                aria-label="Previous image"
                className="absolute left-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent sm:left-8"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onChangeIndex((activeIndex + 1) % images.length);
                }}
                aria-label="Next image"
                className="absolute right-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent sm:right-8"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}

          <motion.div
            key={currentImage.id}
            onClick={(e) => e.stopPropagation()}
            initial={reducedMotion ? false : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="relative max-h-[84vh] w-full max-w-4xl overflow-hidden rounded-3xl bg-black/50"
          >
            <div className="flex h-[70vh] w-full items-center justify-center p-4 sm:h-[76vh]">
              <MediaFrame
                src={currentImage.image_url}
                alt={currentImage.alt || "Project frame"}
                imgClassName="max-h-full w-auto object-contain rounded-xl"
                className="h-full w-full"
              />
            </div>
            <div className="flex items-center justify-between border-t border-white/10 bg-[#0B0B0F]/95 px-5 py-3 text-xs sm:text-sm text-white/85">
              <span className="truncate">
                {currentImage.alt || "Case study frame"}
              </span>
              <span className="ml-4 shrink-0 font-mono tabular-nums text-white/65">
                {activeIndex + 1} / {images.length}
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
