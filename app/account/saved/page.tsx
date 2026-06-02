"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatDate } from "@/lib/events";

export default function SavedEventsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [upcoming, setUpcoming] = useState<any[]>([]);
  const [past, setPast] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push("/auth/login"); return; }

      const { data: saved } = await supabase
        .from("saved_events")
        .select("event_id, created_at")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (!saved || saved.length === 0) {
        setLoading(false);
        return;
      }

      const eventIds = saved.map((s) => s.event_id);

      const { data: events } = await supabase
        .from("events")
        .select("*")
        .in("id", eventIds);

      if (events) {
        const today = new Date().toISOString().split("T")[0];
        setUpcoming(events.filter((e) => e.date >= today));
        setPast(events.filter((e) => e.date < today));
      }

      setLoading(false);
    }
    load();
  }, [router]);

  async function unsaveEvent(eventId: string) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    await supabase
      .from("saved_events")
      .delete()
      .eq("user_id", session.user.id)
      .eq("event_id", eventId);

    setUpcoming(upcoming.filter((e) => e.id !== eventId));
    setPast(past.filter((e) => e.id !== eventId));
  }

  if (loading) {
    return (
      <main style={{ backgroundColor: "#0D0D0D", minHeight: "100vh" }}>
        <Navbar />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh" }}>
          <p style={{ color: "#6B6B6B" }}>Loading saved events...</p>
        </div>
      </main>
    );
  }

  return (
    <main style={{ backgroundColor: "#0D0D0D", minHeight: "100vh" }}>
      <Navbar />

      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 24px 80px" }}>

        {/* Header */}
        <Link href="/account" style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          color: "#6B6B6B",
          fontSize: "14px",
          textDecoration: "none",
          marginBottom: "32px",
        }}>
          ← Back to Profile
        </Link>

        <div style={{ marginBottom: "40px" }}>
          <p style={{
            color: "#F5A623",
            fontSize: "11px",
            fontWeight: 600,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            marginBottom: "12px",
          }}>
            My Collection
          </p>
          <h1 style={{
            fontFamily: "Georgia, serif",
            fontSize: "36px",
            fontWeight: 900,
            color: "#E8E8E8",
          }}>
            Saved Events
          </h1>
        </div>

        {upcoming.length === 0 && past.length === 0 ? (
          <div style={{
            textAlign: "center",
            padding: "80px 0",
          }}>
            <p style={{ fontSize: "48px", marginBottom: "16px" }}>❤️</p>
            <p style={{
              fontFamily: "Georgia, serif",
              fontSize: "20px",
              fontWeight: 700,
              color: "#E8E8E8",
              marginBottom: "8px",
            }}>
              No saved events yet
            </p>
            <p style={{ color: "#6B6B6B", fontSize: "14px", marginBottom: "24px" }}>
              Browse events and tap the heart to save them here
            </p>
            <Link href="/" style={{
              display: "inline-block",
              backgroundColor: "#F5A623",
              color: "#0D0D0D",
              fontWeight: 700,
              fontSize: "14px",
              padding: "12px 24px",
              borderRadius: "12px",
              textDecoration: "none",
            }}>
              Browse Events
            </Link>
          </div>
        ) : (
          <>
            {/* Upcoming saved events */}
            {upcoming.length > 0 && (
              <div style={{ marginBottom: "48px" }}>
                <h2 style={{
                  fontFamily: "Georgia, serif",
                  fontSize: "22px",
                  fontWeight: 700,
                  color: "#E8E8E8",
                  marginBottom: "20px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}>
                  <span style={{ color: "#10B981" }}>●</span> Upcoming
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {upcoming.map((event) => (
                    <EventRow key={event.id} event={event} onUnsave={unsaveEvent} />
                  ))}
                </div>
              </div>
            )}

            {/* Past saved events */}
            {past.length > 0 && (
              <div>
                <h2 style={{
                  fontFamily: "Georgia, serif",
                  fontSize: "22px",
                  fontWeight: 700,
                  color: "#E8E8E8",
                  marginBottom: "20px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}>
                  <span style={{ color: "#6B6B6B" }}>●</span> Past Events
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {past.map((event) => (
                    <EventRow key={event.id} event={event} onUnsave={unsaveEvent} isPast />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}

function EventRow({ event, onUnsave, isPast = false }: {
  event: any;
  onUnsave: (id: string) => void;
  isPast?: boolean;
}) {
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
  };

  const catColor = categoryColors[event.category] ?? "#F5A623";

  return (
    <div style={{
      backgroundColor: "#1A1A1A",
      border: "1px solid #2A2A2A",
      borderRadius: "16px",
      padding: "20px 24px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "16px",
      flexWrap: "wrap",
      opacity: isPast ? 0.7 : 1,
    }}>
      <div style={{ flex: 1, minWidth: "200px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
          <span style={{
            fontSize: "11px",
            fontWeight: 600,
            padding: "2px 8px",
            borderRadius: "999px",
            color: catColor,
            backgroundColor: `${catColor}20`,
          }}>
            {event.category}
          </span>
          {isPast && (
            <span style={{
              fontSize: "11px",
              fontWeight: 600,
              padding: "2px 8px",
              borderRadius: "999px",
              color: "#6B6B6B",
              backgroundColor: "#2A2A2A",
            }}>
              Ended
            </span>
          )}
        </div>
        <h3 style={{
          fontFamily: "Georgia, serif",
          fontSize: "16px",
          fontWeight: 700,
          color: "#E8E8E8",
          marginBottom: "4px",
        }}>
          {event.title}
        </h3>
        <p style={{ color: "#6B6B6B", fontSize: "13px" }}>
          📅 {formatDate(event.date)} · 📍 {event.location}
        </p>
      </div>

      <div style={{ display: "flex", gap: "10px" }}>
        <Link href={`/event/${event.id}`} style={{
          backgroundColor: "transparent",
          color: "#F5A623",
          fontWeight: 600,
          fontSize: "13px",
          padding: "8px 16px",
          borderRadius: "999px",
          border: "1px solid #F5A623",
          textDecoration: "none",
        }}>
          View
        </Link>
        <button
          onClick={() => onUnsave(event.id)}
          style={{
            backgroundColor: "transparent",
            color: "#F43F5E",
            fontWeight: 600,
            fontSize: "13px",
            padding: "8px 16px",
            borderRadius: "999px",
            border: "1px solid #F43F5E30",
            cursor: "pointer",
          }}
        >
          ✕ Remove
        </button>
      </div>
    </div>
  );
}