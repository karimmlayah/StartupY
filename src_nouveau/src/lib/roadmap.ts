import type {
  DiagnosticAnswers,
  DiagnosticQuestion,
  RoadmapStepDefinition,
  StepId,
  UnlockCriterion,
  UnlockResult,
  StepCompletion,
  ScoreBreakdown,
} from "./types";

export const DIAGNOSTIC_QUESTIONS: DiagnosticQuestion[] = [
  {
    id: "stage",
    question: "Où en êtes-vous avec votre projet ?",
    options: [
      { value: "idea", label: "J'ai une idée, pas encore testée" },
      { value: "validated", label: "J'ai validé le problème auprès de quelques personnes" },
      { value: "prototype", label: "J'ai un prototype ou une première version" },
      { value: "revenue", label: "J'ai déjà des clients ou du chiffre d'affaires" },
    ],
  },
  {
    id: "sector",
    question: "Quel secteur ciblez-vous principalement ?",
    options: [
      { value: "tech", label: "Tech / SaaS" },
      { value: "agritech", label: "AgriTech / FoodTech" },
      { value: "fintech", label: "FinTech / InsurTech" },
      { value: "commerce", label: "Commerce / Retail" },
      { value: "sante", label: "Santé" },
      { value: "edtech", label: "EdTech" },
      { value: "cleantech", label: "Cleantech" },
      { value: "autre", label: "Autre" },
    ],
  },
  {
    id: "companyStatus",
    question: "Avez-vous déjà une structure juridique en Tunisie ?",
    options: [
      { value: "none", label: "Non, pas encore" },
      { value: "in_progress", label: "En cours de création" },
      { value: "sole", label: "Oui — personne physique / auto-entrepreneur" },
      { value: "company", label: "Oui — société (SARL, SUARL, SAS…)" },
    ],
  },
  {
    id: "goal",
    question: "Quel est votre objectif principal sur les 6 prochains mois ?",
    options: [
      { value: "clarify", label: "Clarifier mon idée et mon marché" },
      { value: "mvp", label: "Lancer un MVP" },
      { value: "raise", label: "Lever des fonds" },
      { value: "legal", label: "Structurer juridiquement et fiscalement" },
    ],
  },
  {
    id: "team",
    question: "Disposez-vous d'une équipe fondatrice ?",
    options: [
      { value: "solo", label: "Je suis seul(e)" },
      { value: "two", label: "Oui, 2 fondateurs" },
      { value: "three_plus", label: "Oui, 3 fondateurs ou plus" },
      { value: "seeking", label: "Je cherche encore des co-fondateurs" },
    ],
  },
  {
    id: "multiCurrency",
    question: "Votre activité implique-t-elle des devises étrangères ?",
    options: [
      { value: "true", label: "Oui — paiements ou revenus hors TND" },
      { value: "false", label: "Non — uniquement en dinars tunisiens" },
    ],
  },
  {
    id: "international",
    question: "Visez-vous un marché hors Tunisie dans les 12 mois ?",
    options: [
      { value: "true", label: "Oui — export ou clients internationaux" },
      { value: "false", label: "Non — focus marché tunisien" },
    ],
  },
];

export function parseDiagnosticValue(
  id: keyof DiagnosticAnswers,
  value: string
): DiagnosticAnswers[keyof DiagnosticAnswers] {
  if (id === "multiCurrency" || id === "international" || id === "hasCofounder") {
    return value === "true";
  }
  return value as never;
}

export function normalizeAnswers(raw: Partial<DiagnosticAnswers>): DiagnosticAnswers | null {
  if (!raw.stage || !raw.sector || !raw.companyStatus || !raw.goal || !raw.team) {
    return null;
  }
  return {
    stage: raw.stage,
    sector: raw.sector,
    companyStatus: raw.companyStatus,
    goal: raw.goal,
    team: raw.team,
    multiCurrency: Boolean(raw.multiCurrency),
    international: Boolean(raw.international),
    hasCofounder: raw.team === "two" || raw.team === "three_plus",
  };
}

const baseCriteria = (items: UnlockCriterion[]) => items;

export const ROADMAP_CATALOG: RoadmapStepDefinition[] = [
  {
    id: "diagnostic",
    title: "Diagnostic initial",
    shortTitle: "Diagnostic",
    description: "Évaluez la maturité de votre idée et obtenez votre score de départ.",
    order: 0,
    scoreWeight: 0.08,
    unlockCriteria: baseCriteria([
      { id: "done", label: "Diagnostic complété", field: "completed" },
    ]),
  },
  {
    id: "probleme-client",
    title: "Problème & Client",
    shortTitle: "Problème",
    description: "Validez le problème réel et identifiez votre client idéal.",
    order: 1,
    scoreWeight: 0.18,
    unlockCriteria: baseCriteria([
      { id: "problem", label: "Problème formulé en une phrase", field: "problemStatement" },
      { id: "persona", label: "Persona client documenté", field: "persona" },
      { id: "interviews", label: "Au moins 5 entretiens de découverte", field: "interviewsDone" },
      { id: "hypotheses", label: "Hypothèses prioritaires listées", field: "hypothesesListed" },
      { id: "alternatives", label: "Alternatives actuelles du client identifiées", field: "alternativesMapped" },
    ]),
  },
  {
    id: "solution",
    title: "Solution & Proposition",
    shortTitle: "Solution",
    description: "Formalisez votre offre et votre proposition de valeur unique.",
    order: 2,
    scoreWeight: 0.14,
    unlockCriteria: baseCriteria([
      { id: "uvp", label: "Proposition de valeur rédigée", field: "valueProp" },
      { id: "mvp", label: "Périmètre MVP défini", field: "mvpScope" },
      { id: "diff", label: "Différenciation vs alternatives", field: "differentiation" },
    ]),
  },
  {
    id: "marche",
    title: "Marché & Concurrence",
    shortTitle: "Marché",
    description: "Cartographiez le marché tunisien et vos avantages compétitifs.",
    order: 3,
    scoreWeight: 0.12,
    unlockCriteria: baseCriteria([
      { id: "tam", label: "Taille de marché estimée", field: "marketSize" },
      { id: "competitors", label: "Concurrents cartographiés", field: "competitorsMapped" },
      { id: "positioning", label: "Positionnement clarifié", field: "positioning" },
    ]),
  },
  {
    id: "modele",
    title: "Modèle économique",
    shortTitle: "Business model",
    description: "Définissez revenus, coûts et unit economics.",
    order: 4,
    scoreWeight: 0.12,
    unlockCriteria: baseCriteria([
      { id: "revenue", label: "Sources de revenus définies", field: "revenueModel" },
      { id: "costs", label: "Structure de coûts estimée", field: "costStructure" },
      { id: "unit", label: "Unit economics calculés", field: "unitEconomics" },
    ]),
  },
  {
    id: "juridique",
    title: "Structure juridique",
    shortTitle: "Juridique",
    description: "Choisissez le statut adapté et les obligations associées.",
    order: 5,
    scoreWeight: 0.1,
    conditional: (a) => a.companyStatus === "none" || a.companyStatus === "in_progress" || a.goal === "legal",
    unlockCriteria: baseCriteria([
      { id: "form", label: "Forme juridique choisie", field: "legalForm" },
      { id: "capital", label: "Répartition du capital documentée", field: "capTableDraft" },
      { id: "obligations", label: "Obligations fiscales listées", field: "taxObligations" },
    ]),
  },
  {
    id: "equipe",
    title: "Équipe & Gouvernance",
    shortTitle: "Équipe",
    description: "Clarifyez rôles, equity et accords entre fondateurs.",
    order: 6,
    scoreWeight: 0.08,
    conditional: (a) =>
      a.team === "two" || a.team === "three_plus" || a.team === "seeking" || Boolean(a.hasCofounder),
    unlockCriteria: baseCriteria([
      { id: "roles", label: "Rôles fondateurs définis", field: "rolesDefined" },
      { id: "equity", label: "Accord d'equity documenté", field: "equityAgreement" },
      { id: "decision", label: "Règles de décision posées", field: "decisionRules" },
    ]),
  },
  {
    id: "international",
    title: "Expansion internationale",
    shortTitle: "International",
    description: "Préparez export, conformité et go-to-market hors Tunisie.",
    order: 7,
    scoreWeight: 0.06,
    conditional: (a) => Boolean(a.international),
    unlockCriteria: baseCriteria([
      { id: "target", label: "Marchés cibles identifiés", field: "targetMarkets" },
      { id: "compliance", label: "Contraintes réglementaires listées", field: "exportCompliance" },
      { id: "gtm", label: "Plan go-to-market export", field: "exportGtm" },
    ]),
  },
  {
    id: "devise",
    title: "Devises & Paiements",
    shortTitle: "Devises",
    description: "Structurez change, comptes et conformité BCT / change.",
    order: 8,
    scoreWeight: 0.05,
    conditional: (a) => Boolean(a.multiCurrency),
    unlockCriteria: baseCriteria([
      { id: "flows", label: "Flux multi-devises cartographiés", field: "currencyFlows" },
      { id: "provider", label: "Solution de paiement choisie", field: "paymentProvider" },
      { id: "fx", label: "Risque de change évalué", field: "fxRisk" },
    ]),
  },
  {
    id: "financement",
    title: "Financement",
    shortTitle: "Financement",
    description: "Préparez votre levée et votre dossier investisseur.",
    order: 9,
    scoreWeight: 0.07,
    conditional: (a) => a.goal === "raise" || a.stage === "prototype" || a.stage === "revenue",
    unlockCriteria: baseCriteria([
      { id: "ask", label: "Montant et usage de fonds définis", field: "fundingAsk" },
      { id: "deck", label: "One-pager / deck prêt", field: "deckReady" },
      { id: "metrics", label: "Métriques clés renseignées", field: "keyMetrics" },
    ]),
  },
];

/** Steps visible for a given diagnostic profile, ordered */
export function getAdaptiveRoadmap(answers: DiagnosticAnswers): RoadmapStepDefinition[] {
  return ROADMAP_CATALOG.filter((step) => !step.conditional || step.conditional(answers)).sort(
    (a, b) => a.order - b.order
  );
}

export function getStepDefinition(stepId: StepId): RoadmapStepDefinition | undefined {
  return ROADMAP_CATALOG.find((s) => s.id === stepId);
}

function isFieldComplete(value: boolean | string | undefined): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") return value.trim().length > 0;
  return false;
}

/** Evaluate unlock criteria for a step — requires completion, not just a click */
export function evaluateUnlock(
  step: RoadmapStepDefinition,
  completion: StepCompletion | undefined
): UnlockResult {
  const missing: string[] = [];
  for (const criterion of step.unlockCriteria) {
    const value = completion?.fields[criterion.field];
    if (!isFieldComplete(value)) {
      missing.push(criterion.label);
    }
  }

  if (missing.length === 0) {
    return {
      unlocked: true,
      missing: [],
      message: "Tous les critères sont remplis. Vous pouvez valider cette étape.",
    };
  }

  const preview = missing.slice(0, 3).join(" · ");
  const more = missing.length > 3 ? ` (+${missing.length - 3})` : "";
  return {
    unlocked: false,
    missing,
    message: `Il manque encore : ${preview}${more}. Complétez ces éléments pour débloquer la suite.`,
  };
}

/** Next step after current becomes available only if previous is completed */
export function getStepStatuses(
  answers: DiagnosticAnswers,
  completions: Record<string, StepCompletion>,
  currentStepId?: StepId
): Record<StepId, "locked" | "available" | "in_progress" | "completed"> {
  const steps = getAdaptiveRoadmap(answers);
  const statuses = {} as Record<StepId, "locked" | "available" | "in_progress" | "completed">;

  let previousCompleted = true;

  for (const step of steps) {
    const completion = completions[step.id];
    const unlock = evaluateUnlock(step, completion);

    if (unlock.unlocked) {
      statuses[step.id] = "completed";
      previousCompleted = true;
    } else if (!previousCompleted) {
      statuses[step.id] = "locked";
    } else if (currentStepId === step.id || Object.keys(completion?.fields ?? {}).length > 0) {
      statuses[step.id] = "in_progress";
      previousCompleted = false;
    } else {
      statuses[step.id] = "available";
      previousCompleted = false;
    }
  }

  return statuses;
}

/**
 * Preparation score — multi-criteria readiness, NOT a financial valuation.
 * Max 100. Weighted by step scoreWeight among visible steps + diagnostic maturity boost.
 */
export function calculatePreparationScore(
  answers: DiagnosticAnswers,
  completions: Record<string, StepCompletion>
): ScoreBreakdown {
  const steps = getAdaptiveRoadmap(answers);
  const weightSum = steps.reduce((s, st) => s + st.scoreWeight, 0) || 1;

  const categories = steps.map((step) => {
    const completion = completions[step.id];
    const criteria = step.unlockCriteria;
    const filled = criteria.filter((c) => isFieldComplete(completion?.fields[c.field])).length;
    const ratio = criteria.length === 0 ? 0 : filled / criteria.length;
    const max = Math.round((step.scoreWeight / weightSum) * 100);
    const score = Math.round(ratio * max);
    return {
      id: step.id,
      label: step.shortTitle,
      score,
      max,
      weight: step.scoreWeight / weightSum,
    };
  });

  // Soft maturity boost from diagnostic stage (max +8, still not valuation)
  const stageBoost =
    answers.stage === "idea" ? 0 : answers.stage === "validated" ? 3 : answers.stage === "prototype" ? 5 : 8;

  let total = categories.reduce((s, c) => s + c.score, 0) + stageBoost;
  total = Math.min(100, total);

  return {
    total,
    max: 100,
    categories,
  };
}

export function canAccessStep(
  stepId: StepId,
  answers: DiagnosticAnswers,
  completions: Record<string, StepCompletion>
): { allowed: boolean; reason?: string } {
  const steps = getAdaptiveRoadmap(answers);
  const step = steps.find((s) => s.id === stepId);
  if (!step) {
    return { allowed: false, reason: "Cette étape n'est pas dans votre parcours actuel." };
  }
  const statuses = getStepStatuses(answers, completions);
  if (statuses[stepId] === "locked") {
    return {
      allowed: false,
      reason: "Validez l'étape précédente pour débloquer celle-ci.",
    };
  }
  return { allowed: true };
}
