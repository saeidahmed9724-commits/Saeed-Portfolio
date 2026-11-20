import { ArrowUp } from "lucide-react";
import { siteConfig } from "../config/site";
import { useRouter } from "../hooks/useRouter";
import {
  BehanceIcon,
  DribbbleIcon,
  InstagramIcon,
  LinkedInIcon,
} from "./icons/SocialIcons";

function getSocialIcon(label: string) {
  switch (label.toLowerCase()) {
    case "instagram":
      return InstagramIcon;
    case "behance":
      return BehanceIcon;
    case "linkedin":
      return LinkedInIcon;
    case "dribbble":
      return DribbbleIcon;
    default:
      return InstagramIcon;
  }
}

export function Footer() {
  const { navigate, scrollToTarget } = useRouter();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-[#0B0B0F] text-[#FAFAF7] dark:bg-[#050508]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-medium tracking-wider text-accent-light">
              {siteConfig.brandMark} · {siteConfig.location}
            </p>
            <h2 className="mt-4 font-heading text-3xl sm:text-5xl font-bold tracking-tight text-[#FAFAF7] leading-tight">
              {siteConfig.footer.headline}
            </h2>
          </div>

          <button
            type="button"
            onClick={() => scrollToTarget(0)}
            aria-label="Back to top"
            className="inline-flex w-fit shrink-0 whitespace-nowrap items-center gap-2 rounded-full border border-white/25 px-5 py-3 text-sm font-semibold text-[#FAFAF7] transition-colors hover:border-accent-light hover:bg-accent hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            Back to top <ArrowUp className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-14 flex flex-col gap-6 border-t border-white/15 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-5">
            {siteConfig.socials.map((social) => {
              const Icon = getSocialIcon(social.label);
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${social.label} profile`}
                  className="inline-flex items-center gap-2 text-sm text-white/80 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-md px-1 py-0.5"
                >
                  <Icon className="h-4 w-4" />
                  <span>{social.label}</span>
                </a>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-5 text-sm text-white/65">
            <span>
              © {currentYear} {siteConfig.footer.copyrightName}. All rights
              reserved.
            </span>
            <a
              href="/admin"
              onClick={(e) => {
                e.preventDefault();
                navigate("/admin");
              }}
              className="text-white/75 underline-offset-4 transition-colors hover:text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-md px-1"
            >
              Studio Admin
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
