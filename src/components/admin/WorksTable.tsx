import { useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Check,
  Edit3,
  ExternalLink,
  Trash2,
  X,
} from "lucide-react";
import type { Work, WorkCategory } from "../../lib/types";
import {
  deleteAdminWork,
  reorderAdminWorks,
  updateAdminWork,
} from "../../lib/api";
import { getCategoryLabel, swapWorkOrder } from "../../lib/portfolioLogic";
import { useRouter } from "../../hooks/useRouter";
import { MediaFrame } from "../MediaFrame";

interface WorksTableProps {
  works: Work[];
  onRefresh: () => void;
}

export function WorksTable({ works, onRefresh }: WorksTableProps) {
  const { navigate } = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editCategory, setEditCategory] = useState<WorkCategory>("carousels");
  const [editOrder, setEditOrder] = useState(0);
  const [editPublished, setEditPublished] = useState(true);

  const [confirmDeleteWork, setConfirmDeleteWork] = useState<Work | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const startEdit = (work: Work) => {
    setEditingId(work.id);
    setEditTitle(work.title);
    setEditCategory(work.category);
    setEditOrder(work.sort_order);
    setEditPublished(work.published);
  };

  const saveEdit = async (work: Work) => {
    setBusyId(work.id);
    setErrorMsg(null);
    try {
      await updateAdminWork(work.id, {
        title: editTitle.trim(),
        category: editCategory,
        sort_order: editOrder,
        published: editPublished,
      });
      setEditingId(null);
      onRefresh();
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : "Failed to update work."
      );
    } finally {
      setBusyId(null);
    }
  };

  const handleReorder = async (index: number, direction: -1 | 1) => {
    const swapped = swapWorkOrder(works, index, direction);
    if (!swapped) return;

    setBusyId(works[index].id);
    setErrorMsg(null);
    try {
      const [first, second] = swapped.pair;
      await reorderAdminWorks([
        { id: first.id, sort_order: first.sort_order },
        { id: second.id, sort_order: second.sort_order },
      ]);
      onRefresh();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to reorder.");
    } finally {
      setBusyId(null);
    }
  };

  const handleDeleteConfirmed = async () => {
    if (!confirmDeleteWork) return;
    setBusyId(confirmDeleteWork.id);
    setErrorMsg(null);

    try {
      await deleteAdminWork(confirmDeleteWork.id);
      setConfirmDeleteWork(null);
      onRefresh();
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : "Failed to delete work."
      );
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="rounded-3xl border border-border bg-surface p-6">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-heading text-xl font-bold text-foreground">
          Existing Works{" "}
          <span className="font-mono text-base font-medium tabular-nums text-muted">
            ({works.length})
          </span>
        </h2>
      </div>

      {errorMsg && (
        <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800/60 dark:bg-red-950/50 dark:text-red-200">
          {errorMsg}
        </div>
      )}

      {works.length === 0 ? (
        <p className="py-10 text-center text-sm text-muted">
          No works in database yet. Upload your first project above.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs font-semibold text-muted">
                <th className="pb-3 pr-4">Project</th>
                <th className="pb-3 pr-4">Category</th>
                <th className="pb-3 pr-4">Order</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {works.map((work, idx) => {
                const isEditing = editingId === work.id;
                const isBusy = busyId === work.id;

                return (
                  <tr key={work.id} className="align-middle">
                    <td className="py-3.5 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-10 shrink-0 overflow-hidden rounded-lg border border-border bg-accent-tint">
                          <MediaFrame
                            src={work.cover_image_url}
                            alt={work.title}
                          />
                        </div>
                        {isEditing ? (
                          <input
                            type="text"
                            aria-label={`Edit title for ${work.title}`}
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="rounded-xl border border-border bg-background px-3 py-1.5 text-sm font-medium"
                          />
                        ) : (
                          <div>
                            <p className="font-semibold text-foreground">
                              {work.title}
                            </p>
                            <p className="font-mono text-xs text-muted">
                              /{work.slug}
                            </p>
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 pr-4">
                      {isEditing ? (
                        <select
                          aria-label={`Edit category for ${work.title}`}
                          value={editCategory}
                          onChange={(e) =>
                            setEditCategory(e.target.value as WorkCategory)
                          }
                          className="rounded-xl border border-border bg-background px-2.5 py-1.5 text-xs"
                        >
                          <option value="carousels">Carousels</option>
                          <option value="ad-creatives">Ad Creatives</option>
                          <option value="brand-content">Brand Content</option>
                        </select>
                      ) : (
                        <span className="text-xs font-semibold text-accent-ink">
                          {getCategoryLabel(work.category)}
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 pr-4">
                      {isEditing ? (
                        <input
                          type="number"
                          aria-label={`Edit order for ${work.title}`}
                          value={editOrder}
                          onChange={(e) => setEditOrder(Number(e.target.value))}
                          className="w-20 rounded-xl border border-border bg-background px-2.5 py-1.5 font-mono text-xs tabular-nums"
                        />
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <span className="w-6 font-mono text-xs tabular-nums text-muted">
                            {work.sort_order}
                          </span>
                          <button
                            type="button"
                            disabled={idx === 0 || isBusy}
                            onClick={() => handleReorder(idx, -1)}
                            aria-label={`Move ${work.title} up`}
                            className="rounded-md border border-border p-1 text-muted hover:text-foreground disabled:opacity-30"
                          >
                            <ArrowUp className="h-3 w-3" />
                          </button>
                          <button
                            type="button"
                            disabled={idx === works.length - 1 || isBusy}
                            onClick={() => handleReorder(idx, 1)}
                            aria-label={`Move ${work.title} down`}
                            className="rounded-md border border-border p-1 text-muted hover:text-foreground disabled:opacity-30"
                          >
                            <ArrowDown className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 pr-4">
                      {isEditing ? (
                        <label className="inline-flex items-center gap-1.5 text-xs">
                          <input
                            type="checkbox"
                            checked={editPublished}
                            onChange={(e) => setEditPublished(e.target.checked)}
                          />
                          Published
                        </label>
                      ) : (
                        <span
                          className={`text-xs font-semibold ${
                            work.published
                              ? "text-emerald-700 dark:text-emerald-400"
                              : "text-muted"
                          }`}
                        >
                          {work.published ? "Published" : "Draft"}
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        {isEditing ? (
                          <>
                            <button
                              type="button"
                              disabled={isBusy}
                              onClick={() => saveEdit(work)}
                              aria-label={`Save changes to ${work.title}`}
                              className="rounded-xl bg-accent p-2 text-white hover:bg-accent-dark"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingId(null)}
                              aria-label="Cancel edit"
                              className="rounded-xl border border-border p-2 text-muted hover:text-foreground"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <a
                              href={`/work/${work.slug}`}
                              onClick={(e) => {
                                e.preventDefault();
                                navigate(`/work/${work.slug}`);
                              }}
                              aria-label={`View ${work.title}`}
                              className="rounded-xl border border-border p-2 text-muted hover:text-accent-ink"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                            <button
                              type="button"
                              onClick={() => startEdit(work)}
                              aria-label={`Edit ${work.title}`}
                              className="rounded-xl border border-border p-2 text-muted hover:text-foreground"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteWork(work)}
                              aria-label={`Delete ${work.title}`}
                              className="rounded-xl border border-border p-2 text-red-500 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {confirmDeleteWork && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Confirm project deletion"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4 backdrop-blur-sm"
        >
          <div className="w-full max-w-md rounded-3xl border border-border bg-surface p-6 shadow-elevated">
            <h3 className="font-heading text-lg font-bold text-foreground">
              Delete &ldquo;{confirmDeleteWork.title}&rdquo;?
            </h3>
            <p className="mt-2 text-sm text-muted">
              This will permanently remove the project and any uploaded gallery
              frames from the studio store.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmDeleteWork(null)}
                className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={busyId === confirmDeleteWork.id}
                onClick={handleDeleteConfirmed}
                className="rounded-full bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
              >
                {busyId === confirmDeleteWork.id
                  ? "Deleting..."
                  : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
