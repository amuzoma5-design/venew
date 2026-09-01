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

const tagColors: Record<string, { bg: string; color: string }> = {
  FEATURED: { bg: "#F5A623", color: "#0D0D0D" },
  FREE:     { bg: "#10B981", color: "#ffffff" },
  NEW:      { bg: "#06B6D4", color: "#ffffff" },
  HOT:      { bg: "#F43F5E", color: "#ffffff" },
};

import { getFieldConfig } from "@/lib/discoveryTypes";

export default function DiscoveryFullCard({ event }: { event: any }) {
  const catColor = categoryColors[event.category] ?? "#F5A623";
  const tagStyle = event.tag ? tagColors[event.tag] : null;
  const { dateLabel } = getFieldConfig(event.type);

  return (
    <div style={{
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      backgroundColor: "#0D0D0D",
    }}>
      {/* Image section — clean, no text overlaid on it */}
      <div style={{
        position: "relative",
        flex: "0 0 45%",
        minHeight: 0,
        background: event.image_url
          ? `url(${event.image_url}) center/cover no-repeat`
          : `linear-gradient(135deg, ${catColor}dd 0%, #0D0D0D 100%)`,
      }}>
        <div style={{ position: "absolute", top: "14px", left: "14px" }}>
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

        {event.tag && tagStyle && (
          <div style={{ position: "absolute", top: "14px", right: "14px" }}>
            <span style={{
              fontSize: "11px",
              fontWeight: 700,
              padding: "5px 12px",
              borderRadius: "999px",
              backgroundColor: tagStyle.bg,
              color: tagStyle.color,
            }}>
              {event.tag}
            </span>
          </div>
        )}
      </div>

      {/* Solid content panel — legible regardless of what's in the image */}
      <div style={{
        flex: 1,
        minHeight: 0,
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}>
        {event.date && (
          <p style={{
            color: "#F5A623",
            fontSize: "11px",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            marginBottom: "8px",
          }}>
            {dateLabel} · {formatDate(event.date)}
          </p>
        )}

        <h2 style={{
          fontFamily: "Georgia, serif",
          fontSize: "clamp(18px, 4.5vw, 23px)",
          fontWeight: 900,
          color: "#FFFFFF",
          lineHeight: 1.2,
          marginBottom: "10px",
        }}>
          {event.title}
        </h2>

        <p style={{
          color: "#9CA3AF",
          fontSize: "13px",
          lineHeight: 1.55,
          marginBottom: "16px",
          flex: 1,
          minHeight: 0,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}>
          {event.description}
        </p>

        <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "16px", flexWrap: "wrap" }}>
          <span style={{ color: "#D1D5DB", fontSize: "12px" }}>
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
          textAlign: "center",
        }}>
          View Discovery →
        </Link>
      </div>
    </div>
  );
}