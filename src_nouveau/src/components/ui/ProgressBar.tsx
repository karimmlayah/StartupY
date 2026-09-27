import { cn } from "@/lib/cn";

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showPercent?: boolean;
  size?: "sm" | "md";
  className?: string;
}

export function ProgressBar({
  value,
  max = 100,
  label,
  showPercent = true,
  size = "md",
  className,
}: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={cn("w-full", className)}>
      {(label || showPercent) && (
        <div className="mb-2 flex items-baseline justify-between">
          {label && <span className="text-sm font-medium text-brown-mid">{label}</span>}
          {showPercent && (
            <span className="font-display text-sm text-bronze">{Math.round(pct)}%</span>
          )}
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={Math.round(pct)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
        className={cn(
          "w-full overflow-hidden rounded-sm bg-sand",
          size === "sm" ? "h-0.5" : "h-1"
        )}
      >
        <div
          className="h-full rounded-sm bg-gradient-to-r from-bronze to-bronze-light shadow-[0_0_8px_rgb(184_147_95_/_0.35)] transition-[width] duration-400 ease-[var(--ease-premium)]"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
