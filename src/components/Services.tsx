import { motion } from "motion/react";
import { Check, Layers, LayoutTemplate, Palette, Sparkles } from "lucide-react";
import { siteConfig } from "../config/site";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { Reveal, RevealItem } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

const ICON_MAP = {
  layers: Layers,
  sparkles: Sparkles,
  palette: Palette,
  layout: LayoutTemplate,
};

export function Services() {
  const reducedMotion = useReducedMotion();

  return (
    <section id="services" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={siteConfig.services.eyebrow}
          heading={siteConfig.services.heading}
          subline={siteConfig.services.subline}
        />

        <Reveal
          staggerChildren={0.07}
          className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2"
        >
          {siteConfig.services.items.map((service) => {
            const Icon = ICON_MAP[service.icon];
            return (
              <RevealItem key={service.id}>
                <motion.div
                  whileHover={reducedMotion ? undefined : { y: -4 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="flex h-full flex-col justify-between rounded-3xl border border-border bg-surface p-7 sm:p-8 transition-colors hover:border-accent/35 hover:shadow-elevated"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent-tint text-accent-ink">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <span className="font-mono text-xs font-medium tabular-nums text-muted">
                        {service.number}
                      </span>
                    </div>
                    <h3 className="mt-6 font-heading text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                      {service.title}
                    </h3>
                    <p className="mt-3 text-base leading-relaxed text-muted">
                      {service.description}
                    </p>
                  </div>

                  <div className="mt-6 border-t border-border pt-5">
                    <p className="mb-3 text-xs font-semibold text-muted">
                      Deliverables
                    </p>
                    <ul className="space-y-2.5">
                      {service.bullets.map((bullet) => (
                        <li
                          key={bullet}
                          className="flex items-start gap-2.5 text-sm font-medium text-foreground/90"
                        >
                          <Check
                            className="mt-0.5 h-4 w-4 shrink-0 text-accent-ink"
                            aria-hidden="true"
                          />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              </RevealItem>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
