import { cn } from "@/lib/cn";
import type { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  active?: boolean;
  interactive?: boolean;
  padding?: "sm" | "md" | "lg";
}

const pads = { sm: "p-4", md: "p-6", lg: "p-8" };

export function Card({
  children,
  active,
  interactive,
  padding = "md",
  className,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-sand bg-surface-elevated shadow-sm transition-all duration-200 ease-[var(--ease-premium)]",
        pads[padding],
        active && "border-transparent shadow-bronze",
        interactive && "cursor-pointer hover:-translate-y-0.5 hover:border-bronze-border hover:shadow-md",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
