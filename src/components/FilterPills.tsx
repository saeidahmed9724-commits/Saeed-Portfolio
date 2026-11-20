import { motion } from "motion/react";
import type { WorkFilter } from "../lib/types";
import { cn } from "../lib/portfolioLogic";
import { useReducedMotion } from "../hooks/useReducedMotion";

const FILTERS: { value: WorkFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "carousels", label: "Carousels" },
  { value: "ad-creatives", label: "Ad Creatives" },
  { value: "brand-content", label: "Brand Content" },
];

interface FilterPillsProps {
  activeFilter: WorkFilter;
  onChange: (filter: WorkFilter) => void;
}

export function FilterPills({ activeFilter, onChange }: FilterPillsProps) {
  const reducedMotion = useReducedMotion();

  return (
    <div
      role="tablist"
      aria-label="Filter projects by category"
      className="inline-flex flex-wrap items-center gap-1 rounded-xl border border-border bg-surface p-1"
    >
      {FILTERS.map((filter) => {
        const isActive = activeFilter === filter.value;
        return (
          <button
            key={filter.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(filter.value)}
            className={cn(
              "relative shrink-0 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
              isActive ? "text-white" : "text-muted hover:text-foreground"
            )}
          >
            {isActive && (
              <motion.span
                layoutId="activeFilterTab"
                transition={
                  reducedMotion
                    ? { duration: 0 }
                    : { type: "spring", stiffness: 420, damping: 32 }
                }
                className="absolute inset-0 rounded-lg bg-accent"
              />
            )}
            <span className="relative z-10">{filter.label}</span>
          </button>
        );
      })}
    </div>
  );
}
