import Link from "next/link";
import { StepStatusBadge } from "./Badge";
import { cn } from "@/lib/cn";
import type { StepStatus } from "@/lib/types";

interface RoadmapStepItemProps {
  index: number;
  title: string;
  description: string;
  status: StepStatus;
  href?: string;
  isLast?: boolean;
}

export function RoadmapStepItem({
  index,
  title,
  description,
  status,
  href,
  isLast,
}: RoadmapStepItemProps) {
  const locked = status === "locked";
  const clickable = Boolean(href) && !locked;

  const inner = (
    <>
      <div className="relative flex flex-col items-center">
        <span
          className={cn(
            "z-10 flex size-10 shrink-0 items-center justify-center rounded-full font-display text-sm transition-shadow",
            status === "completed" && "bg-ink text-cream",
            status === "in_progress" &&
              "border-[1.5px] border-bronze bg-surface-elevated text-bronze shadow-bronze",
            status === "available" && "border border-bronze-border bg-surface text-bronze",
            status === "locked" && "border border-sand bg-sand text-locked"
          )}
          aria-hidden
        >
          {status === "completed" ? (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M3 7.5L5.5 10L11 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            index
          )}
        </span>
        {!isLast && (
          <span
            className={cn(
              "my-1 min-h-6 w-px flex-1",
              status === "completed" ? "bg-bronze-light" : "bg-sand"
            )}
          />
        )}
      </div>
      <div className={cn("pb-8 pt-1", locked && "opacity-70")}>
        <div className="mb-2 flex flex-wrap items-center gap-3">
          <h3 className="text-lg font-medium">{title}</h3>
          <StepStatusBadge status={status} />
        </div>
        <p className="max-w-md text-sm font-light text-muted">{description}</p>
        {(status === "in_progress" || status === "available") && (
          <span className="mt-3 inline-block text-sm font-medium text-bronze">
            Ouvrir l&apos;étape →
          </span>
        )}
        {status === "locked" && (
          <p className="mt-2 text-xs text-muted-light">
            Validez l&apos;étape précédente pour débloquer.
          </p>
        )}
      </div>
    </>
  );

  const grid =
    "grid grid-cols-[40px_1fr] gap-5 rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bronze";

  return (
    <li>
      {clickable ? (
        <Link href={href!} className={grid}>
          {inner}
        </Link>
      ) : (
        <div className={grid}>{inner}</div>
      )}
    </li>
  );
}

export function RoadmapEmptyHint() {
  return (
    <div className="rounded-lg border border-sand bg-surface p-6 text-sm text-muted">
      <p className="mb-2 text-xs font-medium uppercase tracking-wider text-bronze">Parcours</p>
      <p>Complétez d&apos;abord le diagnostic pour générer votre roadmap adaptative.</p>
    </div>
  );
}
