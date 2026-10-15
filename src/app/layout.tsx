import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { evento } from "@/config/evento";
import "./globals.css";

// Manrope (OFL) servida pelo próprio site via pacote @fontsource: sem chamadas ao Google Fonts.
const manrope = localFont({
  src: "../../node_modules/@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2",
  weight: "200 800",
  style: "normal",
  display: "swap",
  variable: "--font-manrope",
  fallback: ["ui-sans-serif", "system-ui", "Segoe UI", "Arial", "sans-serif"],
});

const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

const title = `${evento.name} | ${evento.theme}`;
const description = evento.description;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  openGraph: {
    type: "website",
    locale: "pt_BR",
    title,
    description,
    siteName: evento.name,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0e0c0d",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={manrope.variable} suppressHydrationWarning>
      <head>
        {/* Ativa as animações de revelação apenas com JS disponível */}
        <script
          dangerouslySetInnerHTML={{
            // Rede de segurança: se o observador não assumir em 3,5 s, o conteúdo aparece sem animação
            __html:
              "var d=document.documentElement;d.classList.add('js');setTimeout(function(){if(!d.hasAttribute('data-motion-ready'))d.classList.remove('js')},3500)",
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
