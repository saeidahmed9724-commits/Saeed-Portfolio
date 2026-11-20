import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

interface RouterContextValue {
  pathname: string;
  navigate: (to: string) => void;
  scrollToTarget: (target: string | number, offset?: number) => void;
}

const RouterContext = createContext<RouterContextValue>({
  pathname: "/",
  navigate: () => {},
  scrollToTarget: () => {},
});

export function useRouter() {
  return useContext(RouterContext);
}

export function RouterProvider({ children }: { children: ReactNode }) {
  const [pathname, setPathname] = useState<string>(() =>
    typeof window !== "undefined" ? window.location.pathname : "/"
  );

  useEffect(() => {
    const handlePopState = () => {
      setPathname(window.location.pathname);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const scrollToTarget = useCallback((target: string | number, offset = -88) => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const behavior: ScrollBehavior = prefersReduced ? "auto" : "smooth";

    if (typeof target === "number") {
      window.scrollTo({ top: target, behavior });
      return;
    }

    const element = document.querySelector(target);
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY + offset;
      window.scrollTo({ top: Math.max(0, y), behavior });
    }
  }, []);

  const navigate = useCallback(
    (to: string) => {
      if (to.startsWith("#")) {
        if (window.location.pathname !== "/") {
          window.history.pushState({}, "", `/${to}`);
          setPathname("/");
          window.setTimeout(() => scrollToTarget(to, -88), 100);
        } else {
          scrollToTarget(to, -88);
        }
        return;
      }

      const [nextPath, hash] = to.split("#");
      const normalizedPath = nextPath || "/";
      const currentSearch =
        normalizedPath === window.location.pathname ? window.location.search : "";

      if (normalizedPath !== window.location.pathname) {
        window.history.pushState(
          {},
          "",
          hash ? `${normalizedPath}#${hash}` : `${normalizedPath}${currentSearch}`
        );
        setPathname(normalizedPath);
        if (hash) {
          window.setTimeout(() => scrollToTarget(`#${hash}`, -88), 120);
        } else {
          window.scrollTo({ top: 0, behavior: "auto" });
        }
      } else if (hash) {
        scrollToTarget(`#${hash}`, -88);
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
    [scrollToTarget]
  );

  return (
    <RouterContext.Provider value={{ pathname, navigate, scrollToTarget }}>
      {children}
    </RouterContext.Provider>
  );
}
