import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { evento } from "@/config/evento";

export const dynamic = "force-static";
export const alt = `${evento.logoAlt || evento.name} — ${evento.theme}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const logoPath = evento.logo ? join(process.cwd(), "public", evento.logo) : "";
  const logo = logoPath ? `data:image/png;base64,${(await readFile(logoPath)).toString("base64")}` : "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0e0c0d",
          color: "#f6f2f1",
          padding: "64px 80px",
          fontFamily: "sans-serif",
        }}
      >
        {logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logo} alt="" width={376} height={80} />
        ) : (
          <div style={{ display: "flex", fontSize: 36, fontWeight: 700 }}>{evento.name}</div>
        )}
        <div style={{ display: "flex", flexDirection: "column", fontSize: 72, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2 }}>
          <span>Você construiu um patrimônio.</span>
          <span style={{ color: "#d7a3ba" }}>Agora, planeje sua continuidade.</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 24, fontSize: 28, color: "#ada4a8" }}>
          <div style={{ width: 120, height: 3, background: "linear-gradient(90deg, #9c1e57, #e391b3)" }} />
          <span>{evento.theme}</span>
        </div>
      </div>
    ),
    size,
  );
}
