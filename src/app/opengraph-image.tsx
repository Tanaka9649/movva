import { ImageResponse } from "next/og";
import { evento } from "@/config/evento";

export const dynamic = "force-static";
export const alt = `${evento.name} — ${evento.theme}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0d0d0c",
          color: "#f4f1ea",
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, color: "#d6b583", fontSize: 28, fontWeight: 600 }}>
          <div style={{ width: 14, height: 14, borderRadius: 14, background: "#c29a62" }} />
          {evento.theme}
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 76, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2 }}>
          <span>Você construiu um patrimônio.</span>
          <span style={{ color: "#c29a62" }}>Agora, planeje sua continuidade.</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 28, color: "#a9a49a" }}>
          <span>{evento.name}</span>
          <div style={{ width: 220, height: 2, background: "#c29a62", alignSelf: "center" }} />
        </div>
      </div>
    ),
    size,
  );
}
