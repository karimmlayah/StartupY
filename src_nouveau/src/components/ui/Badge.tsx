import { cn } from "@/lib/cn";
import type { LegalFreshness, StepStatus } from "@/lib/types";

type BadgeVariant = "default" | "bronze" | "success" | "locked" | "stage";

const variants: Record<BadgeVariant, string> = {
  default: "bg-sand text-brown-mid",
  bronze: "bg-bronze-soft text-bronze border border-bronze-border",
  success: "bg-success-bg text-success",
  locked: "bg-sand/60 text-locked",
  stage: "bg-transparent text-taupe border border-sand",
};

export function Badge({
  children,
  variant = "default",
  className,
}: {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-sm px-2.5 py-1 text-[0.6875rem] font-medium uppercase tracking-wider",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

const statusMap: Record<StepStatus, { variant: BadgeVariant; label: string }> = {
  completed: { variant: "success", label: "Terminé" },
  in_progress: { variant: "bronze", label: "En cours" },
  available: { variant: "bronze", label: "Disponible" },
  locked: { variant: "locked", label: "Verrouillé" },
};

export function StepStatusBadge({ status }: { status: StepStatus }) {
  const s = statusMap[status];
  return <Badge variant={s.variant}>{s.label}</Badge>;
}

const freshnessMap: Record<
  LegalFreshness,
  { label: string; className: string; dot: string }
> = {
  applicable: {
    label: "Applicable",
    className: "bg-success-bg text-success",
    dot: "bg-success",
  },
  "a-verifier": {
    label: "À vérifier",
    className: "bg-warning-bg text-warning",
    dot: "bg-warning",
  },
  abroge: {
    label: "Abrogé",
    className: "bg-danger-bg text-danger",
    dot: "bg-danger",
  },
};

export function FreshnessBadge({ status }: { status: LegalFreshness }) {
  const s = freshnessMap[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-sm px-2 py-0.5 text-[0.6875rem] font-medium uppercase tracking-wide",
        s.className
      )}
    >
      <span className={cn("size-1.5 rounded-full", s.dot)} aria-hidden />
      {s.label}
    </span>
  );
}
