import Link from "next/link";
import { formatDate } from "@/lib/events";

const categoryColors: Record<string, string> = {
  Conference: "#F59E0B",
  Church: "#A78BFA",
  Seminar: "#22D3EE",
  Workshop: "#FB7185",
  Business: "#10B981",
  "Music & Entertainment": "#F43F5E",
  Technology: "#3B82F6",
  "Real Estate": "#8B5CF6",
  Education: "#F97316",
  Opportunities: "#14B8A6",
  "Health & Wellness": "#EC4899",
};

export default function DiscoveryFullCard({ event }: { event: any }) {
  const catColor = categoryColors[event.category] ?? "#F5A623";

  return (
    <div style={{
      position: "relative",
      width: "100%",
      height: "100%",
      backgroundColor: "#0D0D0D",
      background: event.image_url
        ? `url(${event.image_url}) center/cover no-repeat`
        : `linear-gradient(135deg, ${catColor}dd 0%, #0D0D0D 100%)`,
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-end",
    }}>
      <div style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.15) 50%, rgba(0,0,0,0.3) 100%)",
      }} />

      <div style={{ position: "absolute", top: "16px", left: "16px", zIndex: 1 }}>
        <span style={{
          fontSize: "11px",
          fontWeight: 700,
          padding: "5px 12px",
          borderRadius: "999px",
          color: "#0D0D0D",
          backgroundColor: catColor,
        }}>
          {event.category}
        </span>
      </div>

      <div style={{ position: "relative", zIndex: 1, padding: "20px" }}>
        <p style={{
          color: "#F5A623",
          fontSize: "11px",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          marginBottom: "8px",
        }}>
          {formatDate(event.date)}
        </p>

        <h2 style={{
          fontFamily: "Georgia, serif",
          fontSize: "clamp(20px, 5vw, 26px)",
          fontWeight: 900,
          color: "#FFFFFF",
          lineHeight: 1.2,
          marginBottom: "10px",
        }}>
          {event.title}
        </h2>

        <p style={{
          color: "#D1D5DB",
          fontSize: "13px",
          lineHeight: 1.55,
          marginBottom: "16px",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}>
          {event.description}
        </p>

        <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "18px", flexWrap: "wrap" }}>
          <span style={{ color: "#E5E7EB", fontSize: "12px" }}>
            📍 {event.venue?.split(",")[0] ?? event.location}
          </span>
          <span style={{
            color: event.price === "FREE" ? "#34D399" : "#F5A623",
            fontSize: "13px",
            fontWeight: 700,
          }}>
            {event.price}
          </span>
        </div>

        <Link href={`/event/${event.id}`} style={{
          display: "inline-block",
          backgroundColor: "#F5A623",
          color: "#0D0D0D",
          fontWeight: 700,
          fontSize: "13px",
          padding: "11px 24px",
          borderRadius: "999px",
          textDecoration: "none",
        }}>
          View Discovery →
        </Link>
      </div>
    </div>
  );
}