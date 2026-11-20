import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Work, WorkWithImages } from "../lib/types";
import { fetchWorkBySlug } from "../lib/api";
import { getCategoryLabel } from "../lib/portfolioLogic";
import { useRouter } from "../hooks/useRouter";
import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";
import { WorkGallery } from "../components/WorkGallery";

export function WorkDetailPage({ slug }: { slug: string }) {
  const { navigate } = useRouter();
  const [work, setWork] = useState<WorkWithImages | null>(null);
  const [adjacent, setAdjacent] = useState<{
    previous: Work | null;
    next: Work | null;
  }>({ previous: null, next: null });
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setNotFound(false);

    fetchWorkBySlug(slug)
      .then((res) => {
        if (!active) return;
        setWork(res.work);
        setAdjacent(res.adjacent);
      })
      .catch(() => {
        if (!active) return;
        setNotFound(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [slug]);

  return (
    <>
      <Navbar />
      <main id="main-content" className="min-h-screen pt-28 pb-20 sm:pt-36">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <a
            href="/#work"
            onClick={(e) => {
              e.preventDefault();
              navigate("/#work");
            }}
            className="inline-flex items-center gap-2 text-sm font-semibold text-muted transition-colors hover:text-accent-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-md px-1 py-0.5"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to all work
          </a>

          {loading ? (
            <div className="mt-10 animate-pulse space-y-6">
              <div className="h-4 w-32 rounded bg-border/60" />
              <div className="h-12 w-2/3 rounded bg-border/70" />
              <div className="h-20 w-1/2 rounded bg-border/50" />
              <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="aspect-[4/5] rounded-3xl bg-border/50" />
                <div className="aspect-[4/5] rounded-3xl bg-border/50" />
              </div>
            </div>
          ) : notFound || !work ? (
            <div className="mt-12 rounded-3xl border border-border bg-surface px-6 py-20 text-center">
              <h1 className="font-heading text-3xl font-bold text-foreground">
                Project not found
              </h1>
              <p className="mt-3 text-muted">
                This case study may have been unpublished or moved.
              </p>
              <button
                type="button"
                onClick={() => navigate("/")}
                className="mt-6 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white hover:bg-accent-dark"
              >
                Return to portfolio
              </button>
            </div>
          ) : (
            <>
              {/* Case study header */}
              <header className="mt-8 border-b border-border pb-10">
                <p className="text-sm font-semibold text-accent-ink">
                  {getCategoryLabel(work.category)}
                  {work.year && (
                    <span className="font-mono text-muted"> · {work.year}</span>
                  )}
                </p>

                <h1 className="mt-3 max-w-4xl font-heading text-3xl sm:text-5xl lg:text-[3.5rem] font-bold tracking-tight text-foreground leading-[1.08]">
                  {work.title}
                </h1>

                {work.description && (
                  <p className="mt-5 max-w-2xl text-base sm:text-lg leading-relaxed text-muted">
                    {work.description}
                  </p>
                )}

                <dl className="mt-8 grid grid-cols-2 gap-6 border-t border-border pt-6 sm:grid-cols-4">
                  <div>
                    <dt className="text-xs font-medium text-muted">Client</dt>
                    <dd className="mt-1 font-heading text-sm font-bold text-foreground">
                      {work.client || "Independent Concept"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-muted">Role</dt>
                    <dd className="mt-1 font-heading text-sm font-bold text-foreground">
                      {work.role || "Social Media Designer"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-muted">Year</dt>
                    <dd className="mt-1 font-mono text-sm font-medium tabular-nums text-foreground">
                      {work.year || "2026"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-muted">Tools</dt>
                    <dd className="mt-1 text-sm font-medium text-foreground">
                      {work.tools && work.tools.length > 0
                        ? work.tools.join(" · ")
                        : "Photoshop · Figma"}
                    </dd>
                  </div>
                </dl>
              </header>

              {/* Gallery */}
              <div className="mt-12">
                <WorkGallery images={work.work_images} title={work.title} />
              </div>

              {/* Adjacent Navigation */}
              {(adjacent.previous || adjacent.next) && (
                <nav
                  aria-label="Adjacent projects"
                  className="mt-20 grid grid-cols-1 gap-4 border-t border-border pt-10 sm:grid-cols-2"
                >
                  {adjacent.previous ? (
                    <a
                      href={`/work/${adjacent.previous.slug}`}
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(`/work/${adjacent.previous!.slug}`);
                      }}
                      className="group rounded-3xl border border-border bg-surface p-6 transition-colors hover:border-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    >
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted">
                        <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                        Previous project
                      </span>
                      <p className="mt-2 font-heading text-lg font-bold text-foreground transition-colors group-hover:text-accent-ink">
                        {adjacent.previous.title}
                      </p>
                    </a>
                  ) : (
                    <div />
                  )}

                  {adjacent.next && (
                    <a
                      href={`/work/${adjacent.next.slug}`}
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(`/work/${adjacent.next!.slug}`);
                      }}
                      className="group rounded-3xl border border-border bg-surface p-6 text-right transition-colors hover:border-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    >
                      <span className="inline-flex items-center justify-end gap-1.5 text-xs font-medium text-muted">
                        Next project
                        <ArrowRight
                          className="h-3.5 w-3.5"
                          aria-hidden="true"
                        />
                      </span>
                      <p className="mt-2 font-heading text-lg font-bold text-foreground transition-colors group-hover:text-accent-ink">
                        {adjacent.next.title}
                      </p>
                    </a>
                  )}
                </nav>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
