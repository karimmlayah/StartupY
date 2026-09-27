import Link from "next/link";
import { Brand } from "@/components/ui/Brand";
import { Button } from "@/components/ui/Button";

/** Page dédiée optionnelle — l'assistant flottant reste le point d'entrée principal */
export default function ChatbotPage() {
  return (
    <div className="atmosphere-subtle flex min-h-[calc(100vh-72px)] items-center justify-center px-6 py-16">
      <div className="max-w-md text-center">
        <Brand size="lg" className="mb-6" />
        <h1 className="font-display text-3xl text-ink">Assistant juridique</h1>
        <p className="mt-4 font-light text-muted">
          L&apos;assistant est disponible en permanence en bas à droite de l&apos;écran. Cliquez sur
          la pastille coral pour l&apos;agrandir.
        </p>
        <Link href="/dashboard" className="mt-8 inline-block">
          <Button variant="accent">Retour au parcours</Button>
        </Link>
      </div>
    </div>
  );
}
