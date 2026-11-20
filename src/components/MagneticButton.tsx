import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useIsTouch } from "../hooks/useIsTouch";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { cn } from "../lib/portfolioLogic";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  strength?: number;
  onClick?: () => void;
  href?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  ariaLabel?: string;
}

export function MagneticButton({
  children,
  className,
  strength = 0.24,
  onClick,
  href,
  type = "button",
  disabled = false,
  ariaLabel,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isTouch = useIsTouch();
  const reducedMotion = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 320, damping: 22, mass: 0.2 });
  const springY = useSpring(y, { stiffness: 320, damping: 22, mass: 0.2 });

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (isTouch || reducedMotion || disabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((event.clientX - centerX) * strength);
    y.set((event.clientY - centerY) * strength);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const sharedClasses = cn(
    "inline-flex items-center justify-center whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
    className
  );

  const content = href ? (
    <a
      href={href}
      onClick={(e) => {
        if (onClick) {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label={ariaLabel}
      className={sharedClasses}
    >
      {children}
    </a>
  ) : (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={sharedClasses}
    >
      {children}
    </button>
  );

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={isTouch || reducedMotion ? undefined : { x: springX, y: springY }}
      className="inline-block"
    >
      {content}
    </motion.div>
  );
}
