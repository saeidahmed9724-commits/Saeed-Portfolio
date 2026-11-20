import { useState } from "react";
import { ExternalLink, FolderKanban, Inbox } from "lucide-react";
import type { Message, Work } from "../../lib/types";
import { useRouter } from "../../hooks/useRouter";
import { ThemeToggle } from "../ThemeToggle";
import { LogoutButton } from "./LogoutButton";
import { MessagesInbox } from "./MessagesInbox";
import { UploadForm } from "./UploadForm";
import { WorksTable } from "./WorksTable";

interface AdminDashboardProps {
  userEmail: string;
  works: Work[];
  messages: Message[];
  onRefresh: () => void;
}

export function AdminDashboard({
  userEmail,
  works,
  messages,
  onRefresh,
}: AdminDashboardProps) {
  const { navigate } = useRouter();
  const [activeTab, setActiveTab] = useState<"works" | "inbox">("works");

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-4 rounded-3xl border border-border bg-surface p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold text-accent-ink">Studio Admin</p>
          <h1 className="mt-1 font-heading text-2xl sm:text-3xl font-bold text-foreground">
            Manage Works & Messages
          </h1>
          <p className="mt-0.5 text-xs text-muted">Signed in as {userEmail}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <ThemeToggle />
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              navigate("/");
            }}
            className="inline-flex shrink-0 whitespace-nowrap items-center gap-1.5 rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-accent"
          >
            View Live Site
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
          <LogoutButton />
        </div>
      </header>

      <div
        role="tablist"
        aria-label="Admin sections"
        className="mt-8 inline-flex items-center gap-1 rounded-xl border border-border bg-surface p-1"
      >
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "works"}
          onClick={() => setActiveTab("works")}
          className={`inline-flex shrink-0 whitespace-nowrap items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors ${
            activeTab === "works"
              ? "bg-accent text-white"
              : "text-muted hover:text-foreground"
          }`}
        >
          <FolderKanban className="h-4 w-4" aria-hidden="true" />
          Works ({works.length})
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "inbox"}
          onClick={() => setActiveTab("inbox")}
          className={`inline-flex shrink-0 whitespace-nowrap items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors ${
            activeTab === "inbox"
              ? "bg-accent text-white"
              : "text-muted hover:text-foreground"
          }`}
        >
          <Inbox className="h-4 w-4" aria-hidden="true" />
          Inbox ({messages.length})
        </button>
      </div>

      <div className="mt-6 space-y-8">
        {activeTab === "works" ? (
          <>
            <UploadForm onSuccess={onRefresh} />
            <WorksTable works={works} onRefresh={onRefresh} />
          </>
        ) : (
          <MessagesInbox messages={messages} onRefresh={onRefresh} />
        )}
      </div>
    </div>
  );
}
