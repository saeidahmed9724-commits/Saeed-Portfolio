import { useState } from "react";
import { LogOut } from "lucide-react";
import { adminLogout } from "../../lib/api";
import { useRouter } from "../../hooks/useRouter";

export function LogoutButton() {
  const { navigate } = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await adminLogout();
      navigate("/admin/login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className="inline-flex shrink-0 whitespace-nowrap items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-red-300 hover:text-red-600 dark:hover:border-red-800 dark:hover:text-red-400 disabled:opacity-60"
    >
      <LogOut className="h-4 w-4" aria-hidden="true" />
      {loading ? "Signing out..." : "Sign out"}
    </button>
  );
}
