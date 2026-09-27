import { cn } from "@/lib/cn";

interface BrandProps {
  className?: string;
  /** Larger hero style */
  size?: "sm" | "md" | "lg" | "hero";
  /** Light text for dark backgrounds (y stays coral) */
  inverted?: boolean;
}

const sizes = {
  sm: "text-lg",
  md: "text-xl",
  lg: "text-2xl",
  hero: "text-4xl sm:text-5xl md:text-6xl",
};

export function Brand({ className, size = "md", inverted }: BrandProps) {
  return (
    <span
      className={cn(
        "font-display font-semibold tracking-tight",
        sizes[size],
        inverted ? "text-cream" : "text-ink",
        className
      )}
    >
      Startup
      <span className="text-[#FF7254]">y</span>
    </span>
  );
}
