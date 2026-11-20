import type { SVGProps } from "react";

export function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export function BehanceIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M7.8 11.4c.8-.4 1.2-1.1 1.2-2.1 0-1.9-1.4-2.8-3.5-2.8H1v11h4.7c2.4 0 3.9-1.1 3.9-3.2 0-1.4-.7-2.4-1.8-2.9ZM3.4 8.5h2c.8 0 1.4.4 1.4 1.1s-.6 1.1-1.4 1.1h-2V8.5Zm2.2 6.9H3.4v-2.6h2.2c1 0 1.6.5 1.6 1.3 0 .9-.6 1.3-1.6 1.3ZM19.4 7.7h-4.6V9h4.6V7.7Zm-2.3 1.9c-2.6 0-4.4 1.8-4.4 4.3 0 2.6 1.7 4.2 4.5 4.2 2 0 3.5-.9 4.1-2.5h-2.1c-.3.5-.9.8-1.9.8-1.3 0-2.1-.6-2.2-1.9h6.4c.2-2.8-1.5-4.9-4.4-4.9Zm-2.1 3.4c.2-1.1.9-1.7 2.1-1.7 1.1 0 1.8.6 2 1.7h-4.1Z" />
    </svg>
  );
}

export function LinkedInIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

export function DribbbleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M19.13 5.09C15.22 9.14 10 10.44 2.25 10.94" />
      <path d="M21.75 12.84c-6.62-1.41-12.14 1-16.38 6.32" />
      <path d="M8.56 2.75c4.37 6 6 9.42 8 17.72" />
    </svg>
  );
}
