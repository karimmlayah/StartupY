"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { FreshnessBadge } from "@/components/ui/Badge";
import { buildDemoLegalReply } from "@/data/catalog";
import type { ChatMessage } from "@/lib/types";
import { cn } from "@/lib/cn";

const SUGGESTIONS = [
  "Quelle forme juridique pour une startup tech à Tunis ?",
  "Quelles sont les obligations fiscales d'une SUARL ?",
  "Comment protéger mon nom commercial en Tunisie ?",
];

const WELCOME: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "Bonjour. Je suis l'assistant juridique Startupy. Posez une question — réponse structurée, sources et fraîcheur des textes.",
  createdAt: new Date().toISOString(),
};

export function ChatPanel({ compact = false }: { compact?: boolean }) {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || typing) return;
    setMessages((m) => [
      ...m,
      {
        id: `u-${Date.now()}`,
        role: "user",
        content: trimmed,
        createdAt: new Date().toISOString(),
      },
    ]);
    setInput("");
    setTyping(true);
    window.setTimeout(() => {
      setMessages((m) => [...m, buildDemoLegalReply(trimmed)]);
      setTyping(false);
    }, 900);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    send(input);
  };

  return (
    <div className={cn("flex min-h-0 flex-1 flex-col", compact && "h-full")}>
      <div
        className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-1 py-3"
        role="log"
        aria-live="polite"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={
              msg.role === "user"
                ? "ml-auto max-w-[92%] rounded-lg rounded-br-sm bg-ink px-3.5 py-3 text-sm text-cream"
                : "mr-auto max-w-full rounded-lg rounded-bl-sm border border-sand bg-surface-elevated px-3.5 py-3 text-sm text-brown-mid shadow-sm"
            }
          >
            {msg.content && <p>{msg.content}</p>}
            {msg.structured && (
              <div className="divide-y divide-sand text-[0.8125rem]">
                <section className="pb-3">
                  <h3 className="mb-1.5 text-[0.625rem] font-semibold uppercase tracking-[0.1em] text-coral">
                    Réponse simple
                  </h3>
                  <p className="font-light leading-relaxed">{msg.structured.simple}</p>
                </section>
                <section className="py-3">
                  <h3 className="mb-1.5 text-[0.625rem] font-semibold uppercase tracking-[0.1em] text-coral">
                    Ce que ça signifie pour vous
                  </h3>
                  <p className="font-light leading-relaxed">{msg.structured.meaning}</p>
                </section>
                <section className="py-3">
                  <h3 className="mb-1.5 text-[0.625rem] font-semibold uppercase tracking-[0.1em] text-coral">
                    Actions recommandées
                  </h3>
                  <ul className="flex flex-col gap-1.5">
                    {msg.structured.actions.map((a) => (
                      <li key={a} className="pl-3 font-light before:mr-2 before:content-['·']">
                        {a}
                      </li>
                    ))}
                  </ul>
                </section>
                <section className="pt-3">
                  <h3 className="mb-1.5 text-[0.625rem] font-semibold uppercase tracking-[0.1em] text-coral">
                    Sources et limites
                  </h3>
                  <ul className="flex flex-col gap-2">
                    {msg.structured.sources.map((s) => (
                      <li
                        key={s.documentId}
                        className="flex flex-wrap items-start justify-between gap-2 rounded-md border border-sand bg-cream p-2"
                      >
                        <div>
                          {s.url ? (
                            <a
                              href={s.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-medium text-ink underline decoration-coral/40 underline-offset-2"
                            >
                              {s.title}
                            </a>
                          ) : (
                            <strong className="font-medium text-ink">{s.title}</strong>
                          )}
                          <p className="text-[0.6875rem] text-muted">{s.reference}</p>
                        </div>
                        <FreshnessBadge status={s.freshness} />
                      </li>
                    ))}
                  </ul>
                  <p className="mt-2 text-[0.6875rem] italic text-muted-light">
                    {msg.structured.limits}
                  </p>
                </section>
              </div>
            )}
          </div>
        ))}
        {typing && (
          <div className="flex w-fit gap-1.5 rounded-lg border border-sand bg-surface-elevated px-4 py-3">
            <span className="size-1.5 animate-pulse rounded-full bg-coral" />
            <span className="size-1.5 animate-pulse rounded-full bg-coral [animation-delay:150ms]" />
            <span className="size-1.5 animate-pulse rounded-full bg-coral [animation-delay:300ms]" />
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {messages.length < 3 && (
        <div className="flex flex-wrap gap-1.5 pb-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => send(s)}
              className="rounded-md border border-sand bg-surface px-2.5 py-1.5 text-left text-[0.6875rem] text-brown-mid transition hover:border-coral-border hover:bg-coral-soft"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <form onSubmit={onSubmit} className="flex gap-2 border-t border-sand pt-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Votre question…"
          aria-label="Message"
          className="min-w-0 flex-1 rounded-md border border-sand bg-surface-elevated px-3 py-2.5 text-sm outline-none focus:border-coral focus:shadow-[0_0_0_3px_var(--color-coral-soft)]"
        />
        <Button
          type="submit"
          size="sm"
          variant="accent"
          disabled={!input.trim() || typing}
        >
          Envoyer
        </Button>
      </form>
    </div>
  );
}
