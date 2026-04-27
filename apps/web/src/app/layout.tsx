import type { Metadata } from "next";
import { Beau_Rivage } from "next/font/google";
import "./globals.css";

const beauRivage = Beau_Rivage({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-idle-display"
});

export const metadata: Metadata = {
  title: "OpenVideoUI",
  description: "Estúdio centrado em projetos para geração de imagem e vídeo via OpenRouter."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={beauRivage.variable}>{children}</body>
    </html>
  );
}
