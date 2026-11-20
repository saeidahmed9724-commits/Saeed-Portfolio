import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { siteConfig } from "../config/site";
import { useRouter } from "../hooks/useRouter";
import { cn } from "../lib/portfolioLogic";
import { MobileMenu } from "./MobileMenu";
import { ThemeToggle } from "./ThemeToggle";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname, navigate } = useRouter();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleAnchorClick = (href: string) => {
    if (pathname === "/") {
      navigate(href);
    } else {
      navigate(`/${href}`);
    }
  };

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-40 transition-all duration-200",
          scrolled ? "py-2.5" : "py-4"
        )}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div
            className={cn(
              "flex items-center justify-between gap-8 rounded-full border px-5 py-2.5 transition-all duration-200",
              scrolled
                ? "border-border bg-background/90 shadow-soft backdrop-blur-xl"
                : "border-transparent bg-background/70 backdrop-blur-md"
            )}
          >
            {/* Zone 1: Single-line Brand Wordmark */}
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                navigate("/");
              }}
              className="shrink-0 whitespace-nowrap rounded-md font-heading text-xl sm:text-2xl font-bold tracking-tight text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              {siteConfig.brandMark}
            </a>

            {/* Zone 2: Clean Typography Nav Links */}
            <nav
              aria-label="Primary navigation"
              className="hidden items-center gap-8 md:flex"
            >
              {siteConfig.navLinks.map((link) => (
                <a
                  key={link.href}
                  href={`/${link.href}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleAnchorClick(link.href);
                  }}
                  className="shrink-0 whitespace-nowrap rounded-md px-1 py-0.5 text-sm font-medium text-foreground/80 underline-offset-4 transition-colors hover:text-accent-ink hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Zone 3: Theme Toggle + Single Primary Action (+ mobile menu trigger) */}
            <div className="flex shrink-0 items-center gap-2.5">
              <ThemeToggle />

              <a
                href="/#contact"
                onClick={(e) => {
                  e.preventDefault();
                  handleAnchorClick("#contact");
                }}
                className="hidden shrink-0 whitespace-nowrap items-center rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:inline-flex"
              >
                Hire me
              </a>

              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                aria-label="Open navigation menu"
                aria-expanded={mobileOpen}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent md:hidden"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <MobileMenu
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        onNavigate={handleAnchorClick}
      />
    </>
  );
}
