import { motion } from "motion/react";
import { siteConfig } from "../config/site";
import { useReducedMotion } from "../hooks/useReducedMotion";

export function SkillBars() {
  const reducedMotion = useReducedMotion();

  return (
    <div className="space-y-4">
      {siteConfig.about.skills.map((skill, idx) => (
        <div key={skill.name}>
          <div className="flex items-center justify-between text-sm font-medium">
            <span className="text-foreground">{skill.name}</span>
            <span className="font-mono text-xs tabular-nums text-muted">
              {skill.level}%
            </span>
          </div>
          <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-border">
            <motion.div
              initial={
                reducedMotion
                  ? { scaleX: skill.level / 100 }
                  : { scaleX: 0 }
              }
              whileInView={{ scaleX: skill.level / 100 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{
                duration: reducedMotion ? 0 : 0.75,
                delay: reducedMotion ? 0 : idx * 0.06,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{ transformOrigin: "left" }}
              className="h-full w-full rounded-full bg-accent"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
