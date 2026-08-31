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
        background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 55%, rgba(0,0,0,0.35) 100%)",
      }} />

      <div style={{ position: "absolute", top: "24px", left: "20px", zIndex: 1 }}>
        <span style={{
          fontSize: "12px",
          fontWeight: 700,
          padding: "6px 14px",
          borderRadius: "999px",
          color: "#0D0D0D",
          backgroundColor: catColor,
        }}>
          {event.category}
        </span>
      </div>

      <div style={{ position: "relative", zIndex: 1, padding: "24px 24px 100px" }}>
        <p style={{
          color: "#F5A623",
          fontSize: "12px",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.15em",
          marginBottom: "10px",
        }}>
          {formatDate(event.date)}
        </p>

        <h2 style={{
          fontFamily: "Georgia, serif",
          fontSize: "clamp(28px, 6vw, 40px)",
          fontWeight: 900,
          color: "#FFFFFF",
          lineHeight: 1.15,
          marginBottom: "14px",
        }}>
          {event.title}
        </h2>

        <p style={{
          color: "#D1D5DB",
          fontSize: "15px",
          lineHeight: 1.6,
          marginBottom: "20px",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          maxWidth: "520px",
        }}>
          {event.description}
        </p>

        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px", flexWrap: "wrap" }}>
          <span style={{ color: "#E5E7EB", fontSize: "13px" }}>
            📍 {event.venue?.split(",")[0] ?? event.location}
          </span>
          <span style={{
            color: event.price === "FREE" ? "#34D399" : "#F5A623",
            fontSize: "15px",
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
          fontSize: "15px",
          padding: "14px 32px",
          borderRadius: "999px",
          textDecoration: "none",
        }}>
          View Discovery →
        </Link>
      </div>
    </div>
  );
}