import { useCallback, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  ImagePlus,
  Trash2,
  UploadCloud,
} from "lucide-react";
import { validateImageMeta } from "../../lib/portfolioLogic";

export interface QueuedImage {
  id: string;
  file: File;
  previewUrl: string;
  alt: string;
}

interface ImageDropzoneProps {
  items: QueuedImage[];
  onChange: (items: QueuedImage[]) => void;
  onError: (message: string) => void;
}

export function ImageDropzone({
  items,
  onChange,
  onError,
}: ImageDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const addFiles = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return;

      const added: QueuedImage[] = [];
      for (const file of Array.from(files)) {
        const validationError = validateImageMeta(file);
        if (validationError) {
          onError(validationError);
          continue;
        }
        added.push({
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          file,
          previewUrl: URL.createObjectURL(file),
          alt: file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
        });
      }

      if (added.length > 0) {
        onChange([...items, ...added]);
      }
    },
    [items, onChange, onError]
  );

  const removeItem = (id: string) => {
    const target = items.find((i) => i.id === id);
    if (target) {
      URL.revokeObjectURL(target.previewUrl);
    }
    onChange(items.filter((i) => i.id !== id));
  };

  const moveItem = (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= items.length) return;
    const copy = [...items];
    const [moved] = copy.splice(index, 1);
    copy.splice(targetIndex, 0, moved);
    onChange(copy);
  };

  const updateAlt = (id: string, alt: string) => {
    onChange(items.map((item) => (item.id === id ? { ...item, alt } : item)));
  };

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          addFiles(e.dataTransfer.files);
        }}
        className={`flex flex-col items-center justify-center rounded-3xl border-2 border-dashed px-6 py-8 text-center transition-colors ${
          dragging
            ? "border-accent bg-accent-tint/60"
            : "border-border bg-background hover:border-accent/50"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/avif"
          className="hidden"
          onChange={(e) => {
            addFiles(e.target.files);
            e.target.value = "";
          }}
        />
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent-tint text-accent-ink">
          <UploadCloud className="h-5 w-5" aria-hidden="true" />
        </div>
        <p className="mt-3 text-sm font-semibold text-foreground">
          Drag & drop gallery frames here
        </p>
        <p className="mt-1 text-xs text-muted">
          JPEG, PNG, WebP, or AVIF up to 10MB each
        </p>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="mt-4 rounded-full border border-border bg-surface px-4 py-2 text-xs font-semibold text-foreground transition-colors hover:border-accent hover:text-accent-ink"
        >
          Browse files
        </button>
      </div>

      {items.length > 0 && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {items.map((item, idx) => (
            <div
              key={item.id}
              className="flex items-center gap-3 rounded-2xl border border-border bg-background p-3"
            >
              <img
                src={item.previewUrl}
                alt={item.alt || `Slide ${idx + 1} preview`}
                className="h-20 w-16 shrink-0 rounded-xl border border-border object-cover"
              />
              <div className="min-w-0 flex-1 space-y-2">
                <div className="flex items-center justify-between text-xs text-muted">
                  <span className="inline-flex items-center gap-1 font-semibold text-foreground">
                    <ImagePlus
                      className="h-3.5 w-3.5 text-accent-ink"
                      aria-hidden="true"
                    />
                    Slide {idx + 1}
                  </span>
                  <span className="font-mono tabular-nums">
                    {(item.file.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                </div>
                <input
                  type="text"
                  aria-label={`Alt description for slide ${idx + 1}`}
                  value={item.alt}
                  onChange={(e) => updateAlt(item.id, e.target.value)}
                  placeholder="Alt description"
                  className="w-full rounded-xl border border-border bg-surface px-2.5 py-1.5 text-xs text-foreground focus:border-accent focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <button
                  type="button"
                  onClick={() => moveItem(idx, -1)}
                  disabled={idx === 0}
                  aria-label={`Move slide ${idx + 1} up`}
                  className="rounded-lg border border-border p-1 text-muted hover:text-foreground disabled:opacity-30"
                >
                  <ArrowUp className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => moveItem(idx, 1)}
                  disabled={idx === items.length - 1}
                  aria-label={`Move slide ${idx + 1} down`}
                  className="rounded-lg border border-border p-1 text-muted hover:text-foreground disabled:opacity-30"
                >
                  <ArrowDown className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  aria-label={`Remove slide ${idx + 1}`}
                  className="rounded-lg border border-border p-1 text-red-500 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/50"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
