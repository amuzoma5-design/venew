"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useRouter } from "next/navigation";
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

type Tab = "upcoming" | "past";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<any[]>([]);
  const [activity, setActivity] = useState<any[]>([]);
  const [saves, setSaves] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>("upcoming");

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push("/auth/login"); return; }

      const { data: eventsData } = await supabase
        .from("events")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      const ids = (eventsData ?? []).map((e) => e.id);

      let activityData: any[] = [];
      let savesData: any[] = [];

      if (ids.length > 0) {
        const { data: viewsRes } = await supabase
          .from("user_activity")
          .select("event_id")
          .eq("action_type", "viewed")
          .in("event_id", ids);
        activityData = viewsRes ?? [];

        const { data: savesRes } = await supabase
          .from("saved_events")
          .select("event_id")
          .in("event_id", ids);
        savesData = savesRes ?? [];
      }

      setEvents(eventsData ?? []);
      setActivity(activityData);
      setSaves(savesData);
      setLoading(false);
    }
    load();
  }, [router]);

  function viewsFor(eventId: string) {
    return activity.filter((a) => a.event_id === eventId).length;
  }

  function savesFor(eventId: string) {
    return saves.filter((s) => s.event_id === eventId).length;
  }

  async function deleteEvent(id: string) {
    if (!confirm("Delete this event permanently? This cannot be undone.")) return;
    await supabase.from("events").delete().eq("id", id);
    setEvents(events.filter((e) => e.id !== id));
  }

  if (loading) {
    return (
      <main style={{ backgroundColor: "#0D0D0D", minHeight: "100vh" }}>
        <Navbar />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh" }}>
          <p style={{ color: "#6B6B6B" }}>Loading your dashboard...</p>
        </div>
      </main>
    );
  }

  // Analytics
  const totalEvents = events.length;
  const totalViews = activity.length;
  const totalSaves = saves.length;
  const upcomingEvents = events.filter((e) => e.status !== "archived").length;
  const engagementRate = totalViews > 0 ? ((totalSaves / totalViews) * 100).toFixed(1) : "0.0";

  // Performance
  const eventsWithStats = events.map((e) => ({
    ...e,
    views: viewsFor(e.id),
    saves: savesFor(e.id),
  }));

  const mostViewed = [...eventsWithStats].sort((a, b) => b.views - a.views)[0];
  const mostSaved = [...eventsWithStats].sort((a, b) => b.saves - a.saves)[0];

  // Top category by engagement (views + saves)
  const categoryEngagement: Record<string, number> = {};
  eventsWithStats.forEach((e) => {
    categoryEngagement[e.category] = (categoryEngagement[e.category] || 0) + e.views + e.saves;
  });
  const topCategory = Object.entries(categoryEngagement).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

  const filteredEvents = eventsWithStats.filter((e) =>
    activeTab === "upcoming" ? e.status !== "archived" : e.status === "archived"
  );

  return (
    <main style={{ backgroundColor: "#0D0D0D", minHeight: "100vh" }}>
      <Navbar />

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "40px 24px 80px" }}>

        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <p style={{
            color: "#F5A623",
            fontSize: "11px",
            fontWeight: 600,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            marginBottom: "12px",
          }}>
            Discovery Command Center
          </p>
          <h1 style={{
            fontFamily: "Georgia, serif",
            fontSize: "36px",
            fontWeight: 900,
            color: "#E8E8E8",
          }}>
            My Dashboard
          </h1>
        </div>

        {totalEvents === 0 ? (
          <div style={{
            textAlign: "center",
            padding: "80px 24px",
            backgroundColor: "#1A1A1A",
            border: "1px solid #2A2A2A",
            borderRadius: "20px",
          }}>
            <p style={{ fontSize: "48px", marginBottom: "16px" }}>📋</p>
            <p style={{
              fontFamily: "Georgia, serif",
              fontSize: "22px",
              fontWeight: 700,
              color: "#E8E8E8",
              marginBottom: "8px",
            }}>
              You haven&apos;t created any events yet.
            </p>
            <p style={{ color: "#6B6B6B", fontSize: "14px", marginBottom: "24px" }}>
              List your first event and start tracking how it performs.
            </p>
            <Link href="/submit" style={{
              display: "inline-block",
              backgroundColor: "#F5A623",
              color: "#0D0D0D",
              fontWeight: 700,
              fontSize: "14px",
              padding: "12px 24px",
              borderRadius: "12px",
              textDecoration: "none",
            }}>
              Create Your First Event
            </Link>
          </div>
        ) : (
          <>
            {/* Analytics cards */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
              gap: "16px",
              marginBottom: "32px",
            }}>
              {[
                { label: "Total Discoveries", value: totalEvents, icon: "📋", color: "#E8E8E8" },
                { label: "Total Views", value: totalViews, icon: "👁️", color: "#A78BFA" },
                { label: "Total Saves", value: totalSaves, icon: "❤️", color: "#F43F5E" },
                { label: "Active Discoveries", value: upcomingEvents, icon: "📅", color: "#10B981" },
                { label: "Engagement Rate", value: `${engagementRate}%`, icon: "📈", color: "#F5A623" },
              ].map(({ label, value, icon, color }) => (
                <div key={label} style={{
                  backgroundColor: "#1A1A1A",
                  border: "1px solid #2A2A2A",
                  borderRadius: "16px",
                  padding: "20px",
                  textAlign: "center",
                }}>
                  <p style={{ fontSize: "22px", marginBottom: "6px" }}>{icon}</p>
                  <p style={{
                    fontFamily: "Georgia, serif",
                    fontSize: "28px",
                    fontWeight: 900,
                    color,
                    lineHeight: 1,
                  }}>
                    {value}
                  </p>
                  <p style={{ color: "#6B6B6B", fontSize: "11px", marginTop: "8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    {label}
                  </p>
                </div>
              ))}
            </div>

            {/* Quick actions */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: "16px",
              marginBottom: "32px",
            }}>
              {[
                { label: "➕ Submit a Discovery", href: "/submit" },
                { label: "⭐ Feature My Event", href: "/feature" },
                { label: "📊 View Analytics", href: "#performance" },
              ].map(({ label, href }) => (
                <Link key={label} href={href} style={{
                  backgroundColor: "#1A1A1A",
                  border: "1px solid #F5A62330",
                  borderRadius: "14px",
                  padding: "18px",
                  textAlign: "center",
                  color: "#F5A623",
                  fontWeight: 700,
                  fontSize: "14px",
                  textDecoration: "none",
                }}>
                  {label}
                </Link>
              ))}
            </div>

            {/* Performance */}
            <div id="performance" style={{ marginBottom: "32px" }}>
              <h2 style={{
                fontFamily: "Georgia, serif",
                fontSize: "20px",
                fontWeight: 700,
                color: "#E8E8E8",
                marginBottom: "16px",
              }}>
                📊 Discovery Performance
              </h2>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                gap: "16px",
              }}>
                <div style={{
                  backgroundColor: "#1A1A1A",
                  border: "1px solid #2A2A2A",
                  borderRadius: "16px",
                  padding: "24px",
                }}>
                  <p style={{ color: "#6B6B6B", fontSize: "12px", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                    👁️ Most Viewed Discovery
                  </p>
                  <p style={{ color: "#E8E8E8", fontWeight: 700, fontSize: "16px", marginBottom: "4px" }}>
                    {mostViewed && mostViewed.views > 0 ? mostViewed.title : "No views yet"}
                  </p>
                  {mostViewed && mostViewed.views > 0 && (
                    <p style={{ color: "#A78BFA", fontSize: "13px" }}>{mostViewed.views} views</p>
                  )}
                </div>

                <div style={{
                  backgroundColor: "#1A1A1A",
                  border: "1px solid #2A2A2A",
                  borderRadius: "16px",
                  padding: "24px",
                }}>
                  <p style={{ color: "#6B6B6B", fontSize: "12px", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                    ❤️ Most Saved Discovery
                  </p>
                  <p style={{ color: "#E8E8E8", fontWeight: 700, fontSize: "16px", marginBottom: "4px" }}>
                    {mostSaved && mostSaved.saves > 0 ? mostSaved.title : "No saves yet"}
                  </p>
                  {mostSaved && mostSaved.saves > 0 && (
                    <p style={{ color: "#F43F5E", fontSize: "13px" }}>{mostSaved.saves} saves</p>
                  )}
                </div>

                <div style={{
                  backgroundColor: "#1A1A1A",
                  border: "1px solid #2A2A2A",
                  borderRadius: "16px",
                  padding: "24px",
                }}>
                  <p style={{ color: "#6B6B6B", fontSize: "12px", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                    🏆 Top Performing Category
                  </p>
                  <p style={{ color: "#E8E8E8", fontWeight: 700, fontSize: "16px" }}>
                    {topCategory ?? "Not enough data yet"}
                  </p>
                </div>
              </div>
            </div>

            {/* My Discoveries */}
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px", marginBottom: "16px" }}>
                <h2 style={{
                  fontFamily: "Georgia, serif",
                  fontSize: "20px",
                  fontWeight: 700,
                  color: "#E8E8E8",
                }}>
                  My Discoveries
                </h2>

                {/* Tabs */}
                <div style={{ display: "flex", gap: "8px" }}>
                  {(["upcoming", "past"] as Tab[]).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      style={{
                        backgroundColor: activeTab === tab ? "#F5A623" : "#1A1A1A",
                        color: activeTab === tab ? "#0D0D0D" : "#6B6B6B",
                        fontWeight: 700,
                        fontSize: "13px",
                        padding: "8px 20px",
                        borderRadius: "999px",
                        border: activeTab === tab ? "none" : "1px solid #2A2A2A",
                        cursor: "pointer",
                        textTransform: "capitalize",
                      }}
                    >
                      {tab === "upcoming" ? "Active Discoveries" : "Past Discoveries"}
                    </button>
                  ))}
                </div>
              </div>

              {filteredEvents.length === 0 ? (
                <div style={{
                  textAlign: "center",
                  padding: "48px 0",
                  backgroundColor: "#1A1A1A",
                  border: "1px solid #2A2A2A",
                  borderRadius: "16px",
                }}>
                  <p style={{ color: "#6B6B6B", fontSize: "14px" }}>
                    {activeTab === "upcoming" ? "No active discoveries." : "No past discoveries yet."}
                  </p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {filteredEvents.map((event) => {
                    const catColor = categoryColors[event.category] ?? "#F5A623";
                    return (
                      <div key={event.id} style={{
                        backgroundColor: "#1A1A1A",
                        border: "1px solid #2A2A2A",
                        borderRadius: "16px",
                        padding: "16px 20px",
                        display: "flex",
                        alignItems: "center",
                        gap: "16px",
                        flexWrap: "wrap",
                      }}>
                        {/* Image */}
                        <div style={{
                          width: "64px",
                          height: "64px",
                          borderRadius: "10px",
                          backgroundColor: catColor + "20",
                          backgroundImage: event.image_url ? `url(${event.image_url})` : "none",
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          flexShrink: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "24px",
                        }}>
                          {!event.image_url && "🖼️"}
                        </div>

                        {/* Info */}
                        <div style={{ flex: 1, minWidth: "180px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px", flexWrap: "wrap" }}>
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
                            <span style={{
                              fontSize: "11px",
                              fontWeight: 600,
                              padding: "2px 8px",
                              borderRadius: "999px",
                              backgroundColor: event.status === "archived" ? "#2A2A2A" : "#10B98120",
                              color: event.status === "archived" ? "#6B6B6B" : "#10B981",
                            }}>
                              {event.status === "archived" ? "Archived" : "Upcoming"}
                            </span>
                          </div>
                          <p style={{ color: "#E8E8E8", fontWeight: 700, fontSize: "15px", fontFamily: "Georgia, serif", marginBottom: "2px" }}>
                            {event.title}
                          </p>
                          <p style={{ color: "#6B6B6B", fontSize: "12px" }}>
                            📅 {formatDate(event.date)}
                          </p>
                        </div>

                        {/* Stats */}
                        <div style={{ display: "flex", gap: "20px", textAlign: "center" }}>
                          <div>
                            <p style={{ color: "#A78BFA", fontWeight: 700, fontSize: "16px" }}>{event.views}</p>
                            <p style={{ color: "#6B6B6B", fontSize: "11px" }}>views</p>
                          </div>
                          <div>
                            <p style={{ color: "#F43F5E", fontWeight: 700, fontSize: "16px" }}>{event.saves}</p>
                            <p style={{ color: "#6B6B6B", fontSize: "11px" }}>saves</p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div style={{ display: "flex", gap: "8px" }}>
                          <Link href={`/event/${event.id}`} target="_blank" style={{
                            backgroundColor: "transparent",
                            color: "#6B6B6B",
                            fontWeight: 600,
                            fontSize: "12px",
                            padding: "8px 14px",
                            borderRadius: "999px",
                            border: "1px solid #2A2A2A",
                            textDecoration: "none",
                          }}>
                            View
                          </Link>
                          <Link href={`/account/events/${event.id}`} style={{
                            backgroundColor: "#F5A623",
                            color: "#0D0D0D",
                            fontWeight: 700,
                            fontSize: "12px",
                            padding: "8px 14px",
                            borderRadius: "999px",
                            textDecoration: "none",
                          }}>
                            Edit
                          </Link>
                          <button
                            onClick={() => deleteEvent(event.id)}
                            style={{
                              backgroundColor: "transparent",
                              color: "#F43F5E",
                              fontWeight: 600,
                              fontSize: "12px",
                              padding: "8px 14px",
                              borderRadius: "999px",
                              border: "1px solid #F43F5E30",
                              cursor: "pointer",
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </main>
  );
}