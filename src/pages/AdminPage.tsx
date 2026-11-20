import { useCallback, useEffect, useState } from "react";
import type { Message, Work } from "../lib/types";
import { fetchAdminDashboard, fetchAdminSession } from "../lib/api";
import { useRouter } from "../hooks/useRouter";
import { AdminDashboard } from "../components/admin/AdminDashboard";

export function AdminPage() {
  const { navigate } = useRouter();
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [works, setWorks] = useState<Work[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  const loadDashboard = useCallback(async () => {
    try {
      const session = await fetchAdminSession();
      if (!session.authenticated) {
        navigate("/admin/login");
        return;
      }
      const data = await fetchAdminDashboard();
      setEmail(data.email);
      setWorks(data.works);
      setMessages(data.messages);
    } catch {
      navigate("/admin/login");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  if (loading) {
    return (
      <main
        id="main-content"
        className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"
      >
        <div className="animate-pulse space-y-6">
          <div className="h-24 rounded-3xl bg-border/60" />
          <div className="h-64 rounded-3xl bg-border/50" />
        </div>
      </main>
    );
  }

  return (
    <main id="main-content" className="min-h-screen bg-background">
      <AdminDashboard
        userEmail={email}
        works={works}
        messages={messages}
        onRefresh={loadDashboard}
      />
    </main>
  );
}
