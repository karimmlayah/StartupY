"use client";

import { useMemo, useState } from "react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { STARTUPS } from "@/data/catalog";

const SECTORS = ["Tous", "AgriTech", "FinTech", "HealthTech", "EdTech", "Cleantech", "PropTech"];
const STAGES = ["Tous", "Idée", "Pré-seed", "Seed"];

export default function InvestorsPage() {
  return (
    <AuthGuard roles={["investor"]}>
      <InvestorsContent />
    </AuthGuard>
  );
}

function InvestorsContent() {
  const [sector, setSector] = useState("Tous");
  const [stage, setStage] = useState("Tous");
  const [requested, setRequested] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      STARTUPS.filter((s) => {
        if (sector !== "Tous" && s.sector !== sector) return false;
        if (stage !== "Tous" && s.stage !== stage) return false;
        return true;
      }),
    [sector, stage]
  );

  return (
    <div className="atmosphere px-6 py-12 md:py-16">
      <div className="mx-auto max-w-7xl">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-bronze">
          Espace investisseur
        </p>
        <h1 className="mt-3 mb-4 font-display text-4xl">Startups sélectionnées</h1>
        <p className="mb-10 max-w-xl font-light text-muted">
          Projets accompagnés sur Startupy — filtrés par secteur et stade. Le score affiché est un
          score de préparation, pas une valorisation.
        </p>

        <div className="mb-10 flex flex-col gap-5 border-b border-sand pb-7">
          <FilterRow label="Secteur" options={SECTORS} value={sector} onChange={setSector} />
          <FilterRow label="Stade" options={STAGES} value={stage} onChange={setStage} />
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((startup) => (
            <Card key={startup.id} interactive padding="lg" className="flex flex-col">
              <div className="mb-3 flex items-start justify-between">
                <h3 className="font-display text-xl">{startup.name}</h3>
                <span className="font-display text-lg text-bronze" title="Score de préparation">
                  {startup.preparationScore}
                </span>
              </div>
              <div className="mb-3.5 flex gap-2">
                <Badge variant="stage">{startup.sector}</Badge>
                <Badge variant="bronze">{startup.stage}</Badge>
              </div>
              <p className="mb-6 min-h-[4.2em] flex-1 text-sm font-light leading-relaxed text-muted">
                {startup.summary}
              </p>
              <div className="flex flex-wrap items-end justify-between gap-4 border-t border-sand pt-4">
                <div>
                  <span className="mb-1 block text-[0.6875rem] uppercase tracking-wide text-taupe">
                    Montant recherché
                  </span>
                  <strong className="block font-display text-lg font-medium text-ink">
                    {startup.amountSought}
                  </strong>
                  <span className="text-xs text-muted-light">{startup.location}</span>
                </div>
                <Button
                  size="sm"
                  variant={requested === startup.id ? "secondary" : "primary"}
                  onClick={() => setRequested(startup.id)}
                >
                  {requested === startup.id ? "Demande envoyée" : "Demander une réunion"}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="py-12 text-center text-muted">Aucune startup ne correspond à ces filtres.</p>
        )}
      </div>
    </div>
  );
}

function FilterRow({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <span className="mb-2.5 block text-[0.6875rem] font-medium uppercase tracking-[0.1em] text-taupe">
        {label}
      </span>
      <div className="flex flex-wrap gap-2" role="group" aria-label={label}>
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={
              value === opt
                ? "rounded-sm border border-ink bg-ink px-3.5 py-2 text-xs text-cream"
                : "rounded-sm border border-sand bg-transparent px-3.5 py-2 text-xs text-muted transition hover:border-bronze-border hover:text-ink"
            }
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
