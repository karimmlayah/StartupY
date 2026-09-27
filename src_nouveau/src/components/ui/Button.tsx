import { cn } from "@/lib/cn";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "outline" | "accent";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-gradient-to-b from-brown-mid to-ink text-cream shadow-sm hover:from-brown hover:to-brown-mid hover:-translate-y-px hover:shadow-md disabled:hover:translate-y-0",
  accent:
    "bg-coral text-white shadow-sm hover:bg-coral-dark hover:-translate-y-px hover:shadow-md disabled:hover:translate-y-0",
  secondary:
    "bg-transparent text-ink border border-bronze-border hover:bg-bronze-soft hover:border-bronze",
  outline:
    "bg-surface text-ink border border-sand hover:border-coral-border hover:shadow-sm",
  ghost: "bg-transparent text-muted hover:text-ink hover:bg-ink/5",
};

const sizes: Record<Size, string> = {
  sm: "px-3.5 py-2 text-xs",
  md: "px-5 py-3 text-sm",
  lg: "px-7 py-4 text-base",
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md font-medium tracking-wide transition-all duration-200 ease-[var(--ease-premium)] disabled:cursor-not-allowed disabled:opacity-45 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bronze",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
