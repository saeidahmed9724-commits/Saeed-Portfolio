import { Reveal } from "./Reveal";
import { SplitText } from "./SplitText";
import { cn } from "../lib/portfolioLogic";

interface SectionHeadingProps {
  eyebrow: string;
  heading: string;
  subline?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  heading,
  subline,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      <Reveal>
        <p className="text-xs font-semibold tracking-wider text-accent-ink">
          {eyebrow}
        </p>
      </Reveal>

      <SplitText
        text={heading}
        as="h2"
        className="mt-3 font-heading text-3xl sm:text-4xl lg:text-[2.75rem] font-bold tracking-tight text-foreground leading-[1.1]"
      />

      {subline && (
        <Reveal delay={0.1}>
          <p className="mt-4 text-base sm:text-[17px] text-muted leading-relaxed">
            {subline}
          </p>
        </Reveal>
      )}
    </div>
  );
}
