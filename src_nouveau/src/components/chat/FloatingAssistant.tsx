"use client";

import { useEffect, useState } from "react";
import { ChatPanel } from "./ChatPanel";
import { cn } from "@/lib/cn";

/** Petite pastille assistant — s'agrandit en panneau chat au clic */
export function FloatingAssistant() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-[80] flex flex-col items-end gap-3 sm:bottom-7 sm:right-7">
      <div
        className={cn(
          "pointer-events-auto origin-bottom-right overflow-hidden rounded-xl border border-sand bg-surface-elevated shadow-lg transition-all duration-300 ease-[var(--ease-premium)]",
          open
            ? "h-[min(560px,75vh)] w-[min(400px,calc(100vw-2rem))] scale-100 opacity-100"
            : "pointer-events-none h-0 w-0 scale-90 opacity-0"
        )}
        aria-hidden={!open}
      >
        {open && (
          <div className="flex h-full flex-col">
            <header className="flex items-center justify-between border-b border-sand px-4 py-3">
              <div className="flex items-center gap-2.5">
                <AssistantAvatar size="sm" />
                <div>
                  <p className="text-sm font-medium text-ink">Assistant juridique</p>
                  <p className="text-[0.6875rem] text-muted-light">Réponses sourcées · Tunisie</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-1 text-sm text-muted hover:bg-sand/50 hover:text-ink"
                aria-label="Réduire l'assistant"
              >
                ✕
              </button>
            </header>
            <div className="min-h-0 flex-1 px-3 pb-3">
              <ChatPanel compact />
            </div>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "pointer-events-auto group flex items-center gap-2 rounded-full transition-transform duration-200 hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral",
          open && "ring-2 ring-coral/40"
        )}
        aria-expanded={open}
        aria-label={open ? "Fermer l'assistant juridique" : "Ouvrir l'assistant juridique"}
      >
        {!open && (
          <span className="hidden rounded-full border border-sand bg-surface-elevated px-3 py-1.5 text-xs font-medium text-brown-mid shadow-sm sm:inline">
            Besoin d&apos;aide ?
          </span>
        )}
        <AssistantAvatar size="lg" pulse={!open} />
      </button>
    </div>
  );
}

function AssistantAvatar({ size, pulse }: { size: "sm" | "lg"; pulse?: boolean }) {
  const dim = size === "lg" ? "size-14" : "size-9";
  return (
    <span className={cn("relative inline-flex shrink-0", dim)}>
      {pulse && (
        <span className="absolute inset-0 animate-ping rounded-full bg-coral/30" aria-hidden />
      )}
      <svg
        viewBox="0 0 56 56"
        className={cn(dim, "relative drop-shadow-md")}
        role="img"
        aria-label="Assistant Startupy"
      >
        <circle cx="28" cy="28" r="28" fill="#FF7254" />
        <circle cx="28" cy="28" r="26" fill="none" stroke="#fff" strokeOpacity="0.25" strokeWidth="2" />
        {/* Face / bot */}
        <ellipse cx="28" cy="30" rx="14" ry="15" fill="#F5EFE6" />
        <circle cx="22.5" cy="28" r="2.2" fill="#2A211A" />
        <circle cx="33.5" cy="28" r="2.2" fill="#2A211A" />
        <path
          d="M22 34c2.5 2.5 9.5 2.5 12 0"
          fill="none"
          stroke="#FF7254"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        {/* Antenna */}
        <circle cx="28" cy="12" r="3" fill="#F5EFE6" />
        <line x1="28" y1="15" x2="28" y2="18" stroke="#F5EFE6" strokeWidth="2" />
      </svg>
    </span>
  );
}
