"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import {
  DIAGNOSTIC_QUESTIONS,
  parseDiagnosticValue,
} from "@/lib/roadmap";
import type { DiagnosticAnswers } from "@/lib/types";
import { useFounderStore } from "@/store/founder-store";
import { cn } from "@/lib/cn";

export default function DiagnosticPage() {
  return (
    <AuthGuard roles={["entrepreneur"]}>
      <DiagnosticContent />
    </AuthGuard>
  );
}

function DiagnosticContent() {
  const router = useRouter();
  const setAnswer = useFounderStore((s) => s.setDiagnosticAnswer);
  const completeDiagnostic = useFounderStore((s) => s.completeDiagnostic);
  const stored = useFounderStore((s) => s.diagnostic);

  const [step, setStep] = useState(0);
  const q = DIAGNOSTIC_QUESTIONS[step];
  const isLast = step === DIAGNOSTIC_QUESTIONS.length - 1;

  const selected = useMemo(() => {
    const v = stored[q.id];
    if (typeof v === "boolean") return v ? "true" : "false";
    return v ? String(v) : undefined;
  }, [stored, q.id]);

  const select = (value: string) => {
    setAnswer(q.id, parseDiagnosticValue(q.id, value) as DiagnosticAnswers[typeof q.id]);
  };

  const next = () => {
    if (!selected) return;
    if (isLast) {
      const ok = completeDiagnostic();
      if (ok) router.push("/dashboard");
      return;
    }
    setStep((s) => s + 1);
  };

  return (
    <div className="atmosphere-subtle px-6 py-12 md:py-16">
      <div className="mx-auto max-w-xl">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-bronze">
          Étape 0 · Diagnostic
        </p>
        <h1 className="mt-3 mb-8 font-display text-3xl text-ink md:text-4xl">
          Clarifions votre point de départ
        </h1>
        <ProgressBar
          value={step + (selected ? 1 : 0)}
          max={DIAGNOSTIC_QUESTIONS.length}
          label={`Question ${step + 1} sur ${DIAGNOSTIC_QUESTIONS.length}`}
          className="mb-10"
        />

        <div className="rounded-xl border border-sand bg-surface-elevated p-8 shadow-md">
          <h2 className="mb-7 font-display text-xl text-ink">{q.question}</h2>
          <div className="mb-9 flex flex-col gap-2.5" role="radiogroup" aria-label={q.question}>
            {q.options.map((opt) => {
              const isSelected = selected === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => select(opt.value)}
                  className={cn(
                    "flex items-start gap-3.5 rounded-md border px-4 py-4 text-left text-sm text-brown-mid transition-all",
                    isSelected
                      ? "border-transparent bg-surface-elevated text-ink shadow-bronze"
                      : "border-sand bg-cream hover:border-bronze-border hover:bg-surface"
                  )}
                >
                  <span
                    className={cn(
                      "relative mt-0.5 size-[18px] shrink-0 rounded-full border-[1.5px]",
                      isSelected ? "border-bronze" : "border-sand"
                    )}
                    aria-hidden
                  >
                    {isSelected && (
                      <span className="absolute inset-[3px] rounded-full bg-gradient-to-br from-bronze-light to-bronze" />
                    )}
                  </span>
                  {opt.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between border-t border-sand pt-5">
            <Button variant="ghost" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
              Retour
            </Button>
            <Button onClick={next} disabled={!selected}>
              {isLast ? "Voir mon parcours" : "Continuer"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
