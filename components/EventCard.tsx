import Link from "next/link";
import { Event, formatDate } from "@/lib/events";

const categoryColors: Record<string, string> = {
  Conference: "#F59E0B",
  Church: "#A78BFA",
  Seminar: "#22D3EE",
  Workshop: "#FB7185",
};

const tagColors: Record<string, { bg: string; color: string }> = {
  FEATURED: { bg: "#F5A623", color: "#0D0D0D" },
  FREE: { bg: "#10B981", color: "#ffffff" },
  NEW: { bg: "#06B6D4", color: "#ffffff" },
  HOT: { bg: "#F43F5E", color: "#ffffff" },
};

interface EventCardProps {
  event: Event;
  index?: number;
}

export default function EventCard({ event, index = 0 }: EventCardProps) {
  const catColor = categoryColors[event.category] ?? "#F5A623";
  const tagStyle = event.tag ? tagColors[event.tag] : null;
  const delay = `${(index + 1) * 0.05}s`;

  return (
    <Link href={`/event/${event.id}`} className="block group">
      <article
        className="event-card animate-fade-up rounded-2xl overflow-hidden h-full flex flex-col"
        style={{
          opacity: 0,
          animationDelay: delay,
          backgroundColor: "#1A1A1A",
          border: "1px solid #2A2A2A",
        }}
      >
        {/* Card header */}
        <div
          className="relative h-36 flex items-end p-4"
          style={{ background: `linear-gradient(135deg, ${catColor}99, #0D0D0D)` }}
        >
          <span
            className="text-xs font-semibold px-2.5 py-1 rounded-full"
            style={{ color: catColor, backgroundColor: `${catColor}20` }}
          >
            {event.category}
          </span>

          {event.tag && tagStyle && (
            <span
              className="absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full"
              style={{ backgroundColor: tagStyle.bg, color: tagStyle.color }}
            >
              {event.tag}
            </span>
          )}
        </div>

        {/* Card body */}
        <div className="p-5 flex flex-col flex-1">
          <p className="text-xs font-semibold uppercase tracking-widest mb-2"
            style={{ color: "#F5A623" }}>
            {formatDate(event.date)}
          </p>

          <h2 className="text-xl font-bold leading-snug mb-3 group-hover:opacity-80 transition-opacity"
            style={{ color: "#E8E8E8", fontFamily: "Georgia, serif" }}>
            {event.title}
          </h2>

          <p className="text-sm leading-relaxed flex-1 line-clamp-2"
            style={{ color: "#6B6B6B" }}>
            {event.description}
          </p>

          {/* Footer */}
          <div className="mt-4 pt-4 flex items-center justify-between"
            style={{ borderTop: "1px solid #2A2A2A" }}>
            <span className="text-xs" style={{ color: "#6B6B6B" }}>
              📍 {event.venue.split(",")[0]}
            </span>
            <span className="text-sm font-bold"
              style={{ color: event.price === "FREE" ? "#10B981" : "#F5A623" }}>
              {event.price}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}