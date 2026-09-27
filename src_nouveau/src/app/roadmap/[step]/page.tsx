"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import {
  canAccessStep,
  evaluateUnlock,
  getStepDefinition,
  normalizeAnswers,
} from "@/lib/roadmap";
import type { StepId } from "@/lib/types";
import { useFounderStore } from "@/store/founder-store";

const TEXT_FIELDS: Record<string, { label: string; placeholder: string; multiline?: boolean }> = {
  problemStatement: {
    label: "Le problème en une phrase",
    placeholder: "Ex. : Les producteurs d'huile d'olive perdent de la marge faute d'accès direct…",
    multiline: true,
  },
  persona: {
    label: "Client idéal (persona)",
    placeholder: "Ex. : Exportateur familial, 40–55 ans…",
  },
  valueProp: {
    label: "Proposition de valeur",
    placeholder: "Pour [client], qui a [problème], notre solution…",
    multiline: true,
  },
  mvpScope: {
    label: "Périmètre MVP",
    placeholder: "Fonctionnalités essentielles du premier livrable",
    multiline: true,
  },
  fundingAsk: {
    label: "Montant et usage des fonds",
    placeholder: "Ex. : 180 000 TND — 12 mois produit + ops",
    multiline: true,
  },
};

export default function RoadmapStepPage() {
  return (
    <AuthGuard roles={["entrepreneur"]}>
      <RoadmapStepContent />
    </AuthGuard>
  );
}

function RoadmapStepContent() {
  const params = useParams<{ step: string }>();
  const stepId = params.step as StepId;
  const router = useRouter();
  const diagnostic = useFounderStore((s) => s.diagnostic);
  const diagnosticComplete = useFounderStore((s) => s.diagnosticComplete);
  const completions = useFounderStore((s) => s.completions);
  const updateStepField = useFounderStore((s) => s.updateStepField);
  const tryCompleteStep = useFounderStore((s) => s.tryCompleteStep);

  const [feedback, setFeedback] = useState<string | null>(null);

  const step = getStepDefinition(stepId);
  const answers = diagnosticComplete ? normalizeAnswers(diagnostic) : null;
  const completion = completions[stepId];
  const unlock = step ? evaluateUnlock(step, completion) : null;

  const access = useMemo(() => {
    if (!answers || !step) return { allowed: false, reason: "Étape introuvable." };
    return canAccessStep(stepId, answers, completions);
  }, [answers, step, stepId, completions]);

  if (!step || !answers) {
    return (
      <div className="px-6 py-16 text-center">
        <p className="text-muted">Complétez d&apos;abord le diagnostic.</p>
        <Link href="/diagnostic" className="mt-4 inline-block text-bronze underline">
          Aller au diagnostic
        </Link>
      </div>
    );
  }

  if (!access.allowed) {
    return (
      <div className="atmosphere-subtle px-6 py-16">
        <div className="mx-auto max-w-lg rounded-xl border border-sand bg-surface-elevated p-8 shadow-md">
          <Badge variant="locked">Verrouillé</Badge>
          <h1 className="mt-4 font-display text-2xl">{step.title}</h1>
          <p className="mt-3 text-muted">{access.reason}</p>
          <Link href="/dashboard" className="mt-6 inline-block">
            <Button variant="secondary">Retour au parcours</Button>
          </Link>
        </div>
      </div>
    );
  }

  const criteria = step.unlockCriteria;
  const filled = criteria.filter((c) => {
    const v = completion?.fields[c.field];
    return typeof v === "boolean" ? v : typeof v === "string" && v.trim().length > 0;
  }).length;

  const onValidate = () => {
    const result = tryCompleteStep(stepId);
    setFeedback(result.message);
    if (result.ok) {
      router.push("/dashboard");
    }
  };

  return (
    <div className="atmosphere-subtle px-6 py-12 md:py-16">
      <div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-[260px_1fr]">
        <aside className="md:sticky md:top-24 md:self-start">
          <Link href="/dashboard" className="text-sm text-muted hover:text-ink">
            ← Parcours
          </Link>
          <p className="mt-6 text-xs font-medium uppercase tracking-[0.14em] text-bronze">
            Étape roadmap
          </p>
          <h1 className="mt-3 mb-6 font-display text-3xl">{step.title}</h1>
          <ProgressBar
            value={filled}
            max={criteria.length}
            label="Critères de complétion"
            size="sm"
          />
        </aside>

        <div className="flex flex-col gap-5">
          <Card padding="lg">
            <Badge variant="bronze">Pourquoi c&apos;est important</Badge>
            <h2 className="mt-4 font-display text-xl">{step.shortTitle}</h2>
            <p className="mt-3 font-light leading-relaxed text-muted">{step.description}</p>
          </Card>

          <Card padding="lg" active>
            <Badge variant="bronze">Votre travail</Badge>
            <h2 className="mt-4 mb-6 font-display text-xl">Complétez les critères</h2>
            <div className="flex flex-col gap-5">
              {criteria.map((c) => {
                const textMeta = TEXT_FIELDS[c.field];
                const current = completion?.fields[c.field];

                if (textMeta) {
                  const value = typeof current === "string" ? current : "";
                  return (
                    <div key={c.id} className="flex flex-col gap-2">
                      <label htmlFor={c.field} className="text-sm font-medium text-brown-mid">
                        {textMeta.label}
                      </label>
                      {textMeta.multiline ? (
                        <textarea
                          id={c.field}
                          rows={3}
                          placeholder={textMeta.placeholder}
                          value={value}
                          onChange={(e) => updateStepField(stepId, c.field, e.target.value)}
                          className="rounded-md border border-sand bg-surface px-4 py-3 outline-none transition focus:border-bronze focus:shadow-[0_0_0_3px_var(--color-bronze-soft)]"
                        />
                      ) : (
                        <input
                          id={c.field}
                          type="text"
                          placeholder={textMeta.placeholder}
                          value={value}
                          onChange={(e) => updateStepField(stepId, c.field, e.target.value)}
                          className="rounded-md border border-sand bg-surface px-4 py-3 outline-none transition focus:border-bronze focus:shadow-[0_0_0_3px_var(--color-bronze-soft)]"
                        />
                      )}
                    </div>
                  );
                }

                return (
                  <label
                    key={c.id}
                    className="flex cursor-pointer items-start gap-3 border-b border-sand py-3 last:border-0"
                  >
                    <input
                      type="checkbox"
                      className="mt-1 size-[18px] accent-bronze"
                      checked={Boolean(current)}
                      onChange={(e) => updateStepField(stepId, c.field, e.target.checked)}
                    />
                    <span className="text-sm text-brown-mid">{c.label}</span>
                  </label>
                );
              })}
            </div>
          </Card>

          {!unlock?.unlocked && unlock && (
            <div
              role="status"
              className="rounded-lg border border-warning/30 bg-warning-bg px-5 py-4 text-sm text-warning"
            >
              {unlock.message}
            </div>
          )}

          {feedback && !unlock?.unlocked && (
            <p className="text-sm text-danger" role="alert">
              {feedback}
            </p>
          )}

          <div className="py-4 text-center">
            <Button size="lg" onClick={onValidate} disabled={!unlock?.unlocked}>
              Valider l&apos;étape
            </Button>
            {!unlock?.unlocked && (
              <p className="mt-3 text-xs text-muted">
                La validation exige tous les critères — un simple clic ne suffit pas.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
