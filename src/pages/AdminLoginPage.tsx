import { useEffect, useState } from "react";
import { AlertCircle, ArrowLeft, Lock } from "lucide-react";
import { siteConfig } from "../config/site";
import { adminLogin, fetchAdminSession } from "../lib/api";
import { useRouter } from "../hooks/useRouter";
import { ThemeToggle } from "../components/ThemeToggle";

export function AdminLoginPage() {
  const { navigate } = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAdminSession()
      .then((res) => {
        if (res.authenticated) {
          navigate("/admin");
        }
      })
      .catch(() => {});
  }, [navigate]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await adminLogin(email, password);
      navigate("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid credentials.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main
      id="main-content"
      className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12"
    >
      <div className="w-full max-w-md">
        <div className="flex items-center justify-between gap-4">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              navigate("/");
            }}
            className="inline-flex items-center gap-2 text-sm font-semibold text-muted transition-colors hover:text-accent-ink"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to portfolio
          </a>
          <ThemeToggle />
        </div>

        <div className="mt-6 rounded-3xl border border-border bg-surface p-8 shadow-elevated">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent-tint text-accent-ink">
            <Lock className="h-5 w-5" aria-hidden="true" />
          </div>

          <h1 className="mt-5 font-heading text-2xl font-bold text-foreground">
            {siteConfig.brandMark} Studio Admin
          </h1>
          <p className="mt-1.5 text-sm text-muted">
            Sign in to upload new portfolio case studies and review client
            inquiries.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div>
              <label
                htmlFor="admin-email"
                className="block text-sm font-semibold text-foreground"
              >
                Admin Email
              </label>
              <input
                id="admin-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
              />
            </div>

            <div>
              <label
                htmlFor="admin-password"
                className="block text-sm font-semibold text-foreground"
              >
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter studio password"
                className="mt-1.5 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800/60 dark:bg-red-950/50 dark:text-red-200">
                <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-full bg-accent px-6 py-3.5 text-sm font-semibold text-white shadow-accent transition-colors hover:bg-accent-dark disabled:opacity-60"
            >
              {submitting ? "Signing in..." : "Sign in to Dashboard"}
            </button>
          </form>

        </div>
      </div>
    </main>
  );
}
