"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function AdminPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [error, setError] = useState("");

  const ADMIN_PASSWORD = "venew2026";

  function handleLogin() {
    if (password === ADMIN_PASSWORD) {
      setAuthed(true);
      loadEvents();
    } else {
      setError("Wrong password.");
    }
  }

  async function loadEvents() {
    setLoading(true);
    const { data } = await supabase
      .from("events")
      .select("*")
      .order("created_at", { ascending: false });
    setEvents(data ?? []);
    setLoading(false);
  }

  async function approveEvent(id: string) {
    await supabase.from("events").update({ approved: true }).eq("id", id);
    setEvents(events.map(e => e.id === id ? { ...e, approved: true } : e));
  }

  async function rejectEvent(id: string) {
    if (!confirm("Delete this event permanently?")) return;
    await supabase.from("events").delete().eq("id", id);
    setEvents(events.filter(e => e.id !== id));
  }

  if (!authed) {
    return (
      <main style={{ backgroundColor: "#0D0D0D", minHeight: "100vh" }}>
        <div style={{ padding: "24px", textAlign: "center" }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <span style={{ color: "#F5A623", fontSize: "28px", fontWeight: 900, fontFamily: "Georgia, serif" }}>VE</span>
            <span style={{ color: "#E8E8E8", fontSize: "28px", fontWeight: 900, fontFamily: "Georgia, serif" }}>NEW</span>
          </Link>
        </div>

        <div style={{ maxWidth: "400px", margin: "60px auto", padding: "0 24px" }}>
          <div style={{
            backgroundColor: "#1A1A1A",
            border: "1px solid #2A2A2A",
            borderRadius: "20px",
            padding: "36px",
            textAlign: "center",
          }}>
            <p style={{ fontSize: "40px", marginBottom: "16px" }}>👑</p>
            <h1 style={{
              fontFamily: "Georgia, serif",
              fontSize: "28px",
              fontWeight: 900,
              color: "#E8E8E8",
              marginBottom: "8px",
            }}>
              Admin Panel
            </h1>
            <p style={{ color: "#6B6B6B", fontSize: "14px", marginBottom: "28px" }}>
              Enter your admin password to continue
            </p>

            {error && (
              <div style={{
                backgroundColor: "#2A0A0A",
                border: "1px solid #F43F5E",
                borderRadius: "10px",
                padding: "12px",
                color: "#F43F5E",
                fontSize: "14px",
                marginBottom: "20px",
              }}>
                {error}
              </div>
            )}

            <input
              type="password"
              placeholder="Admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              style={{
                width: "100%",
                backgroundColor: "#111",
                border: "1px solid #2A2A2A",
                borderRadius: "10px",
                padding: "12px 16px",
                color: "#E8E8E8",
                fontSize: "14px",
                outline: "none",
                boxSizing: "border-box",
                marginBottom: "16px",
              }}
            />

            <button
              onClick={handleLogin}
              style={{
                width: "100%",
                backgroundColor: "#F5A623",
                color: "#0D0D0D",
                fontWeight: 700,
                fontSize: "15px",
                padding: "14px",
                borderRadius: "12px",
                border: "none",
                cursor: "pointer",
              }}
            >
              Enter Admin Panel →
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main style={{ backgroundColor: "#0D0D0D", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{
        backgroundColor: "#141414",
        borderBottom: "1px solid #2A2A2A",
        padding: "0 24px",
        height: "64px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <span style={{ color: "#F5A623", fontSize: "22px", fontWeight: 900, fontFamily: "Georgia, serif" }}>VE</span>
            <span style={{ color: "#E8E8E8", fontSize: "22px", fontWeight: 900, fontFamily: "Georgia, serif" }}>NEW</span>
          </Link>
          <span style={{
            backgroundColor: "#F5A623",
            color: "#0D0D0D",
            fontSize: "11px",
            fontWeight: 700,
            padding: "3px 10px",
            borderRadius: "999px",
          }}>
            ADMIN
          </span>
        </div>
        <Link href="/" style={{ color: "#6B6B6B", fontSize: "14px", textDecoration: "none" }}>
          ← Back to site
        </Link>
      </div>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "40px 24px" }}>

        {/* Stats */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "16px",
          marginBottom: "40px",
        }}>
          {[
            { label: "Total Events", value: events.length, color: "#E8E8E8" },
            { label: "Approved", value: events.filter(e => e.approved).length, color: "#10B981" },
            { label: "Pending", value: events.filter(e => !e.approved).length, color: "#F5A623" },
          ].map(({ label, value, color }) => (
            <div key={label} style={{
              backgroundColor: "#1A1A1A",
              border: "1px solid #2A2A2A",
              borderRadius: "16px",
              padding: "24px",
              textAlign: "center",
            }}>
              <p style={{
                fontFamily: "Georgia, serif",
                fontSize: "40px",
                fontWeight: 900,
                color,
                lineHeight: 1,
              }}>
                {value}
              </p>
              <p style={{ color: "#6B6B6B", fontSize: "13px", marginTop: "8px" }}>
                {label}
              </p>
            </div>
          ))}
        </div>

        {/* Events table */}
        <h2 style={{
          fontFamily: "Georgia, serif",
          fontSize: "24px",
          fontWeight: 700,
          color: "#E8E8E8",
          marginBottom: "20px",
        }}>
          All Submitted Events
        </h2>

        {loading ? (
          <p style={{ color: "#6B6B6B" }}>Loading events...</p>
        ) : events.length === 0 ? (
          <p style={{ color: "#6B6B6B" }}>No events yet.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {events.map((event) => (
              <div key={event.id} style={{
                backgroundColor: "#1A1A1A",
                border: `1px solid ${event.approved ? "#10B98130" : "#F5A62330"}`,
                borderRadius: "16px",
                padding: "20px 24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "16px",
              }}>
                {/* Event info */}
                <div style={{ flex: 1, minWidth: "200px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                    <h3 style={{
                      color: "#E8E8E8",
                      fontWeight: 700,
                      fontSize: "16px",
                      fontFamily: "Georgia, serif",
                    }}>
                      {event.title}
                    </h3>
                    <span style={{
                      fontSize: "11px",
                      fontWeight: 600,
                      padding: "2px 8px",
                      borderRadius: "999px",
                      backgroundColor: event.approved ? "#10B98120" : "#F5A62320",
                      color: event.approved ? "#10B981" : "#F5A623",
                    }}>
                      {event.approved ? "Approved" : "Pending"}
                    </span>
                  </div>
                  <p style={{ color: "#6B6B6B", fontSize: "13px" }}>
                    {event.category} · {event.location} · {event.date}
                  </p>
                </div>

                {/* Action buttons */}
                <div style={{ display: "flex", gap: "10px" }}>
                  {!event.approved && (
                    <button
                      onClick={() => approveEvent(event.id)}
                      style={{
                        backgroundColor: "#10B981",
                        color: "white",
                        fontWeight: 700,
                        fontSize: "13px",
                        padding: "8px 18px",
                        borderRadius: "999px",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      ✓ Approve
                    </button>
                  )}
                  <button
                    onClick={() => rejectEvent(event.id)}
                    style={{
                      backgroundColor: "transparent",
                      color: "#F43F5E",
                      fontWeight: 700,
                      fontSize: "13px",
                      padding: "8px 18px",
                      borderRadius: "999px",
                      border: "1px solid #F43F5E30",
                      cursor: "pointer",
                    }}
                  >
                    ✕ Delete
                  </button>
                  <Link
                    href={`/event/${event.id}`}
                    target="_blank"
                    style={{
                      backgroundColor: "transparent",
                      color: "#6B6B6B",
                      fontWeight: 600,
                      fontSize: "13px",
                      padding: "8px 18px",
                      borderRadius: "999px",
                      border: "1px solid #2A2A2A",
                      textDecoration: "none",
                    }}
                  >
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}