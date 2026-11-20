import { useState } from "react";
import { Columns, Expand, Rows } from "lucide-react";
import type { WorkImage } from "../lib/types";
import { Lightbox } from "./Lightbox";
import { MediaFrame } from "./MediaFrame";
import { Reveal } from "./Reveal";

export function WorkGallery({
  images,
  title,
}: {
  images: WorkImage[];
  title: string;
}) {
  const [layoutMode, setLayoutMode] = useState<"vertical" | "strip">(
    "vertical"
  );
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (images.length === 0) {
    return null;
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground">
          Project Frames{" "}
          <span className="font-mono text-base font-medium tabular-nums text-muted">
            ({images.length})
          </span>
        </h2>

        <div
          role="group"
          aria-label="Gallery view mode"
          className="inline-flex items-center gap-1 rounded-xl border border-border bg-surface p-1"
        >
          <button
            type="button"
            aria-pressed={layoutMode === "vertical"}
            onClick={() => setLayoutMode("vertical")}
            className={`inline-flex shrink-0 whitespace-nowrap items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors ${
              layoutMode === "vertical"
                ? "bg-accent text-white"
                : "text-muted hover:text-foreground"
            }`}
          >
            <Rows className="h-3.5 w-3.5" aria-hidden="true" />
            Vertical
          </button>
          <button
            type="button"
            aria-pressed={layoutMode === "strip"}
            onClick={() => setLayoutMode("strip")}
            className={`inline-flex shrink-0 whitespace-nowrap items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors ${
              layoutMode === "strip"
                ? "bg-accent text-white"
                : "text-muted hover:text-foreground"
            }`}
          >
            <Columns className="h-3.5 w-3.5" aria-hidden="true" />
            Carousel Strip
          </button>
        </div>
      </div>

      {layoutMode === "vertical" ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {images.map((image, idx) => (
            <Reveal key={image.id} delay={idx * 0.04}>
              <button
                type="button"
                data-cursor="view"
                aria-label={`Open ${image.alt || `${title} frame ${idx + 1}`} in lightbox`}
                onClick={() => setLightboxIndex(idx)}
                className="group relative w-full overflow-hidden rounded-3xl border border-border bg-surface p-3 text-left transition-colors hover:border-accent/35 hover:shadow-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[16px] bg-accent-tint">
                  <MediaFrame
                    src={image.image_url}
                    alt={image.alt || `${title} frame ${idx + 1}`}
                    imgClassName="transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-background/90 text-foreground opacity-0 backdrop-blur-md transition-opacity group-hover:opacity-100"
                  >
                    <Expand className="h-4 w-4" />
                  </span>
                </div>
                {image.alt && (
                  <p className="mt-3 px-1 text-sm text-muted">{image.alt}</p>
                )}
              </button>
            </Reveal>
          ))}
        </div>
      ) : (
        <div
          data-cursor="drag"
          className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4"
        >
          {images.map((image, idx) => (
            <button
              key={image.id}
              type="button"
              aria-label={`Open ${image.alt || `${title} slide ${idx + 1}`} in lightbox`}
              onClick={() => setLightboxIndex(idx)}
              className="group relative w-[80vw] shrink-0 snap-start overflow-hidden rounded-3xl border border-border bg-surface p-3 text-left transition-colors hover:border-accent/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent sm:w-[360px]"
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[16px] bg-accent-tint">
                <MediaFrame
                  src={image.image_url}
                  alt={image.alt || `${title} slide ${idx + 1}`}
                  imgClassName="transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
              <div className="mt-3 flex items-center justify-between px-1 text-xs font-medium text-muted">
                <span className="truncate">
                  {image.alt || `Slide ${idx + 1}`}
                </span>
                <span className="ml-2 shrink-0 font-mono tabular-nums text-accent-ink">
                  #{idx + 1}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      <Lightbox
        images={images}
        activeIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onChangeIndex={(next) => setLightboxIndex(next)}
      />
    </div>
  );
}
