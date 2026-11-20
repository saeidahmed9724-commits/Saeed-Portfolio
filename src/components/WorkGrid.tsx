import { useMemo, useState } from "react";
import { AnimatePresence, LayoutGroup } from "motion/react";
import { FolderOpen } from "lucide-react";
import type { Work, WorkFilter } from "../lib/types";
import { filterWorksByCategory } from "../lib/portfolioLogic";
import { FilterPills } from "./FilterPills";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { WorkCard } from "./WorkCard";

export function WorkGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, idx) => (
        <div
          key={idx}
          className="animate-pulse rounded-3xl border border-border bg-surface p-3.5"
        >
          <div className="aspect-[4/5] w-full rounded-[14px] bg-border/60" />
          <div className="mt-4 space-y-2 px-1 pb-1">
            <div className="h-3.5 w-1/2 rounded-md bg-border/50" />
            <div className="h-5 w-3/4 rounded-md bg-border/70" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function WorkGrid({
  works,
  isLoading = false,
  error = null,
}: {
  works: Work[];
  isLoading?: boolean;
  error?: string | null;
}) {
  const [activeFilter, setActiveFilter] = useState<WorkFilter>("all");

  const filteredWorks = useMemo(
    () => filterWorksByCategory(works, activeFilter),
    [works, activeFilter]
  );

  return (
    <section id="work" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Selected Work"
            heading="Creative built to stop the thumb."
            subline="Explore recent carousels, paid ad creatives, and brand-aligned social campaigns."
          />
          <Reveal delay={0.08}>
            <FilterPills
              activeFilter={activeFilter}
              onChange={setActiveFilter}
            />
          </Reveal>
        </div>

        <div className="mt-12" data-testid="work-grid">
          {isLoading ? (
            <WorkGridSkeleton />
          ) : error ? (
            <div className="rounded-3xl border border-red-200 bg-red-50 px-6 py-12 text-center dark:border-red-900/60 dark:bg-red-950/40">
              <p className="font-heading text-lg font-bold text-red-900 dark:text-red-200">
                Could not load projects
              </p>
              <p className="mt-2 text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
          ) : filteredWorks.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-surface px-6 py-20 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-tint text-accent-ink">
                <FolderOpen className="h-7 w-7" aria-hidden="true" />
              </div>
              <h3 className="mt-4 font-heading text-xl font-bold text-foreground">
                No projects in this category yet
              </h3>
              <p className="mt-2 max-w-md text-sm text-muted">
                {activeFilter === "all"
                  ? "Projects uploaded through the Studio Admin dashboard will appear here automatically."
                  : "Switch to another category tab or view all selected works."}
              </p>
              {activeFilter !== "all" && (
                <button
                  type="button"
                  onClick={() => setActiveFilter("all")}
                  className="mt-5 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-dark"
                >
                  Show all projects
                </button>
              )}
            </div>
          ) : (
            <LayoutGroup>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <AnimatePresence mode="popLayout">
                  {filteredWorks.map((work) => (
                    <WorkCard key={work.id} work={work} />
                  ))}
                </AnimatePresence>
              </div>
            </LayoutGroup>
          )}
        </div>
      </div>
    </section>
  );
}
