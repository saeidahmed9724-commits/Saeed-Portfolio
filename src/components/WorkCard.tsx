import { useRef, useState } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import { ArrowUpRight } from "lucide-react";
import type { Work } from "../lib/types";
import { getCategoryLabel } from "../lib/portfolioLogic";
import { useIsTouch } from "../hooks/useIsTouch";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { useRouter } from "../hooks/useRouter";
import { MediaFrame } from "./MediaFrame";

export function WorkCard({ work }: { work: Work }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isTouch = useIsTouch();
  const reducedMotion = useReducedMotion();
  const { navigate } = useRouter();
  const [hovered, setHovered] = useState(false);

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const rotateXRaw = useTransform(mouseY, [0, 1], [6, -6]);
  const rotateYRaw = useTransform(mouseX, [0, 1], [-6, 6]);

  const rotateX = useSpring(rotateXRaw, { stiffness: 280, damping: 24 });
  const rotateY = useSpring(rotateYRaw, { stiffness: 280, damping: 24 });

  const glareX = useTransform(mouseX, [0, 1], ["0%", "100%"]);
  const glareY = useTransform(mouseY, [0, 1], ["0%", "100%"]);
  const glareBackground = useMotionTemplate`radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.24), transparent 58%)`;

  const enableTilt = !isTouch && !reducedMotion;

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!enableTilt || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set((event.clientX - rect.left) / rect.width);
    mouseY.set((event.clientY - rect.top) / rect.height);
  };

  const handleMouseLeave = () => {
    setHovered(false);
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  return (
    <motion.article
      layout={!reducedMotion}
      initial={reducedMotion ? false : { opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={reducedMotion ? undefined : { opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      style={{ perspective: 1000 }}
    >
      <motion.div
        ref={cardRef}
        data-cursor="view"
        onMouseEnter={() => setHovered(true)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={
          enableTilt
            ? { rotateX, rotateY, transformStyle: "preserve-3d" }
            : undefined
        }
        className="group relative overflow-hidden rounded-3xl border border-border bg-surface p-3.5 transition-colors duration-200 hover:border-accent/35 hover:shadow-elevated"
      >
        <a
          href={`/work/${work.slug}`}
          onClick={(e) => {
            e.preventDefault();
            navigate(`/work/${work.slug}`);
          }}
          className="block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[14px] bg-accent-tint">
            <MediaFrame
              src={work.cover_image_url}
              alt={work.title}
              fallbackTitle={work.title}
              imgClassName="transition-transform duration-500 ease-out group-hover:scale-[1.04]"
            />

            {enableTilt && hovered && (
              <motion.div
                aria-hidden="true"
                style={{ background: glareBackground }}
                className="pointer-events-none absolute inset-0 z-10 opacity-80"
              />
            )}
          </div>

          <div className="mt-4 flex items-start justify-between gap-3 px-1 pb-1">
            <div className="min-w-0">
              <p className="text-xs font-medium text-muted">
                <span className="text-accent-ink">
                  {getCategoryLabel(work.category)}
                </span>
                {work.client && (
                  <>
                    <span aria-hidden="true"> · </span>
                    <span>{work.client}</span>
                  </>
                )}
                {work.year && (
                  <>
                    <span aria-hidden="true"> · </span>
                    <span className="tabular-nums">{work.year}</span>
                  </>
                )}
              </p>
              <h3 className="mt-1 line-clamp-2 font-heading text-lg sm:text-xl font-bold leading-snug tracking-tight text-foreground transition-colors group-hover:text-accent-ink">
                {work.title}
              </h3>
            </div>
            <span
              aria-hidden="true"
              className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-background text-foreground transition-colors duration-200 group-hover:border-accent group-hover:bg-accent group-hover:text-white"
            >
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </div>
        </a>
      </motion.div>
    </motion.article>
  );
}
