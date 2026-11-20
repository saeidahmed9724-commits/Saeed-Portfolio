import { useState } from "react";
import { Image as ImageIcon } from "lucide-react";
import { cn } from "../lib/portfolioLogic";

interface MediaFrameProps {
  src: string | null | undefined;
  alt: string;
  className?: string;
  imgClassName?: string;
  fallbackTitle?: string;
  loading?: "eager" | "lazy";
}

export function MediaFrame({
  src,
  alt,
  className,
  imgClassName,
  fallbackTitle,
  loading = "lazy",
}: MediaFrameProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={cn(
          "flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-accent-tint via-background to-border/60 p-6 text-center text-muted",
          className
        )}
      >
        <ImageIcon className="h-7 w-7 text-accent/60" aria-hidden="true" />
        <span className="mt-2 max-w-[16ch] text-xs font-medium text-foreground/75">
          {fallbackTitle || alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={cn("h-full w-full object-cover", className, imgClassName)}
    />
  );
}
