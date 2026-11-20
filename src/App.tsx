import { MotionConfig } from "motion/react";
import { RouterProvider, useRouter } from "./hooks/useRouter";
import { ThemeProvider } from "./hooks/useTheme";
import { CustomCursor } from "./components/CustomCursor";
import { Preloader } from "./components/Preloader";
import { AdminLoginPage } from "./pages/AdminLoginPage";
import { AdminPage } from "./pages/AdminPage";
import { HomePage } from "./pages/HomePage";
import { WorkDetailPage } from "./pages/WorkDetailPage";

function AppRoutes() {
  const { pathname, navigate } = useRouter();

  if (pathname === "/admin/login") {
    return <AdminLoginPage />;
  }

  if (pathname === "/admin") {
    return <AdminPage />;
  }

  if (pathname.startsWith("/work/")) {
    const slug = decodeURIComponent(pathname.slice("/work/".length)).replace(
      /\/+$/,
      ""
    );
    if (slug) {
      return <WorkDetailPage slug={slug} />;
    }
  }

  if (pathname !== "/") {
    return (
      <main
        id="main-content"
        className="flex min-h-screen flex-col items-center justify-center px-4 text-center"
      >
        <p className="font-mono text-sm font-medium text-accent-ink">404</p>
        <h1 className="mt-2 font-heading text-3xl sm:text-4xl font-bold text-foreground">
          Page not found
        </h1>
        <p className="mt-3 max-w-md text-muted">
          The page you are looking for does not exist or has been moved.
        </p>
        <button
          type="button"
          onClick={() => navigate("/")}
          className="mt-6 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white hover:bg-accent-dark"
        >
          Back to home
        </button>
      </main>
    );
  }

  return <HomePage />;
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <ThemeProvider>
        <RouterProvider>
          <a href="#main-content" className="skip-link">
            Skip to content
          </a>
          <Preloader />
          <CustomCursor />
          <AppRoutes />
        </RouterProvider>
      </ThemeProvider>
    </MotionConfig>
  );
}
