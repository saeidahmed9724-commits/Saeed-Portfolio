import { useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";
import type { WorkCategory } from "../../lib/types";
import { GENERATED_ASSETS } from "../../config/site";
import { createAdminWork, uploadImages } from "../../lib/api";
import {
  parseToolsList,
  slugify,
  validateImageMeta,
} from "../../lib/portfolioLogic";
import { ImageDropzone, type QueuedImage } from "./ImageDropzone";

const PRESET_COVERS = [
  { label: "Haircare Editorial", url: GENERATED_ASSETS.haircare },
  { label: "Skincare Ad", url: GENERATED_ASSETS.skincare },
  { label: "Coffee Brand", url: GENERATED_ASSETS.coffee },
  { label: "Summer Capsule", url: GENERATED_ASSETS.summer },
];

export function UploadForm({ onSuccess }: { onSuccess: () => void }) {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);
  const [category, setCategory] = useState<WorkCategory>("carousels");
  const [description, setDescription] = useState("");
  const [client, setClient] = useState("");
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [role, setRole] = useState("Social Media Designer");
  const [toolsText, setToolsText] = useState("Photoshop, Figma");
  const [sortOrder, setSortOrder] = useState<number>(0);
  const [published, setPublished] = useState(true);

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPresetUrl, setCoverPresetUrl] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [galleryItems, setGalleryItems] = useState<QueuedImage[]>([]);

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!slugEdited) {
      setSlug(slugify(value));
    }
  };

  const handleCoverSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const err = validateImageMeta(file);
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    if (coverPreview && coverFile) URL.revokeObjectURL(coverPreview);
    setCoverFile(file);
    setCoverPresetUrl(null);
    setCoverPreview(URL.createObjectURL(file));
  };

  const handleSelectPreset = (url: string) => {
    setError(null);
    if (coverPreview && coverFile) URL.revokeObjectURL(coverPreview);
    setCoverFile(null);
    setCoverPresetUrl(url);
    setCoverPreview(url);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const cleanSlug = slugify(slug || title);
    if (!title.trim() || !cleanSlug) {
      setError("Title and valid slug are required.");
      return;
    }

    if (!coverFile && !coverPresetUrl) {
      setError("Please upload a cover image or select a studio preset.");
      return;
    }

    setUploading(true);
    try {
      // Upload cover + gallery in one batch directly to Supabase Storage.
      const filesToUpload = [
        ...(coverFile ? [coverFile] : []),
        ...galleryItems.map((item) => item.file),
      ];
      const paths = await uploadImages(cleanSlug, filesToUpload);

      const coverImage = coverFile
        ? { path: paths[0] }
        : { presetUrl: coverPresetUrl! };
      const galleryOffset = coverFile ? 1 : 0;
      const galleryImages = galleryItems.map((item, i) => ({
        path: paths[galleryOffset + i],
        alt: item.alt,
      }));

      await createAdminWork({
        title: title.trim(),
        slug: cleanSlug,
        category,
        description: description.trim(),
        client: client.trim(),
        year: Number.isFinite(year) ? year : null,
        role: role.trim(),
        tools: parseToolsList(toolsText),
        sort_order: Number.isFinite(sortOrder) ? sortOrder : 0,
        published,
        coverImage,
        galleryImages,
      });

      setSuccessMsg(`"${title.trim()}" saved and published to the portfolio.`);
      setTitle("");
      setSlug("");
      setSlugEdited(false);
      setDescription("");
      setClient("");
      setSortOrder(0);
      if (coverPreview && coverFile) URL.revokeObjectURL(coverPreview);
      setCoverFile(null);
      setCoverPresetUrl(null);
      setCoverPreview(null);
      galleryItems.forEach((g) => URL.revokeObjectURL(g.previewUrl));
      setGalleryItems([]);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-3xl border border-border bg-surface p-6 sm:p-8"
    >
      <div>
        <h2 className="font-heading text-xl font-bold text-foreground">
          Upload New Project
        </h2>
        <p className="mt-1 text-sm text-muted">
          Uploaded frames persist directly to the studio server and appear on
          the public portfolio immediately.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div>
          <label
            htmlFor="work-title"
            className="block text-sm font-semibold text-foreground"
          >
            Title *
          </label>
          <input
            id="work-title"
            type="text"
            required
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Brazilian Haircare Launch Carousel"
            className="mt-1.5 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm focus:border-accent focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="work-slug"
            className="block text-sm font-semibold text-foreground"
          >
            Slug *
          </label>
          <input
            id="work-slug"
            type="text"
            required
            value={slug}
            onChange={(e) => {
              setSlugEdited(true);
              setSlug(slugify(e.target.value));
            }}
            placeholder="brazilian-haircare-launch-carousel"
            className="mt-1.5 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm focus:border-accent focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="work-category"
            className="block text-sm font-semibold text-foreground"
          >
            Category *
          </label>
          <select
            id="work-category"
            value={category}
            onChange={(e) => setCategory(e.target.value as WorkCategory)}
            className="mt-1.5 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm focus:border-accent focus:outline-none"
          >
            <option value="carousels">Carousels</option>
            <option value="ad-creatives">Ad Creatives</option>
            <option value="brand-content">Brand Content</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="work-client"
            className="block text-sm font-semibold text-foreground"
          >
            Client
          </label>
          <input
            id="work-client"
            type="text"
            value={client}
            onChange={(e) => setClient(e.target.value)}
            placeholder="Alma Botânica"
            className="mt-1.5 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm focus:border-accent focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="work-year"
            className="block text-sm font-semibold text-foreground"
          >
            Year
          </label>
          <input
            id="work-year"
            type="number"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="mt-1.5 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm font-mono tabular-nums focus:border-accent focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="work-order"
            className="block text-sm font-semibold text-foreground"
          >
            Sort Order
          </label>
          <input
            id="work-order"
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(Number(e.target.value))}
            className="mt-1.5 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm font-mono tabular-nums focus:border-accent focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="work-role"
            className="block text-sm font-semibold text-foreground"
          >
            Role
          </label>
          <input
            id="work-role"
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="mt-1.5 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm focus:border-accent focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="work-tools"
            className="block text-sm font-semibold text-foreground"
          >
            Tools (comma separated)
          </label>
          <input
            id="work-tools"
            type="text"
            value={toolsText}
            onChange={(e) => setToolsText(e.target.value)}
            placeholder="Photoshop, Figma, Illustrator"
            className="mt-1.5 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm focus:border-accent focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="work-description"
          className="block text-sm font-semibold text-foreground"
        >
          Short Description
        </label>
        <textarea
          id="work-description"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Overview of the creative objective, structure, and results..."
          className="mt-1.5 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm focus:border-accent focus:outline-none"
        />
      </div>

      {/* Cover Image Picker */}
      <div className="space-y-3">
        <p className="text-sm font-semibold text-foreground">
          Cover Image * (4:5 recommended)
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-border bg-background px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:border-accent">
            <ImageIcon className="h-4 w-4 text-accent-ink" aria-hidden="true" />
            <span>{coverFile ? "Change Cover File" : "Upload Cover File"}</span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              onChange={handleCoverSelect}
              className="hidden"
            />
          </label>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted">Or use studio visual:</span>
            {PRESET_COVERS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => handleSelectPreset(preset.url)}
                className={`rounded-xl border px-3 py-1.5 text-xs font-medium transition-colors ${
                  coverPresetUrl === preset.url
                    ? "border-accent bg-accent-tint text-accent-ink"
                    : "border-border bg-background text-muted hover:text-foreground"
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {coverPreview && (
            <img
              src={coverPreview}
              alt="Selected cover preview"
              className="h-20 w-16 rounded-xl border border-border object-cover"
            />
          )}
        </div>
      </div>

      {/* Multiple Gallery Image Dropzone */}
      <div>
        <p className="mb-2 text-sm font-semibold text-foreground">
          Case Study Gallery Frames (Optional — defaults to cover frame)
        </p>
        <ImageDropzone
          items={galleryItems}
          onChange={setGalleryItems}
          onError={(msg) => setError(msg)}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-5">
        <label className="inline-flex cursor-pointer items-center gap-2.5 text-sm font-semibold text-foreground">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="h-4 w-4 rounded border-border accent-accent"
          />
          <span>Published (visible on public portfolio)</span>
        </label>

        <button
          type="submit"
          disabled={uploading}
          className="inline-flex shrink-0 whitespace-nowrap items-center gap-2 rounded-full bg-accent px-7 py-3 text-sm font-semibold text-white shadow-accent transition-colors hover:bg-accent-dark disabled:opacity-60"
        >
          {uploading && (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          )}
          {uploading ? "Saving..." : "Save & Publish Work"}
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800/60 dark:bg-red-950/50 dark:text-red-200">
          <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-800/60 dark:bg-emerald-950/50 dark:text-emerald-200">
          <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{successMsg}</span>
        </div>
      )}
    </form>
  );
}
