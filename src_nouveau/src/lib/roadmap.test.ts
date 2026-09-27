import { describe, expect, it } from "vitest";
import {
  calculatePreparationScore,
  evaluateUnlock,
  getAdaptiveRoadmap,
  getStepStatuses,
  normalizeAnswers,
  ROADMAP_CATALOG,
} from "./roadmap";
import type { DiagnosticAnswers, StepCompletion } from "./types";

const baseAnswers: DiagnosticAnswers = {
  stage: "idea",
  sector: "tech",
  companyStatus: "none",
  goal: "clarify",
  team: "solo",
  multiCurrency: false,
  international: false,
  hasCofounder: false,
};

describe("normalizeAnswers", () => {
  it("returns null when required fields missing", () => {
    expect(normalizeAnswers({ stage: "idea" })).toBeNull();
  });

  it("derives hasCofounder from team", () => {
    const a = normalizeAnswers({
      stage: "idea",
      sector: "tech",
      companyStatus: "none",
      goal: "clarify",
      team: "two",
    });
    expect(a?.hasCofounder).toBe(true);
  });
});

describe("getAdaptiveRoadmap", () => {
  it("hides international, devise, equipe, financement for solo local idea", () => {
    const ids = getAdaptiveRoadmap(baseAnswers).map((s) => s.id);
    expect(ids).toContain("probleme-client");
    expect(ids).toContain("juridique");
    expect(ids).not.toContain("international");
    expect(ids).not.toContain("devise");
    expect(ids).not.toContain("equipe");
    expect(ids).not.toContain("financement");
  });

  it("includes equipe when cofounders", () => {
    const ids = getAdaptiveRoadmap({ ...baseAnswers, team: "two", hasCofounder: true }).map(
      (s) => s.id
    );
    expect(ids).toContain("equipe");
  });

  it("includes international and devise when flagged", () => {
    const ids = getAdaptiveRoadmap({
      ...baseAnswers,
      international: true,
      multiCurrency: true,
    }).map((s) => s.id);
    expect(ids).toContain("international");
    expect(ids).toContain("devise");
  });

  it("includes financement when goal is raise", () => {
    const ids = getAdaptiveRoadmap({ ...baseAnswers, goal: "raise" }).map((s) => s.id);
    expect(ids).toContain("financement");
  });
});

describe("evaluateUnlock", () => {
  const step = ROADMAP_CATALOG.find((s) => s.id === "probleme-client")!;

  it("blocks unlock when criteria incomplete", () => {
    const result = evaluateUnlock(step, {
      stepId: "probleme-client",
      fields: { problemStatement: "Pain X", persona: "Buyer Y" },
    });
    expect(result.unlocked).toBe(false);
    expect(result.missing.length).toBeGreaterThan(0);
    expect(result.message).toMatch(/Il manque encore/);
  });

  it("unlocks when all criteria met", () => {
    const fields: Record<string, boolean | string> = {};
    for (const c of step.unlockCriteria) {
      fields[c.field] = true;
    }
    const result = evaluateUnlock(step, { stepId: "probleme-client", fields });
    expect(result.unlocked).toBe(true);
    expect(result.missing).toEqual([]);
  });

  it("treats non-empty strings as complete", () => {
    const mini = {
      ...step,
      unlockCriteria: [{ id: "x", label: "Texte", field: "notes" }],
    };
    expect(evaluateUnlock(mini, { stepId: "solution", fields: { notes: "  " } }).unlocked).toBe(
      false
    );
    expect(evaluateUnlock(mini, { stepId: "solution", fields: { notes: "ok" } }).unlocked).toBe(
      true
    );
  });
});

describe("getStepStatuses", () => {
  it("locks later steps until previous completed", () => {
    const completions: Record<string, StepCompletion> = {
      diagnostic: {
        stepId: "diagnostic",
        fields: { completed: true },
        completedAt: new Date().toISOString(),
      },
    };
    const statuses = getStepStatuses(baseAnswers, completions);
    expect(statuses.diagnostic).toBe("completed");
    expect(statuses["probleme-client"]).toMatch(/available|in_progress/);
    expect(statuses.solution).toBe("locked");
  });
});

describe("calculatePreparationScore", () => {
  it("returns 0–100 and is not a valuation", () => {
    const score = calculatePreparationScore(baseAnswers, {});
    expect(score.total).toBeGreaterThanOrEqual(0);
    expect(score.total).toBeLessThanOrEqual(100);
    expect(score.max).toBe(100);
  });

  it("increases when steps are completed", () => {
    const empty = calculatePreparationScore(baseAnswers, {});
    const completions: Record<string, StepCompletion> = {};
    for (const step of getAdaptiveRoadmap(baseAnswers)) {
      const fields: Record<string, boolean> = {};
      for (const c of step.unlockCriteria) fields[c.field] = true;
      completions[step.id] = { stepId: step.id, fields };
    }
    const full = calculatePreparationScore(baseAnswers, completions);
    expect(full.total).toBeGreaterThan(empty.total);
    expect(full.total).toBeLessThanOrEqual(100);
  });

  it("applies stage maturity boost without exceeding 100", () => {
    const idea = calculatePreparationScore(baseAnswers, {});
    const revenue = calculatePreparationScore({ ...baseAnswers, stage: "revenue" }, {});
    expect(revenue.total).toBeGreaterThan(idea.total);
  });
});
