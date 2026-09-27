"use client";

import Link from "next/link";
import { useMemo } from "react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ScoreGauge } from "@/components/ui/ScoreGauge";
import { RoadmapEmptyHint, RoadmapStepItem } from "@/components/ui/RoadmapStep";
import {
  calculatePreparationScore,
  getAdaptiveRoadmap,
  getStepStatuses,
  normalizeAnswers,
} from "@/lib/roadmap";
import { useFounderStore } from "@/store/founder-store";

export default function DashboardPage() {
  return (
    <AuthGuard roles={["entrepreneur"]}>
      <DashboardContent />
    </AuthGuard>
  );
}

function DashboardContent() {
  const diagnostic = useFounderStore((s) => s.diagnostic);
  const diagnosticComplete = useFounderStore((s) => s.diagnosticComplete);
  const completions = useFounderStore((s) => s.completions);
  const currentStepId = useFounderStore((s) => s.currentStepId);

  const answers = useMemo(
    () => (diagnosticComplete ? normalizeAnswers(diagnostic) : null),
    [diagnostic, diagnosticComplete]
  );

  const steps = useMemo(() => (answers ? getAdaptiveRoadmap(answers) : []), [answers]);
  const statuses = useMemo(
    () => (answers ? getStepStatuses(answers, completions, currentStepId ?? undefined) : null),
    [answers, completions, currentStepId]
  );
  const score = useMemo(
    () => (answers ? calculatePreparationScore(answers, completions) : null),
    [answers, completions]
  );

  const nextStep = steps.find(
    (s) => statuses && (statuses[s.id] === "available" || statuses[s.id] === "in_progress")
  );

  if (!answers || !statuses || !score) {
    return (
      <div className="atmosphere px-6 py-16">
        <div className="mx-auto max-w-lg">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-bronze">
            Espace fondateur
          </p>
          <h1 className="mt-3 mb-6 font-display text-3xl">Votre parcours</h1>
          <RoadmapEmptyHint />
          <Link href="/diagnostic" className="mt-6 inline-block">
            <Button>Commencer le diagnostic</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="atmosphere px-6 py-12 md:py-16">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_340px]">
        <header className="flex flex-wrap items-center justify-between gap-10 lg:col-span-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-bronze">
              Espace fondateur
            </p>
            <h1 className="mt-3 mb-4 font-display text-4xl text-ink">Votre parcours</h1>
            <p className="max-w-lg font-light text-muted">
              Roadmap adaptée à votre diagnostic. Le score mesure votre préparation — ce n&apos;est
              pas une valorisation financière.
            </p>
          </div>
          <ScoreGauge score={score.total} />
        </header>

        <div>
          <p className="mb-6 text-xs font-medium uppercase tracking-[0.14em] text-bronze">
            Roadmap · {steps.length} étapes
          </p>
          <ol>
            {steps.map((step, i) => (
              <RoadmapStepItem
                key={step.id}
                index={i}
                title={step.title}
                description={step.description}
                status={statuses[step.id]}
                href={
                  step.id === "diagnostic"
                    ? "/diagnostic"
                    : `/roadmap/${step.id}`
                }
                isLast={i === steps.length - 1}
              />
            ))}
          </ol>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <Card active padding="lg">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-bronze">
              Prochaine action
            </p>
            {nextStep ? (
              <>
                <h3 className="mt-3 mb-2 font-display text-xl">{nextStep.title}</h3>
                <p className="mb-5 text-sm font-light text-muted">{nextStep.description}</p>
                <Link href={`/roadmap/${nextStep.id}`}>
                  <Button>Continuer</Button>
                </Link>
              </>
            ) : (
              <>
                <h3 className="mt-3 mb-2 font-display text-xl">Parcours à jour</h3>
                <p className="mb-5 text-sm font-light text-muted">
                  Toutes les étapes visibles sont complétées.
                </p>
                <Link href="/investisseurs">
                  <Button variant="secondary">Voir les investisseurs</Button>
                </Link>
              </>
            )}
          </Card>

          <div className="mt-6 rounded-lg border border-sand bg-surface p-5">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.14em] text-taupe">
              Détail du score
            </p>
            <ul className="flex flex-col gap-2">
              {score.categories.slice(0, 6).map((c) => (
                <li key={c.id} className="flex justify-between text-sm">
                  <span className="text-muted">{c.label}</span>
                  <span className="font-display text-bronze">
                    {c.score}/{c.max}
                  </span>
                </li>
              ))}
            </ul>
            <Badge variant="stage" className="mt-4">
              Préparation · non financier
            </Badge>
          </div>
        </aside>
      </div>
    </div>
  );
}
