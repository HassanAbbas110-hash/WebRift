import { ImageResponse } from "next/og";

export const alt = "WebRift: websites, Google visibility and loyalty tools for South African shops";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, color: "#e8ecf8",
          background: "radial-gradient(circle at 15% 10%, rgba(34,211,238,0.35), transparent 45%), radial-gradient(circle at 90% 30%, rgba(124,58,237,0.45), transparent 50%), #070b1a",
        }}
      >
        <div style={{ fontSize: 40, fontWeight: 700, display: "flex" }}>WebRift</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 68, fontWeight: 700, lineHeight: 1.05, letterSpacing: -2, maxWidth: 1000 }}>
            Websites, Google visibility and loyalty tools that bring customers back.
          </div>
          <div style={{ marginTop: 24, fontSize: 40, color: "#22d3ee" }}>Built for South African shops.</div>
        </div>
        <div style={{ fontSize: 26, color: "#94a0c0", display: "flex" }}>WhatsApp-first · Live in days · Prices in rand</div>
      </div>
    ),
    size,
  );
}
