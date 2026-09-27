/** Core domain types for Startupy */

export type Sector =
  | "tech"
  | "agritech"
  | "fintech"
  | "commerce"
  | "sante"
  | "edtech"
  | "cleantech"
  | "autre";

export type CompanyStatus = "none" | "in_progress" | "sole" | "company";
export type ProjectStage = "idea" | "validated" | "prototype" | "revenue";
export type FundingGoal = "clarify" | "mvp" | "raise" | "legal";
export type TeamSetup = "solo" | "two" | "three_plus" | "seeking";

export interface DiagnosticAnswers {
  stage: ProjectStage;
  sector: Sector;
  companyStatus: CompanyStatus;
  goal: FundingGoal;
  team: TeamSetup;
  /** Opère en devises étrangères / paiements internationaux */
  multiCurrency?: boolean;
  /** Ambition d'expansion hors Tunisie */
  international?: boolean;
  /** A déjà des cofondateurs (dérivé ou explicite) */
  hasCofounder?: boolean;
}

export interface DiagnosticQuestionOption {
  value: string;
  label: string;
}

export interface DiagnosticQuestion {
  id: keyof DiagnosticAnswers;
  question: string;
  options: DiagnosticQuestionOption[];
}

export type StepId =
  | "diagnostic"
  | "probleme-client"
  | "solution"
  | "marche"
  | "modele"
  | "juridique"
  | "equipe"
  | "international"
  | "devise"
  | "financement";

export type StepStatus = "locked" | "available" | "in_progress" | "completed";

export interface UnlockCriterion {
  id: string;
  label: string;
  /** Key in stepCompletion for this step */
  field: string;
}

export interface RoadmapStepDefinition {
  id: StepId;
  title: string;
  shortTitle: string;
  description: string;
  order: number;
  /** If true, step only appears when diagnostic conditions match */
  conditional?: (answers: DiagnosticAnswers) => boolean;
  unlockCriteria: UnlockCriterion[];
  /** Weight in preparation score (0–1 share of category) */
  scoreWeight: number;
}

export interface StepCompletion {
  stepId: StepId;
  fields: Record<string, boolean | string>;
  completedAt?: string;
}

export interface Founder {
  id: string;
  name: string;
  email?: string;
  createdAt: string;
}

export interface Startup {
  id: string;
  name: string;
  sector: string;
  stage: string;
  amountSought: string;
  location: string;
  summary: string;
  preparationScore: number;
}

export interface InvestorProfile {
  id: string;
  name: string;
  firm?: string;
  focus: string[];
  ticketMin: string;
  ticketMax: string;
}

export type LegalFreshness = "applicable" | "a-verifier" | "abroge";

export interface LegalDocument {
  id: string;
  title: string;
  reference: string;
  url?: string;
  freshness: LegalFreshness;
  lastChecked: string;
}

export interface ChatSource {
  documentId: string;
  title: string;
  reference: string;
  url?: string;
  freshness: LegalFreshness;
  excerpt?: string;
}

export interface StructuredLegalReply {
  simple: string;
  meaning: string;
  actions: string[];
  sources: ChatSource[];
  limits: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content?: string;
  structured?: StructuredLegalReply;
  createdAt: string;
}

export interface UnlockResult {
  unlocked: boolean;
  missing: string[];
  message: string;
}

export interface ScoreBreakdown {
  total: number;
  max: number;
  categories: {
    id: string;
    label: string;
    score: number;
    max: number;
    weight: number;
  }[];
}
