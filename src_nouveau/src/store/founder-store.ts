"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  DiagnosticAnswers,
  Founder,
  StepCompletion,
  StepId,
} from "@/lib/types";
import {
  calculatePreparationScore,
  evaluateUnlock,
  getAdaptiveRoadmap,
  getStepDefinition,
  getStepStatuses,
  normalizeAnswers,
} from "@/lib/roadmap";

interface FounderState {
  founder: Founder | null;
  diagnostic: Partial<DiagnosticAnswers>;
  diagnosticComplete: boolean;
  completions: Record<string, StepCompletion>;
  currentStepId: StepId | null;

  setFounder: (founder: Founder) => void;
  setDiagnosticAnswer: <K extends keyof DiagnosticAnswers>(
    key: K,
    value: DiagnosticAnswers[K]
  ) => void;
  completeDiagnostic: () => boolean;
  updateStepField: (stepId: StepId, field: string, value: boolean | string) => void;
  tryCompleteStep: (stepId: StepId) => { ok: boolean; message: string; missing: string[] };
  setCurrentStep: (stepId: StepId | null) => void;
  reset: () => void;

  /** Selectors as methods for convenience in components */
  getAnswers: () => DiagnosticAnswers | null;
  getScore: () => number;
  getStatuses: () => ReturnType<typeof getStepStatuses> | null;
}

const initial = {
  founder: null as Founder | null,
  diagnostic: {} as Partial<DiagnosticAnswers>,
  diagnosticComplete: false,
  completions: {} as Record<string, StepCompletion>,
  currentStepId: null as StepId | null,
};

export const useFounderStore = create<FounderState>()(
  persist(
    (set, get) => ({
      ...initial,

      setFounder: (founder) => set({ founder }),

      setDiagnosticAnswer: (key, value) =>
        set((s) => ({ diagnostic: { ...s.diagnostic, [key]: value } })),

      completeDiagnostic: () => {
        const answers = normalizeAnswers(get().diagnostic);
        if (!answers) return false;
        set({
          diagnostic: answers,
          diagnosticComplete: true,
          completions: {
            ...get().completions,
            diagnostic: {
              stepId: "diagnostic",
              fields: { completed: true },
              completedAt: new Date().toISOString(),
            },
          },
          currentStepId: "probleme-client",
          founder: get().founder ?? {
            id: crypto.randomUUID(),
            name: "Fondateur",
            createdAt: new Date().toISOString(),
          },
        });
        return true;
      },

      updateStepField: (stepId, field, value) =>
        set((s) => {
          const prev = s.completions[stepId] ?? { stepId, fields: {} };
          return {
            completions: {
              ...s.completions,
              [stepId]: {
                ...prev,
                fields: { ...prev.fields, [field]: value },
              },
            },
            currentStepId: stepId,
          };
        }),

      tryCompleteStep: (stepId) => {
        const step = getStepDefinition(stepId);
        if (!step) return { ok: false, message: "Étape inconnue.", missing: [] };
        const completion = get().completions[stepId];
        const result = evaluateUnlock(step, completion);
        if (!result.unlocked) {
          return { ok: false, message: result.message, missing: result.missing };
        }
        set((s) => ({
          completions: {
            ...s.completions,
            [stepId]: {
              ...(s.completions[stepId] ?? { stepId, fields: {} }),
              completedAt: new Date().toISOString(),
            },
          },
        }));
        return { ok: true, message: result.message, missing: [] };
      },

      setCurrentStep: (stepId) => set({ currentStepId: stepId }),

      reset: () => set({ ...initial, completions: {}, diagnostic: {} }),

      getAnswers: () => {
        const s = get();
        if (!s.diagnosticComplete) return null;
        return normalizeAnswers(s.diagnostic);
      },

      getScore: () => {
        const answers = get().getAnswers();
        if (!answers) return 0;
        return calculatePreparationScore(answers, get().completions).total;
      },

      getStatuses: () => {
        const answers = get().getAnswers();
        if (!answers) return null;
        return getStepStatuses(answers, get().completions, get().currentStepId ?? undefined);
      },
    }),
    {
      name: "startupy-founder",
      partialize: (s) => ({
        founder: s.founder,
        diagnostic: s.diagnostic,
        diagnosticComplete: s.diagnosticComplete,
        completions: s.completions,
        currentStepId: s.currentStepId,
      }),
    }
  )
);

export function useAdaptiveSteps() {
  const diagnostic = useFounderStore((s) => s.diagnostic);
  const diagnosticComplete = useFounderStore((s) => s.diagnosticComplete);
  if (!diagnosticComplete) return [];
  const answers = normalizeAnswers(diagnostic);
  if (!answers) return [];
  return getAdaptiveRoadmap(answers);
}
