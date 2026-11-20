import { motion } from "motion/react";
import {
  AfterEffectsIcon,
  FigmaIcon,
  IllustratorIcon,
  PhotoshopIcon,
} from "./icons/DesignToolIcons";
import { useReducedMotion } from "../hooks/useReducedMotion";

const TOOLS = [
  { name: "Photoshop", icon: PhotoshopIcon },
  { name: "Illustrator", icon: IllustratorIcon },
  { name: "Figma", icon: FigmaIcon },
  { name: "After Effects", icon: AfterEffectsIcon },
];

export function ToolIcons() {
  const reducedMotion = useReducedMotion();

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {TOOLS.map((tool) => {
        const Icon = tool.icon;
        return (
          <motion.div
            key={tool.name}
            whileHover={reducedMotion ? undefined : { y: -3 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-3 transition-colors hover:border-accent/35"
          >
            <Icon className="h-9 w-9 shrink-0" />
            <span className="truncate text-sm font-medium text-foreground">
              {tool.name}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}
