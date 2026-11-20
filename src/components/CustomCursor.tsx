import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useIsTouch } from "../hooks/useIsTouch";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { useRouter } from "../hooks/useRouter";
import { useTheme } from "../hooks/useTheme";

type CursorVariant = "default" | "pointer" | "view" | "drag";

export function CustomCursor() {
  const isTouch = useIsTouch();
  const reducedMotion = useReducedMotion();
  const { pathname } = useRouter();
  const { theme } = useTheme();
  const [variant, setVariant] = useState<CursorVariant>("default");
  const [visible, setVisible] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const ringX = useSpring(mouseX, { stiffness: 300, damping: 24, mass: 0.45 });
  const ringY = useSpring(mouseY, { stiffness: 300, damping: 24, mass: 0.45 });

  const isAdminRoute = pathname.startsWith("/admin");
  const isActive = !isTouch && !reducedMotion && !isAdminRoute;

  useEffect(() => {
    setVariant("default");
  }, [pathname]);

  useEffect(() => {
    if (!isActive) {
      document.documentElement.classList.remove("custom-cursor-active");
      return;
    }

    document.documentElement.classList.add("custom-cursor-active");

    const handleMouseMove = (event: MouseEvent) => {
      mouseX.set(event.clientX);
      mouseY.set(event.clientY);
      setVisible(true);

      const target = event.target as HTMLElement | null;
      if (!target) return;

      const customTarget = target.closest<HTMLElement>("[data-cursor]");
      if (customTarget) {
        const type = customTarget.dataset.cursor as CursorVariant | undefined;
        if (type) {
          setVariant(type);
          return;
        }
      }

      const interactive = target.closest(
        "a, button, input, textarea, select, [role='button']"
      );
      if (interactive) {
        setVariant("pointer");
        return;
      }

      setVariant("default");
    };

    const handleMouseLeave = () => setVisible(false);
    const handleMouseEnter = () => setVisible(true);

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      document.documentElement.classList.remove("custom-cursor-active");
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [isActive, mouseX, mouseY]);

  if (!isActive || !visible) {
    return null;
  }

  const label =
    variant === "view" ? "View" : variant === "drag" ? "Drag" : null;
  const ringSize = label ? 72 : variant === "pointer" ? 44 : 30;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[90] overflow-hidden"
      aria-hidden="true"
    >
      <motion.div
        style={{ x: mouseX, y: mouseY }}
        className="fixed left-0 top-0 -translate-x-1/2 -translate-y-1/2"
      >
        <div
          className={`rounded-full bg-accent transition-opacity duration-150 ${
            label ? "h-0 w-0 opacity-0" : "h-2 w-2 opacity-100"
          }`}
        />
      </motion.div>

      <motion.div
        style={{ x: ringX, y: ringY }}
        animate={{
          width: ringSize,
          height: ringSize,
          backgroundColor: label
            ? "rgba(91, 61, 245, 0.94)"
            : "rgba(91, 61, 245, 0)",
          borderColor:
            variant === "pointer" || label
              ? "rgba(104, 78, 247, 0.92)"
              : theme === "dark"
                ? "rgba(244, 244, 246, 0.42)"
                : "rgba(11, 11, 15, 0.35)",
        }}
        transition={{ type: "spring", stiffness: 360, damping: 28 }}
        className="fixed left-0 top-0 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-[1.5px] text-[11px] font-semibold tracking-wider text-white"
      >
        {label && <span>{label}</span>}
      </motion.div>
    </div>
  );
}
