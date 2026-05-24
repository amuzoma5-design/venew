import Link from "next/link";
import { formatDate } from "@/lib/events";

const categoryColors: Record<string, string> = {
  Conference: "#F59E0B",
  Church: "#A78BFA",
  Seminar: "#22D3EE",
  Workshop: "#FB7185",
};

const tagColors: Record<string, { bg: string; color: string }> = {
  FEATURED: { bg: "#F5A623", color: "#0D0D0D" },
  FREE:     { bg: "#10B981", color: "#ffffff" },
  NEW:      { bg: "#06B6D4", color: "#ffffff" },
  HOT:      { bg: "#F43F5E", color: "#ffffff" },
};

export default function EventCard({ event, index = 0 }: { event: any; index?: number }) {
  const catColor = categoryColors[event.category] ?? "#F5A623";
  const tagStyle = event.tag ? tagColors[event.tag] : null;

  return (
    <Link href={`/event/${event.id}`} style={{ textDecoration: "none", display: "block" }}>
      <article
        className="event-card"
        style={{
          backgroundColor: "#1A1A1A",
          border: "1px solid #2A2A2A",
          borderRadius: "16px",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          animationDelay: `${(index + 1) * 0.05}s`,
        }}
      >
        {/* Card header */}
        <div style={{
          height: "160px",
          background: event.image_url
            ? `url(${event.image_url}) center/cover no-repeat`
            : `linear-gradient(135deg, ${catColor}cc 0%, #111 100%)`,
          position: "relative",
          display: "flex",
          alignItems: "flex-end",
          padding: "16px",
        }}>
          {/* Dark overlay when image is present */}
          {event.image_url && (
            <div style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to top, rgba(0,0,0,0.75), transparent)",
            }} />
          )}

          {/* Category badge */}
          <span style={{
            position: "relative",
            zIndex: 1,
            fontSize: "11px",
            fontWeight: 600,
            padding: "4px 10px",
            borderRadius: "999px",
            color: catColor,
            backgroundColor: `${catColor}25`,
          }}>
            {event.category}
          </span>

          {/* Tag badge */}
          {event.tag && tagStyle && (
            <span style={{
              position: "absolute",
              top: "12px",
              right: "12px",
              zIndex: 1,
              fontSize: "11px",
              fontWeight: 700,
              padding: "4px 10px",
              borderRadius: "999px",
              backgroundColor: tagStyle.bg,
              color: tagStyle.color,
            }}>
              {event.tag}
            </span>
          )}
        </div>

        {/* Card body */}
        <div style={{
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          flex: 1,
        }}>
          <p style={{
            color: "#F5A623",
            fontSize: "11px",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            marginBottom: "8px",
          }}>
            {formatDate(event.date)}
          </p>

          <h2 style={{
            fontFamily: "Georgia, serif",
            fontSize: "20px",
            fontWeight: 700,
            color: "#E8E8E8",
            lineHeight: 1.3,
            marginBottom: "12px",
          }}>
            {event.title}
          </h2>

          <p style={{
            color: "#6B6B6B",
            fontSize: "14px",
            lineHeight: 1.6,
            flex: 1,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}>
            {event.description}
          </p>

          {/* Footer */}
          <div style={{
            marginTop: "20px",
            paddingTop: "16px",
            borderTop: "1px solid #2A2A2A",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}>
            <span style={{ color: "#6B6B6B", fontSize: "12px" }}>
              📍 {event.venue?.split(",")[0] ?? event.location}
            </span>
            <span style={{
              color: event.price === "FREE" ? "#10B981" : "#F5A623",
              fontSize: "15px",
              fontWeight: 700,
            }}>
              {event.price}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}