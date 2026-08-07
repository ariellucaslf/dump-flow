import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "DumpFlow | Backup Orchestrator",
  description: "Orquestrador de backups do PostgreSQL de alta performance",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body className="bg-neutral-950 text-neutral-50 min-h-screen antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
