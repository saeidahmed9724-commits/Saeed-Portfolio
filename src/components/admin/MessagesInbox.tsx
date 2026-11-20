import { useState } from "react";
import { Mail, Trash2 } from "lucide-react";
import type { Message } from "../../lib/types";
import { deleteAdminMessage } from "../../lib/api";
import { formatDate } from "../../lib/portfolioLogic";

export function MessagesInbox({
  messages,
  onRefresh,
}: {
  messages: Message[];
  onRefresh: () => void;
}) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteAdminMessage(id);
      onRefresh();
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="rounded-3xl border border-border bg-surface p-6">
      <h2 className="mb-5 font-heading text-xl font-bold text-foreground">
        Contact Inbox{" "}
        <span className="font-mono text-base font-medium tabular-nums text-muted">
          ({messages.length})
        </span>
      </h2>

      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-tint text-accent-ink">
            <Mail className="h-6 w-6" aria-hidden="true" />
          </div>
          <p className="mt-3 text-sm font-medium text-muted">
            No messages yet. Inquiries from the contact form appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <article
              key={msg.id}
              className="rounded-2xl border border-border bg-background p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-heading text-base font-bold text-foreground">
                    {msg.name}
                  </h3>
                  <a
                    href={`mailto:${msg.email}`}
                    className="text-sm font-medium text-accent-ink hover:underline"
                  >
                    {msg.email}
                  </a>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs tabular-nums text-muted">
                    {formatDate(msg.created_at)}
                  </span>
                  <button
                    type="button"
                    disabled={deletingId === msg.id}
                    onClick={() => handleDelete(msg.id)}
                    aria-label={`Delete message from ${msg.name}`}
                    className="rounded-xl border border-border p-1.5 text-red-500 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/50 disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
                {msg.message}
              </p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
