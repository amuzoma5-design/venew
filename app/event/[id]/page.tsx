import { supabase } from "@/lib/supabase";
import { formatDate } from "@/lib/events";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { notFound } from "next/navigation";
import ShareButtons from "@/components/ShareButtons";
import SaveEventButton from "@/components/SaveEventButton";
import ActivityTracker from "@/components/ActivityTracker";

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
};

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: event, error } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !event) notFound();

  const isArchived = event.status === "archived";
  const catColor = categoryColors[event.category] ?? "#F5A623";
  const registerButton = event.registration_url
    ? { type: "link", href: event.registration_url }
    : { type: "button" };

  return (
    <main style={{ backgroundColor: "#0D0D0D", minHeight: "100vh" }}>
      <Navbar />
      <ActivityTracker eventId={event.id} />

      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "40px 24px 80px" }}>

        <Link href="/" style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          color: "#6B6B6B",
          fontSize: "14px",
          textDecoration: "none",
          marginBottom: "32px",
        }}>
          ← Back to all events
        </Link>

        {/* Archived banner */}
        {isArchived && (
          <div style={{
            backgroundColor: "#2A1A00",
            border: "1px solid #F5A623",
            borderRadius: "12px",
            padding: "16px 20px",
            marginBottom: "24px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}>
            <span style={{ fontSize: "24px" }}>⏰</span>
            <div>
              <p style={{ color: "#F5A623", fontWeight: 700, fontSize: "15px" }}>
                This event has ended
              </p>
              <p style={{ color: "#6B6B6B", fontSize: "13px", marginTop: "2px" }}>
                You are viewing an archived event. Browse upcoming events below.
              </p>
            </div>
            <a href="/" style={{
              marginLeft: "auto",
              backgroundColor: "#F5A623",
              color: "#0D0D0D",
              fontWeight: 700,
              fontSize: "13px",
              padding: "8px 16px",
              borderRadius: "999px",
              textDecoration: "none",
              whiteSpace: "nowrap",
            }}>
              Browse Events
            </a>
          </div>
        )}

        <div style={{
          background: event.image_url
            ? `url(${event.image_url}) center/cover no-repeat`
            : `linear-gradient(135deg, ${catColor}cc 0%, #111 100%)`,
          borderRadius: "20px",
          padding: "48px",
          marginBottom: "32px",
          position: "relative",
          overflow: "hidden",
          minHeight: "420px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
        }}>
          <div style={{
            position: "absolute",
            inset: 0,
            background: event.image_url
              ? "linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.3))"
              : "none",
            borderRadius: "20px",
          }} />

          {!event.image_url && (
            <div style={{
              position: "absolute",
              top: "-40px",
              right: "-40px",
              width: "220px",
              height: "220px",
              borderRadius: "50%",
              backgroundColor: "rgba(255,255,255,0.05)",
            }} />
          )}

          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
              <span style={{
                fontSize: "12px",
                fontWeight: 600,
                padding: "6px 14px",
                borderRadius: "999px",
                color: catColor,
                border: `1px solid ${catColor}50`,
                backgroundColor: `${catColor}20`,
              }}>
                {event.category}
              </span>
              {event.tag && (
                <span style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  padding: "6px 14px",
                  borderRadius: "999px",
                  backgroundColor: "rgba(255,255,255,0.2)",
                  color: "white",
                }}>
                  {event.tag}
                </span>
              )}
              {isArchived && (
                <span style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  padding: "6px 14px",
                  borderRadius: "999px",
                  backgroundColor: "rgba(255,255,255,0.15)",
                  color: "rgba(255,255,255,0.7)",
                }}>
                  ENDED
                </span>
              )}
            </div>

            <h1 style={{
              fontFamily: "Georgia, serif",
              fontSize: "clamp(28px, 5vw, 48px)",
              fontWeight: 900,
              color: "white",
              lineHeight: 1.2,
              marginBottom: "20px",
            }}>
              {event.title}
            </h1>

            <div style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "20px",
              color: "rgba(255,255,255,0.75)",
              fontSize: "14px",
            }}>
              <span>📅 {formatDate(event.date)}</span>
              <span>🕐 {event.time}</span>
              <span>📍 {event.location}</span>
            </div>
          </div>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 320px",
          gap: "24px",
          alignItems: "start",
        }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

            <div style={{
              backgroundColor: "#1A1A1A",
              border: "1px solid #2A2A2A",
              borderRadius: "16px",
              padding: "28px",
            }}>
              <h2 style={{
                fontFamily: "Georgia, serif",
                fontSize: "20px",
                fontWeight: 700,
                color: "#E8E8E8",
                marginBottom: "14px",
              }}>
                About this Event
              </h2>
              <p style={{ color: "#6B6B6B", fontSize: "15px", lineHeight: 1.8 }}>
                {event.description || "No description provided."}
              </p>
            </div>

            {event.highlights && event.highlights.length > 0 && (
              <div style={{
                backgroundColor: "#1A1A1A",
                border: "1px solid #2A2A2A",
                borderRadius: "16px",
                padding: "28px",
              }}>
                <h2 style={{
                  fontFamily: "Georgia, serif",
                  fontSize: "20px",
                  fontWeight: 700,
                  color: "#E8E8E8",
                  marginBottom: "16px",
                }}>
                  What to Expect
                </h2>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "12px" }}>
                  {event.highlights.map((item: string) => (
                    <li key={item} style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                      <span style={{ color: "#F5A623", fontSize: "16px", lineHeight: 1.4 }}>✦</span>
                      <span style={{ color: "#6B6B6B", fontSize: "14px", lineHeight: 1.6 }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {event.speaker && (
              <div style={{
                backgroundColor: "#1A1A1A",
                border: "1px solid #2A2A2A",
                borderRadius: "16px",
                padding: "28px",
              }}>
                <h2 style={{
                  fontFamily: "Georgia, serif",
                  fontSize: "20px",
                  fontWeight: 700,
                  color: "#E8E8E8",
                  marginBottom: "16px",
                }}>
                  Featured Speaker
                </h2>
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <div style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "50%",
                    background: `linear-gradient(135deg, ${catColor}, #0D0D0D)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontFamily: "Georgia, serif",
                    fontSize: "22px",
                    fontWeight: 700,
                    flexShrink: 0,
                  }}>
                    {event.speaker.charAt(0)}
                  </div>
                  <div>
                    <p style={{ color: "#E8E8E8", fontWeight: 600, fontSize: "15px" }}>
                      {event.speaker}
                    </p>
                    <p style={{ color: "#6B6B6B", fontSize: "13px", marginTop: "2px" }}>
                      {event.speaker_title}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div style={{
            backgroundColor: "#1A1A1A",
            border: "1px solid #2A2A2A",
            borderRadius: "16px",
            padding: "28px",
            position: "sticky",
            top: "88px",
          }}>
            <div style={{ textAlign: "center", marginBottom: "24px" }}>
              <p style={{ color: "#6B6B6B", fontSize: "13px", marginBottom: "4px" }}>Price</p>
              <p style={{
                fontFamily: "Georgia, serif",
                fontSize: "40px",
                fontWeight: 900,
                color: event.price === "FREE" ? "#10B981" : "#F5A623",
              }}>
                {event.price || "FREE"}
              </p>
            </div>

            {isArchived ? (
              <button style={{
                width: "100%",
                backgroundColor: "#2A2A2A",
                color: "#6B6B6B",
                fontWeight: 700,
                fontSize: "14px",
                padding: "14px",
                borderRadius: "12px",
                border: "none",
                cursor: "not-allowed",
                marginBottom: "10px",
              }}>
                Event Has Ended
              </button>
            ) : registerButton.type === "link" ? (
              <Link
                href={registerButton.href as string}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "block",
                  width: "100%",
                  backgroundColor: "#F5A623",
                  color: "#0D0D0D",
                  fontWeight: 700,
                  fontSize: "14px",
                  padding: "14px",
                  borderRadius: "12px",
                  textDecoration: "none",
                  textAlign: "center",
                  marginBottom: "10px",
                  boxSizing: "border-box",
                }}
              >
                Register Now →
              </Link>
            ) : (
              <button style={{
                width: "100%",
                backgroundColor: "#2A2A2A",
                color: "#6B6B6B",
                fontWeight: 700,
                fontSize: "14px",
                padding: "14px",
                borderRadius: "12px",
                border: "none",
                cursor: "not-allowed",
                marginBottom: "10px",
              }}>
                Registration Coming Soon
              </button>
            )}

            <SaveEventButton eventId={event.id} />
            <ShareButtons eventId={event.id} eventTitle={event.title} />

            <div style={{
              marginTop: "24px",
              paddingTop: "20px",
              borderTop: "1px solid #2A2A2A",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}>
              {[
                { icon: "📅", label: "Date", value: formatDate(event.date) },
                { icon: "🕐", label: "Time", value: event.time || "TBC" },
                { icon: "📍", label: "Venue", value: event.venue || "TBC" },
                { icon: "🏙️", label: "City", value: event.location },
              ].map(({ icon, label, value }) => (
                <div key={label} style={{ display: "flex", gap: "12px" }}>
                  <span style={{ fontSize: "16px", lineHeight: 1 }}>{icon}</span>
                  <div>
                    <p style={{
                      color: "#6B6B6B",
                      fontSize: "11px",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                    }}>
                      {label}
                    </p>
                    <p style={{ color: "#E8E8E8", fontSize: "13px", marginTop: "2px" }}>
                      {value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}