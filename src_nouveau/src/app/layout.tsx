import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Fraunces, Inter } from "next/font/google";
import { Navbar, Footer } from "@/components/layout/Shell";
import { FloatingAssistant } from "@/components/chat/FloatingAssistant";
import { cn } from "@/lib/cn";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Startupy — De l'idée à la startup",
  description:
    "Plateforme tunisienne intelligente qui accompagne les entrepreneurs de l'idée au financement.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={cn(
          fraunces.variable,
          inter.variable,
          "min-h-screen font-sans antialiased"
        )}
      >
        <Navbar />
        <main className="min-h-[calc(100vh-72px)]">{children}</main>
        <Footer />
        <FloatingAssistant />
      </body>
    </html>
  );
}
