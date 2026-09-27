import type { ChatMessage, LegalDocument, Startup } from "@/lib/types";

export const LEGAL_DOCUMENTS: LegalDocument[] = [
  {
    id: "csc",
    title: "Code des sociétés commerciales",
    reference: "Loi n°2000-93 — SARL / SUARL",
    url: "https://www.iort.gov.tn",
    freshness: "applicable",
    lastChecked: "2026-03-01",
  },
  {
    id: "startup-act",
    title: "Startup Act",
    reference: "Loi n°2018-20 relative aux startups",
    url: "https://www.startup.gov.tn",
    freshness: "applicable",
    lastChecked: "2026-02-15",
  },
  {
    id: "dgi-note",
    title: "Note fiscale PME",
    reference: "Note DGI — régimes simplifiés (à confirmer 2026)",
    freshness: "a-verifier",
    lastChecked: "2025-11-20",
  },
];

export function buildDemoLegalReply(question: string): ChatMessage {
  return {
    id: `a-${Date.now()}`,
    role: "assistant",
    createdAt: new Date().toISOString(),
    structured: {
      simple:
        "Pour une startup tech en Tunisie, la SUARL ou la SARL sont les formes les plus courantes au démarrage. La SAS est pertinente si vous anticipez une levée avec plusieurs investisseurs.",
      meaning:
        "Le statut impacte responsabilité, gouvernance, capital minimum et lecture investisseur. Une SUARL convient en solo ; une SARL dès plusieurs associés. Le Startup Act peut offrir des avantages si vous obtenez le label.",
      actions: [
        "Clarifier le nombre de fondateurs et la répartition du capital",
        "Consulter un expert-comptable sur le régime fiscal",
        "Vérifier l'éligibilité au label Startup Act",
        "Préparer des statuts types avant rendez-vous notaire / avocat",
      ],
      sources: LEGAL_DOCUMENTS.map((d) => ({
        documentId: d.id,
        title: d.title,
        reference: d.reference,
        url: d.url,
        freshness: d.freshness,
        excerpt: `Pertinent pour : « ${question.slice(0, 80)}${question.length > 80 ? "…" : ""} »`,
      })),
      limits:
        "Informations générales à titre indicatif. Elles ne remplacent pas un conseil juridique personnalisé. Vérifiez toujours l'applicabilité des textes.",
    },
  };
}

export const STARTUPS: Startup[] = [
  {
    id: "s1",
    name: "OliveLink",
    sector: "AgriTech",
    stage: "Pré-seed",
    amountSought: "180 000 TND",
    location: "Sfax",
    summary: "Marketplace B2B reliant producteurs d'huile d'olive et importateurs européens.",
    preparationScore: 72,
  },
  {
    id: "s2",
    name: "PaySahil",
    sector: "FinTech",
    stage: "Seed",
    amountSought: "450 000 TND",
    location: "Tunis",
    summary: "Paiements fractionnés pour commerçants et artisans du Grand Tunis.",
    preparationScore: 81,
  },
  {
    id: "s3",
    name: "MediRoute",
    sector: "HealthTech",
    stage: "Pré-seed",
    amountSought: "220 000 TND",
    location: "Sousse",
    summary: "Logistique du dernier kilomètre pour pharmacies et laboratoires.",
    preparationScore: 68,
  },
  {
    id: "s4",
    name: "CraftLab",
    sector: "EdTech",
    stage: "Idée",
    amountSought: "80 000 TND",
    location: "Tunis",
    summary: "Formation professionnelle certifiante pour artisans digitaux.",
    preparationScore: 54,
  },
  {
    id: "s5",
    name: "SolarNest",
    sector: "Cleantech",
    stage: "Seed",
    amountSought: "600 000 TND",
    location: "Gabès",
    summary: "Kits solaires modulaires pour PMI industrielles du Sud.",
    preparationScore: 76,
  },
  {
    id: "s6",
    name: "DarShare",
    sector: "PropTech",
    stage: "Pré-seed",
    amountSought: "150 000 TND",
    location: "Tunis",
    summary: "Coliving meublé pour jeunes actifs et télétravailleurs.",
    preparationScore: 61,
  },
];
