"use client";
import * as React from "react";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { hasPermission } from "@/lib/permissions";

type Tab = "events" | "users" | "analytics" | "blog" | "spotlight" | "editors";

export default function AdminPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<Tab | null>(null);

  useEffect(() => {
    checkExistingSession();
  }, []);

  async function checkExistingSession() {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      await loadRoleAndEnter(session.user.id);
    }
    setCheckingSession(false);
  }

  async function loadRoleAndEnter(userId: string) {
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", userId).single();
    const userRole = profile?.role ?? "user";
    if (userRole === "user") {
      setError("This account does not have admin access.");
      await supabase.auth.signOut();
      return;
    }
    setRole(userRole);
    setAuthed(true);
    if (hasPermission(userRole, "manage_discoveries") || hasPermission(userRole, "manage_users") || hasPermission(userRole, "view_analytics")) {
      loadAll();
    } else {
      setLoading(false);
    }
    if (hasPermission(userRole, "manage_discoveries")) setActiveTab("events");
    else if (hasPermission(userRole, "manage_blog")) setActiveTab("blog");
    else if (hasPermission(userRole, "manage_spotlight")) setActiveTab("spotlight");
    else if (hasPermission(userRole, "manage_finance")) setActiveTab("editors");
  }

  async function handleLogin() {
    setError("");
    const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError || !data.user) {
      setError("Incorrect email or password.");
      return;
    }
    await loadRoleAndEnter(data.user.id);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setAuthed(false);
    setRole(null);
    setEmail("");
    setPassword("");
  }

  async function loadAll() {
    setLoading(true);
    const { data: eventsData } = await supabase.from("events").select("*").order("created_at", { ascending: false });
    setEvents(eventsData ?? []);
    const { data: profilesData } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
    setUsers(profilesData ?? []);
    const { count: totalViews } = await supabase.from("user_activity").select("*", { count: "exact", head: true }).eq("action_type", "viewed");
    const { count: totalSaves } = await supabase.from("saved_events").select("*", { count: "exact", head: true });
    const { count: totalUsers } = await supabase.from("profiles").select("*", { count: "exact", head: true });
    const { count: totalEvents } = await supabase.from("events").select("*", { count: "exact", head: true });
    const { count: approvedEvents } = await supabase.from("events").select("*", { count: "exact", head: true }).eq("approved", true);
    const { count: pendingEvents } = await supabase.from("events").select("*", { count: "exact", head: true }).eq("approved", false);
    const { data: viewsData } = await supabase.from("user_activity").select("event_id").eq("action_type", "viewed");
    const viewCounts: Record<string, number> = {};
    viewsData?.forEach(({ event_id }) => { if (event_id) viewCounts[event_id] = (viewCounts[event_id] || 0) + 1; });
    const topEventIds = Object.entries(viewCounts).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([id]) => id);
    let topEvents: any[] = [];
    if (topEventIds.length > 0) {
      const { data } = await supabase.from("events").select("id, title, category").in("id", topEventIds);
      topEvents = (data || []).map((e) => ({ ...e, views: viewCounts[e.id] || 0 })).sort((a, b) => b.views - a.views);
    }
    const { data: savesData } = await supabase.from("saved_events").select("event_id");
    const saveCounts: Record<string, number> = {};
    savesData?.forEach(({ event_id }) => { if (event_id) saveCounts[event_id] = (saveCounts[event_id] || 0) + 1; });
    const topSavedIds = Object.entries(saveCounts).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([id]) => id);
    let topSaved: any[] = [];
    if (topSavedIds.length > 0) {
      const { data } = await supabase.from("events").select("id, title, category").in("id", topSavedIds);
      topSaved = (data || []).map((e) => ({ ...e, saves: saveCounts[e.id] || 0 })).sort((a, b) => b.saves - a.saves);
    }
    const { data: citiesData } = await supabase.from("profiles").select("city");
    const cityCounts: Record<string, number> = {};
    citiesData?.forEach(({ city }) => { if (city) cityCounts[city] = (cityCounts[city] || 0) + 1; });
    const { data: interestsData } = await supabase.from("profiles").select("interests");
    const interestCounts: Record<string, number> = {};
    interestsData?.forEach(({ interests }) => { interests?.forEach((i: string) => { interestCounts[i] = (interestCounts[i] || 0) + 1; }); });
    setAnalytics({ totalViews: totalViews || 0, totalSaves: totalSaves || 0, totalUsers: totalUsers || 0, totalEvents: totalEvents || 0, approvedEvents: approvedEvents || 0, pendingEvents: pendingEvents || 0, topEvents, topSaved, cityCounts, interestCounts });
    setLoading(false);
  }

  async function approveEvent(id: string) {
    await supabase.from("events").update({ approved: true }).eq("id", id);
    setEvents(events.map(e => e.id === id ? { ...e, approved: true } : e));
  }

  async function featureEvent(id: string, featured: boolean) {
    await supabase.from("events").update({ featured }).eq("id", id);
    setEvents(events.map(e => e.id === id ? { ...e, featured } : e));
  }

  async function rejectEvent(id: string) {
    if (!confirm("Delete this event permanently?")) return;
    await supabase.from("events").delete().eq("id", id);
    setEvents(events.filter(e => e.id !== id));
  }

   if (checkingSession) {
    return (
      <main style={{ backgroundColor: "#0D0D0D", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#6B6B6B", fontSize: "16px" }}>Checking session...</p>
      </main>
    );
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
          <div style={{ backgroundColor: "#1A1A1A", border: "1px solid #2A2A2A", borderRadius: "20px", padding: "36px", textAlign: "center" }}>
            <p style={{ fontSize: "40px", marginBottom: "16px" }}>👑</p>
            <h1 style={{ fontFamily: "Georgia, serif", fontSize: "28px", fontWeight: 900, color: "#E8E8E8", marginBottom: "8px" }}>Admin Panel</h1>
            <p style={{ color: "#6B6B6B", fontSize: "14px", marginBottom: "28px" }}>Sign in with your VENEW account to continue</p>
            {error && <div style={{ backgroundColor: "#2A0A0A", border: "1px solid #F43F5E", borderRadius: "10px", padding: "12px", color: "#F43F5E", fontSize: "14px", marginBottom: "20px" }}>{error}</div>}
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: "100%", backgroundColor: "#111", border: "1px solid #2A2A2A", borderRadius: "10px", padding: "12px 16px", color: "#E8E8E8", fontSize: "14px", outline: "none", boxSizing: "border-box", marginBottom: "12px" }} />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleLogin()} style={{ width: "100%", backgroundColor: "#111", border: "1px solid #2A2A2A", borderRadius: "10px", padding: "12px 16px", color: "#E8E8E8", fontSize: "14px", outline: "none", boxSizing: "border-box", marginBottom: "16px" }} />
            <button onClick={handleLogin} style={{ width: "100%", backgroundColor: "#F5A623", color: "#0D0D0D", fontWeight: 700, fontSize: "15px", padding: "14px", borderRadius: "12px", border: "none", cursor: "pointer" }}>Sign In →</button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main style={{ backgroundColor: "#0D0D0D", minHeight: "100vh" }}>
      <div style={{ backgroundColor: "#141414", borderBottom: "1px solid #2A2A2A", padding: "0 24px", height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <span style={{ color: "#F5A623", fontSize: "22px", fontWeight: 900, fontFamily: "Georgia, serif" }}>VE</span>
            <span style={{ color: "#E8E8E8", fontSize: "22px", fontWeight: 900, fontFamily: "Georgia, serif" }}>NEW</span>
          </Link>
          <span style={{ backgroundColor: "#F5A623", color: "#0D0D0D", fontSize: "11px", fontWeight: 700, padding: "3px 10px", borderRadius: "999px" }}>ADMIN</span>
        </div>
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span style={{ color: "#6B6B6B", fontSize: "13px" }}>Role: {role}</span>
          <button onClick={handleLogout} style={{ backgroundColor: "transparent", border: "1px solid #2A2A2A", color: "#6B6B6B", fontSize: "13px", padding: "6px 14px", borderRadius: "999px", cursor: "pointer" }}>Log out</button>
          <Link href="/" style={{ color: "#6B6B6B", fontSize: "14px", textDecoration: "none" }}>← Back to site</Link>
        </div>
      </div>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "40px 24px" }}>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "16px", marginBottom: "32px" }}>
          {[
            { label: "Total Discoveries", value: analytics.totalEvents, color: "#E8E8E8" },
            { label: "Live", value: analytics.approvedEvents, color: "#10B981" },
            { label: "Pending Review", value: analytics.pendingEvents, color: "#F5A623" },
            { label: "Registered Users", value: analytics.totalUsers, color: "#3B82F6" },
            { label: "Total Views", value: analytics.totalViews, color: "#A78BFA" },
            { label: "Total Saves", value: analytics.totalSaves, color: "#F43F5E" },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ backgroundColor: "#1A1A1A", border: "1px solid #2A2A2A", borderRadius: "16px", padding: "20px", textAlign: "center" }}>
              <p style={{ fontFamily: "Georgia, serif", fontSize: "32px", fontWeight: 900, color, lineHeight: 1 }}>{loading ? "..." : value ?? 0}</p>
              <p style={{ color: "#6B6B6B", fontSize: "12px", marginTop: "8px" }}>{label}</p>
            </div>
          ))}
        </div>

                {/* Tabs — only show tabs this role actually has access to */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "32px", flexWrap: "wrap" }}>
          {([
            { tab: "events" as Tab, permission: "manage_discoveries" as const, label: "📋 Discoveries" },
            { tab: "users" as Tab, permission: "manage_users" as const, label: "👥 Users" },
            { tab: "analytics" as Tab, permission: "view_analytics" as const, label: "📊 Analytics" },
            { tab: "blog" as Tab, permission: "manage_blog" as const, label: "✍️ Discovery Hub" },
            { tab: "spotlight" as Tab, permission: "manage_spotlight" as const, label: "✨ Spotlight" },
            { tab: "editors" as Tab, permission: "manage_editors" as const, label: "🔑 Editors" },
          ]).filter(({ permission }) => hasPermission(role, permission)).map(({ tab, label }) => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{ backgroundColor: activeTab === tab ? "#F5A623" : "#1A1A1A", color: activeTab === tab ? "#0D0D0D" : "#6B6B6B", fontWeight: 700, fontSize: "13px", padding: "8px 20px", borderRadius: "999px", border: activeTab === tab ? "none" : "1px solid #2A2A2A", cursor: "pointer" }}>
              {label}
            </button>
          ))}
        </div>

        {/* Events tab */}
        {activeTab === "events" && (
          <div>
            <h2 style={{ fontFamily: "Georgia, serif", fontSize: "24px", fontWeight: 700, color: "#E8E8E8", marginBottom: "20px" }}>All Submitted Discoveries</h2>
            {loading ? <p style={{ color: "#6B6B6B" }}>Loading discoveries...</p> : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {events.map((event) => (
                  <div key={event.id} style={{ backgroundColor: "#1A1A1A", border: "1px solid #2A2A2A", borderRadius: "16px", padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
                    <div style={{ flex: 1, minWidth: "200px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px", flexWrap: "wrap" }}>
                        <h3 style={{ color: "#E8E8E8", fontWeight: 700, fontSize: "16px", fontFamily: "Georgia, serif" }}>{event.title}</h3>
                        <span style={{ fontSize: "11px", fontWeight: 600, padding: "2px 8px", borderRadius: "999px", backgroundColor: event.approved ? "#10B98120" : "#F5A62320", color: event.approved ? "#10B981" : "#F5A623" }}>{event.approved ? "Approved" : "Pending"}</span>
                                                {event.featured && <span style={{ fontSize: "11px", fontWeight: 600, padding: "2px 8px", borderRadius: "999px", backgroundColor: "#F5A62320", color: "#F5A623" }}>⭐ Featured</span>}
                        {event.source === "ai_agent" && <span style={{ fontSize: "11px", fontWeight: 600, padding: "2px 8px", borderRadius: "999px", backgroundColor: "#3B82F620", color: "#3B82F6" }}>🤖 AI-sourced</span>}
                      </div>
                      <p style={{ color: "#6B6B6B", fontSize: "13px" }}>{event.category} · {event.location} · {event.date}</p>
                    </div>
                    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                      {!event.approved && <button onClick={() => approveEvent(event.id)} style={{ backgroundColor: "#10B981", color: "white", fontWeight: 700, fontSize: "13px", padding: "8px 18px", borderRadius: "999px", border: "none", cursor: "pointer" }}>✓ Approve</button>}
                      <button onClick={() => featureEvent(event.id, !event.featured)} style={{ backgroundColor: event.featured ? "#F5A623" : "transparent", color: event.featured ? "#0D0D0D" : "#F5A623", fontWeight: 700, fontSize: "13px", padding: "8px 18px", borderRadius: "999px", border: "1px solid #F5A623", cursor: "pointer" }}>{event.featured ? "⭐ Featured" : "Feature"}</button>
                      <button onClick={() => rejectEvent(event.id)} style={{ backgroundColor: "transparent", color: "#F43F5E", fontWeight: 700, fontSize: "13px", padding: "8px 18px", borderRadius: "999px", border: "1px solid #F43F5E30", cursor: "pointer" }}>✕ Delete</button>
                      <Link href={`/event/${event.id}`} target="_blank" style={{ backgroundColor: "transparent", color: "#6B6B6B", fontWeight: 600, fontSize: "13px", padding: "8px 18px", borderRadius: "999px", border: "1px solid #2A2A2A", textDecoration: "none" }}>View</Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Users tab */}
        {activeTab === "users" && (
          <div>
            <h2 style={{ fontFamily: "Georgia, serif", fontSize: "24px", fontWeight: 700, color: "#E8E8E8", marginBottom: "20px" }}>Registered Users</h2>
            {loading ? <p style={{ color: "#6B6B6B" }}>Loading users...</p> : users.length === 0 ? <p style={{ color: "#6B6B6B" }}>No users yet.</p> : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {users.map((user) => (
                  <div key={user.id} style={{ backgroundColor: "#1A1A1A", border: "1px solid #2A2A2A", borderRadius: "16px", padding: "20px 24px" }}>
                    <p style={{ color: "#E8E8E8", fontWeight: 700, fontSize: "15px", fontFamily: "Georgia, serif" }}>{user.display_name || "No name set"}</p>
                    <p style={{ color: "#6B6B6B", fontSize: "13px", marginTop: "4px" }}>📍 {user.city || "City not set"} · Joined {new Date(user.created_at).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}</p>
                    {user.interests && user.interests.length > 0 && (
                      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "8px" }}>
                        {user.interests.map((interest: string) => (
                          <span key={interest} style={{ fontSize: "11px", fontWeight: 600, padding: "2px 8px", borderRadius: "999px", backgroundColor: "#F5A62315", color: "#F5A623" }}>{interest}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Analytics tab */}
        {activeTab === "analytics" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div style={{ backgroundColor: "#1A1A1A", border: "1px solid #2A2A2A", borderRadius: "16px", padding: "28px" }}>
              <h2 style={{ fontFamily: "Georgia, serif", fontSize: "20px", fontWeight: 700, color: "#E8E8E8", marginBottom: "20px" }}>👁️ Most Viewed Discoveries</h2>
              {analytics.topEvents?.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {analytics.topEvents.map((event: any, i: number) => (
                    <div key={event.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", backgroundColor: "#111", borderRadius: "10px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <span style={{ color: "#F5A623", fontWeight: 900, fontSize: "18px", fontFamily: "Georgia, serif" }}>{i + 1}</span>
                        <div>
                          <p style={{ color: "#E8E8E8", fontSize: "14px", fontWeight: 600 }}>{event.title}</p>
                          <p style={{ color: "#6B6B6B", fontSize: "12px" }}>{event.category}</p>
                        </div>
                      </div>
                      <span style={{ color: "#A78BFA", fontWeight: 700, fontSize: "14px" }}>{event.views} views</span>
                    </div>
                  ))}
                </div>
              ) : <p style={{ color: "#6B6B6B", fontSize: "14px" }}>No view data yet.</p>}
            </div>

            <div style={{ backgroundColor: "#1A1A1A", border: "1px solid #2A2A2A", borderRadius: "16px", padding: "28px" }}>
              <h2 style={{ fontFamily: "Georgia, serif", fontSize: "20px", fontWeight: 700, color: "#E8E8E8", marginBottom: "20px" }}>❤️ Most Saved Discoveries</h2>
              {analytics.topSaved?.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {analytics.topSaved.map((event: any, i: number) => (
                    <div key={event.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", backgroundColor: "#111", borderRadius: "10px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <span style={{ color: "#F5A623", fontWeight: 900, fontSize: "18px", fontFamily: "Georgia, serif" }}>{i + 1}</span>
                        <div>
                          <p style={{ color: "#E8E8E8", fontSize: "14px", fontWeight: 600 }}>{event.title}</p>
                          <p style={{ color: "#6B6B6B", fontSize: "12px" }}>{event.category}</p>
                        </div>
                      </div>
                      <span style={{ color: "#F43F5E", fontWeight: 700, fontSize: "14px" }}>{event.saves} saves</span>
                    </div>
                  ))}
                </div>
              ) : <p style={{ color: "#6B6B6B", fontSize: "14px" }}>No save data yet.</p>}
            </div>

            <div style={{ backgroundColor: "#1A1A1A", border: "1px solid #2A2A2A", borderRadius: "16px", padding: "28px" }}>
              <h2 style={{ fontFamily: "Georgia, serif", fontSize: "20px", fontWeight: 700, color: "#E8E8E8", marginBottom: "20px" }}>🏙️ Users by City</h2>
              {Object.keys(analytics.cityCounts || {}).length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {Object.entries(analytics.cityCounts || {}).sort((a: any, b: any) => b[1] - a[1]).map(([city, count]: any) => (
                    <div key={city} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px", backgroundColor: "#111", borderRadius: "10px" }}>
                      <span style={{ color: "#E8E8E8", fontSize: "14px" }}>📍 {city}</span>
                      <span style={{ color: "#3B82F6", fontWeight: 700, fontSize: "14px" }}>{count} users</span>
                    </div>
                  ))}
                </div>
              ) : <p style={{ color: "#6B6B6B", fontSize: "14px" }}>No city data yet.</p>}
            </div>

            <div style={{ backgroundColor: "#1A1A1A", border: "1px solid #2A2A2A", borderRadius: "16px", padding: "28px" }}>
              <h2 style={{ fontFamily: "Georgia, serif", fontSize: "20px", fontWeight: 700, color: "#E8E8E8", marginBottom: "20px" }}>⭐ Popular Interests</h2>
              {Object.keys(analytics.interestCounts || {}).length > 0 ? (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                  {Object.entries(analytics.interestCounts || {}).sort((a: any, b: any) => b[1] - a[1]).map(([interest, count]: any) => (
                    <div key={interest} style={{ padding: "8px 16px", backgroundColor: "#111", borderRadius: "999px", border: "1px solid #2A2A2A", display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ color: "#F5A623", fontSize: "13px", fontWeight: 600 }}>{interest}</span>
                      <span style={{ color: "#6B6B6B", fontSize: "12px" }}>{count}</span>
                    </div>
                  ))}
                </div>
              ) : <p style={{ color: "#6B6B6B", fontSize: "14px" }}>No interest data yet.</p>}
            </div>
          </div>
        )}

               {/* Blog tab */}
        {activeTab === "blog" && <BlogAdmin />}
        {activeTab === "spotlight" && <SpotlightAdmin />}
        {activeTab === "editors" && <EditorsAdmin />}

      </div>
    </main>
  );
}

function EditorsAdmin() {
  const [editors, setEditors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newName, setNewName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);
  const [passwordEditId, setPasswordEditId] = useState<string | null>(null);
  const [passwordEditValue, setPasswordEditValue] = useState("");

  useEffect(() => { loadEditors(); }, []);

  async function getAuthHeader() {
    const { data: { session } } = await supabase.auth.getSession();
    return { Authorization: `Bearer ${session?.access_token}` };
  }

  async function loadEditors() {
    setLoading(true);
    const headers = await getAuthHeader();
    const res = await fetch("/api/admin/editors", { headers });
    const data = await res.json();
    setEditors(data.editors ?? []);
    setLoading(false);
  }

  async function createEditor() {
    if (!newEmail || !newPassword || newPassword.length < 8) {
      setError("Email and a password of at least 8 characters are required.");
      return;
    }
    setSaving(true);
    setError("");
    const headers = await getAuthHeader();
    const res = await fetch("/api/admin/editors", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...headers },
      body: JSON.stringify({ email: newEmail, password: newPassword, displayName: newName }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) {
      setError(data.error || "Could not create editor.");
    } else {
      setSuccess("Editor created. Share their email and password with them directly.");
      setNewEmail(""); setNewPassword(""); setNewName(""); setShowCreate(false);
      loadEditors();
      setTimeout(() => setSuccess(""), 4000);
    }
  }

  async function updatePassword(id: string) {
    if (!passwordEditValue || passwordEditValue.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }
    const headers = await getAuthHeader();
    const res = await fetch(`/api/admin/editors/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...headers },
      body: JSON.stringify({ newPassword: passwordEditValue }),
    });
    if (res.ok) {
      setSuccess("Password updated.");
      setPasswordEditId(null);
      setPasswordEditValue("");
      setTimeout(() => setSuccess(""), 3000);
    } else {
      const data = await res.json();
      setError(data.error || "Could not update password.");
    }
  }

  async function revokeEditor(id: string) {
    if (!confirm("Revoke this editor's access? They will keep their login but lose editor permissions.")) return;
    const headers = await getAuthHeader();
    const res = await fetch(`/api/admin/editors/${id}`, { method: "DELETE", headers });
    if (res.ok) {
      setEditors(editors.filter((e) => e.id !== id));
    }
  }

  const inputStyle = { width: "100%", backgroundColor: "#111", border: "1px solid #2A2A2A", borderRadius: "10px", padding: "12px 16px", color: "#E8E8E8", fontSize: "14px", outline: "none", boxSizing: "border-box" as const };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
        <h2 style={{ fontFamily: "Georgia, serif", fontSize: "24px", fontWeight: 700, color: "#E8E8E8" }}>🔑 Editor Accounts</h2>
        <button onClick={() => setShowCreate(!showCreate)} style={{ backgroundColor: "#F5A623", color: "#0D0D0D", fontWeight: 700, fontSize: "13px", padding: "8px 20px", borderRadius: "999px", border: "none", cursor: "pointer" }}>
          {showCreate ? "Cancel" : "+ Add Editor"}
        </button>
      </div>

      {error && <div style={{ backgroundColor: "#2A0A0A", border: "1px solid #F43F5E", borderRadius: "10px", padding: "12px 16px", color: "#F43F5E", fontSize: "14px", marginBottom: "20px" }}>{error}</div>}
      {success && <div style={{ backgroundColor: "#0A2A1A", border: "1px solid #10B981", borderRadius: "10px", padding: "12px 16px", color: "#10B981", fontSize: "14px", marginBottom: "20px" }}>{success}</div>}

      {showCreate && (
        <div style={{ backgroundColor: "#1A1A1A", border: "1px solid #2A2A2A", borderRadius: "16px", padding: "24px", marginBottom: "24px", display: "flex", flexDirection: "column", gap: "14px" }}>
          <div>
            <label style={{ display: "block", color: "#E8E8E8", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>Editor's Name</label>
            <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. Chidinma Okafor" style={inputStyle} />
          </div>
          <div>
            <label style={{ display: "block", color: "#E8E8E8", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>Email</label>
            <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="editor@example.com" style={inputStyle} />
          </div>
          <div>
            <label style={{ display: "block", color: "#E8E8E8", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>Set Their Password</label>
            <input type="text" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="At least 8 characters" style={inputStyle} />
          </div>
          <button onClick={createEditor} disabled={saving} style={{ backgroundColor: saving ? "#6B6B6B" : "#F5A623", color: "#0D0D0D", fontWeight: 700, fontSize: "14px", padding: "12px", borderRadius: "10px", border: "none", cursor: saving ? "not-allowed" : "pointer" }}>
            {saving ? "Creating..." : "Create Editor Account"}
          </button>
        </div>
      )}

      {loading ? <p style={{ color: "#6B6B6B" }}>Loading editors...</p> : editors.length === 0 ? (
        <p style={{ color: "#6B6B6B", fontSize: "14px" }}>No editors yet. Add one above.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {editors.map((ed) => (
            <div key={ed.id} style={{ backgroundColor: "#1A1A1A", border: "1px solid #2A2A2A", borderRadius: "16px", padding: "20px 24px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
                <div>
                  <p style={{ color: "#E8E8E8", fontWeight: 700, fontSize: "15px" }}>{ed.display_name}</p>
                  <p style={{ color: "#6B6B6B", fontSize: "12px", marginTop: "2px" }}>Editor since {new Date(ed.created_at).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}</p>
                </div>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  <button onClick={() => { setPasswordEditId(passwordEditId === ed.id ? null : ed.id); setPasswordEditValue(""); }} style={{ backgroundColor: "transparent", color: "#3B82F6", fontWeight: 600, fontSize: "12px", padding: "8px 14px", borderRadius: "999px", border: "1px solid #3B82F630", cursor: "pointer" }}>Change Password</button>
                  <button onClick={() => revokeEditor(ed.id)} style={{ backgroundColor: "transparent", color: "#F43F5E", fontWeight: 600, fontSize: "12px", padding: "8px 14px", borderRadius: "999px", border: "1px solid #F43F5E30", cursor: "pointer" }}>Revoke Access</button>
                </div>
              </div>
              {passwordEditId === ed.id && (
                <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
                  <input type="text" value={passwordEditValue} onChange={(e) => setPasswordEditValue(e.target.value)} placeholder="New password (min 8 characters)" style={{ ...inputStyle, flex: 1 }} />
                  <button onClick={() => updatePassword(ed.id)} style={{ backgroundColor: "#F5A623", color: "#0D0D0D", fontWeight: 700, fontSize: "13px", padding: "0 20px", borderRadius: "10px", border: "none", cursor: "pointer" }}>Save</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function BlogAdmin() {
  const [form, setForm] = useState({ title: "", slug: "", excerpt: "", content: "", category: "Opportunities", cover_image: "" });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [posts, setPosts] = useState<any[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [view, setView] = useState<"list" | "write">("list");
  const [blogImage, setBlogImage] = useState<File | null>(null);
  const [editingPost, setEditingPost] = useState<any>(null);

  useEffect(() => { loadPosts(); }, []);

  function handleBlogImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setBlogImage(file);
      setForm((prev) => ({ ...prev, cover_image: URL.createObjectURL(file) }));
    }
  }

  async function loadPosts() {
    setLoadingPosts(true);
    const { data } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
    setPosts(data ?? []);
    setLoadingPosts(false);
  }

  async function deletePost(id: string) {
    if (!confirm("Delete this post permanently?")) return;
    await supabase.from("blog_posts").delete().eq("id", id);
    setPosts(posts.filter((p) => p.id !== id));
  }

  async function togglePublish(id: string, published: boolean) {
    await supabase.from("blog_posts").update({ published: !published }).eq("id", id);
    setPosts(posts.map((p) => p.id === id ? { ...p, published: !published } : p));
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const val = e.target.value;
    const name = e.target.name;
    setForm((prev) => ({ ...prev, [name]: val, ...(name === "title" ? { slug: val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") } : {}) }));
  }

  async function handlePublish() {
    if (!form.title || !form.content) { setError("Title and content are required."); return; }
    setSaving(true);
    setError("");
    let coverImageUrl = editingPost ? form.cover_image : null;
    if (blogImage) {
      const fileExt = blogImage.name.split(".").pop();
      const fileName = "blog-" + Date.now() + "." + fileExt;
      const { error: uploadError } = await supabase.storage.from("event-images").upload(fileName, blogImage);
      if (uploadError) { setError("Image upload failed: " + uploadError.message); setSaving(false); return; }
      const { data: urlData } = supabase.storage.from("event-images").getPublicUrl(fileName);
      coverImageUrl = urlData.publicUrl;
    }
    let sbError = null;
    if (editingPost) {
      const { error } = await supabase.from("blog_posts").update({ title: form.title, slug: form.slug, excerpt: form.excerpt, content: form.content, category: form.category, cover_image: coverImageUrl }).eq("id", editingPost.id);
      sbError = error;
    } else {
      const { error } = await supabase.from("blog_posts").insert([{ title: form.title, slug: form.slug, excerpt: form.excerpt, content: form.content, category: form.category, cover_image: coverImageUrl, published: true }]);
      sbError = error;
    }
    setSaving(false);
    if (sbError) { setError("Error: " + sbError.message); }
    else {
      setSuccess(true);
      setForm({ title: "", slug: "", excerpt: "", content: "", category: "Opportunities", cover_image: "" });
      setBlogImage(null);
      setEditingPost(null);
      loadPosts();
      setTimeout(() => { setSuccess(false); setView("list"); }, 2000);
    }
  }

  const inputStyle = { width: "100%", backgroundColor: "#111", border: "1px solid #2A2A2A", borderRadius: "10px", padding: "12px 16px", color: "#E8E8E8", fontSize: "14px", outline: "none", boxSizing: "border-box" as const };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
        <h2 style={{ fontFamily: "Georgia, serif", fontSize: "24px", fontWeight: 700, color: "#E8E8E8" }}>✍️ Discovery Hub Management</h2>
        <div style={{ display: "flex", gap: "8px" }}>
          <button onClick={() => setView("list")} style={{ backgroundColor: view === "list" ? "#F5A623" : "transparent", color: view === "list" ? "#0D0D0D" : "#6B6B6B", fontWeight: 700, fontSize: "13px", padding: "8px 20px", borderRadius: "999px", border: view === "list" ? "none" : "1px solid #2A2A2A", cursor: "pointer" }}>📋 All Articles</button>
          <button onClick={() => setView("write")} style={{ backgroundColor: view === "write" ? "#F5A623" : "transparent", color: view === "write" ? "#0D0D0D" : "#6B6B6B", fontWeight: 700, fontSize: "13px", padding: "8px 20px", borderRadius: "999px", border: view === "write" ? "none" : "1px solid #2A2A2A", cursor: "pointer" }}>✍️ Write New Article</button>
        </div>
      </div>

      {view === "list" && (
        <div>
          {loadingPosts ? <p style={{ color: "#6B6B6B" }}>Loading posts...</p> : posts.length === 0 ? (
            <div style={{ textAlign: "center", padding: "48px", backgroundColor: "#1A1A1A", border: "1px solid #2A2A2A", borderRadius: "16px" }}>
              <p style={{ color: "#6B6B6B", fontSize: "14px", marginBottom: "16px" }}>No articles yet.</p>
              <button onClick={() => setView("write")} style={{ backgroundColor: "#F5A623", color: "#0D0D0D", fontWeight: 700, fontSize: "14px", padding: "10px 20px", borderRadius: "12px", border: "none", cursor: "pointer" }}>Write First Article</button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {posts.map((post) => (
                <div key={post.id} style={{ backgroundColor: "#1A1A1A", border: "1px solid #2A2A2A", borderRadius: "16px", padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
                  <div style={{ flex: 1, minWidth: "200px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px", flexWrap: "wrap" }}>
                      <span style={{ fontSize: "11px", fontWeight: 600, padding: "2px 8px", borderRadius: "999px", backgroundColor: post.published ? "#10B98120" : "#2A2A2A", color: post.published ? "#10B981" : "#6B6B6B" }}>{post.published ? "✅ Published" : "⏸️ Draft"}</span>
                      <span style={{ fontSize: "11px", fontWeight: 600, padding: "2px 8px", borderRadius: "999px", backgroundColor: "#F5A62320", color: "#F5A623" }}>{post.category}</span>
                    </div>
                    <p style={{ color: "#E8E8E8", fontWeight: 700, fontSize: "15px", fontFamily: "Georgia, serif", marginBottom: "4px" }}>{post.title}</p>
                    <p style={{ color: "#6B6B6B", fontSize: "12px" }}>{new Date(post.created_at).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" })}</p>
                    <p style={{ color: "#A78BFA", fontSize: "12px", marginTop: "4px" }}>👁️ {post.views || 0} views</p>
                  </div>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    <a href={"/blog/" + post.slug} target="_blank" rel="noopener noreferrer" style={{ backgroundColor: "transparent", color: "#6B6B6B", fontWeight: 600, fontSize: "12px", padding: "8px 14px", borderRadius: "999px", border: "1px solid #2A2A2A", textDecoration: "none" }}>View</a>
                    <button onClick={() => togglePublish(post.id, post.published)} style={{ backgroundColor: "transparent", color: post.published ? "#F5A623" : "#10B981", fontWeight: 600, fontSize: "12px", padding: "8px 14px", borderRadius: "999px", border: "1px solid " + (post.published ? "#F5A62330" : "#10B98130"), cursor: "pointer" }}>{post.published ? "Unpublish" : "Publish"}</button>
                    <button onClick={() => { setEditingPost(post); setForm({ title: post.title, slug: post.slug, excerpt: post.excerpt || "", content: post.content || "", category: post.category, cover_image: post.cover_image || "" }); setView("write"); }} style={{ backgroundColor: "#3B82F6", color: "#FFFFFF", fontWeight: 600, fontSize: "12px", padding: "8px 14px", borderRadius: "999px", border: "none", cursor: "pointer" }}>Edit</button>
                    <button onClick={() => deletePost(post.id)} style={{ backgroundColor: "transparent", color: "#F43F5E", fontWeight: 600, fontSize: "12px", padding: "8px 14px", borderRadius: "999px", border: "1px solid #F43F5E30", cursor: "pointer" }}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {view === "write" && (
        <div>
          {error && <div style={{ backgroundColor: "#2A0A0A", border: "1px solid #F43F5E", borderRadius: "10px", padding: "12px 16px", color: "#F43F5E", fontSize: "14px", marginBottom: "20px" }}>{error}</div>}
          {success && <div style={{ backgroundColor: "#0A2A1A", border: "1px solid #10B981", borderRadius: "10px", padding: "12px 16px", color: "#10B981", fontSize: "14px", marginBottom: "20px" }}>✅ Published! Redirecting to articles list...</div>}
          <div style={{ backgroundColor: "#1A1A1A", border: "1px solid #2A2A2A", borderRadius: "20px", padding: "32px", display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
              <label style={{ display: "block", color: "#E8E8E8", fontSize: "13px", fontWeight: 600, marginBottom: "8px" }}>Title *</label>
              <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. Top 10 Scholarships for Nigerians in 2026" style={inputStyle} />
            </div>
            <div>
              <label style={{ display: "block", color: "#E8E8E8", fontSize: "13px", fontWeight: 600, marginBottom: "8px" }}>Slug (auto-generated)</label>
              <input name="slug" value={form.slug} onChange={handleChange} placeholder="top-10-scholarships-nigerians-2026" style={{ ...inputStyle, color: "#6B6B6B" }} />
            </div>
            <div>
              <label style={{ display: "block", color: "#E8E8E8", fontSize: "13px", fontWeight: 600, marginBottom: "8px" }}>Category</label>
              <select name="category" value={form.category} onChange={handleChange} style={inputStyle}>
                {["Opportunities", "Events", "Communities", "Career", "Startup", "Church", "General"].map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: "block", color: "#E8E8E8", fontSize: "13px", fontWeight: 600, marginBottom: "8px" }}>Cover Image</label>
              {form.cover_image && (
                <img src={form.cover_image} alt="Cover preview" style={{ width: "100%", height: "180px", objectFit: "cover", borderRadius: "10px", marginBottom: "12px", border: "1px solid #2A2A2A" }} />
              )}
              <label style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", backgroundColor: "#111", border: "1px dashed #2A2A2A", borderRadius: "10px", padding: "20px", cursor: "pointer", color: "#6B6B6B", fontSize: "14px" }}>
                📷 {blogImage ? blogImage.name : "Click to upload cover image"}
                <input type="file" accept="image/*" onChange={handleBlogImageChange} style={{ display: "none" }} />
              </label>
            </div>
            <div>
              <label style={{ display: "block", color: "#E8E8E8", fontSize: "13px", fontWeight: 600, marginBottom: "8px" }}>Excerpt (short summary)</label>
              <textarea name="excerpt" value={form.excerpt} onChange={handleChange} rows={2} placeholder="A short description that appears on the blog listing page..." style={{ ...inputStyle, resize: "vertical" }} />
            </div>
            <div>
              <label style={{ display: "block", color: "#E8E8E8", fontSize: "13px", fontWeight: 600, marginBottom: "8px" }}>Content *</label>
              <textarea name="content" value={form.content} onChange={handleChange} rows={15} placeholder="Write your full article here..." style={{ ...inputStyle, resize: "vertical" }} />
            </div>
            <button onClick={handlePublish} disabled={saving} style={{ backgroundColor: saving ? "#6B6B6B" : "#F5A623", color: "#0D0D0D", fontWeight: 700, fontSize: "15px", padding: "16px", borderRadius: "12px", border: "none", cursor: saving ? "not-allowed" : "pointer" }}>
              {saving ? "Saving..." : editingPost ? "Save Changes →" : "Publish Article →"}
            </button>
            {editingPost && (
              <button onClick={() => { setEditingPost(null); setForm({ title: "", slug: "", excerpt: "", content: "", category: "Opportunities", cover_image: "" }); setView("list"); }} style={{ backgroundColor: "transparent", color: "#6B6B6B", fontWeight: 700, fontSize: "15px", padding: "16px", borderRadius: "12px", border: "1px solid #2A2A2A", cursor: "pointer" }}>Cancel</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}


function SpotlightAdmin() {
  const [form, setForm] = React.useState({ title: "", slug: "", category: "People", summary: "", story: "", achievements: "", quote: "", cover_image: "", featured: false });
  const [saving, setSaving] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState("");
  const [spotlights, setSpotlights] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [view, setView] = React.useState<"list" | "write">("list");
  const [coverImage, setCoverImage] = React.useState<File | null>(null);

  React.useEffect(() => { loadSpotlights(); }, []);

  async function loadSpotlights() {
    setLoading(true);
    const { data } = await supabase.from("spotlights").select("*").order("created_at", { ascending: false });
    setSpotlights(data ?? []);
    setLoading(false);
  }

  async function deleteSpotlight(id: string) {
    if (!confirm("Delete this spotlight permanently?")) return;
    await supabase.from("spotlights").delete().eq("id", id);
    setSpotlights(spotlights.filter((s) => s.id !== id));
  }

  async function togglePublish(id: string, published: boolean) {
    await supabase.from("spotlights").update({ published: !published }).eq("id", id);
    setSpotlights(spotlights.map((s) => s.id === id ? { ...s, published: !published } : s));
  }

  async function toggleFeature(id: string, featured: boolean) {
    await supabase.from("spotlights").update({ featured: !featured }).eq("id", id);
    setSpotlights(spotlights.map((s) => s.id === id ? { ...s, featured: !featured } : s));
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const val = e.target.value;
    const name = e.target.name;
    setForm((prev) => ({ ...prev, [name]: val, ...(name === "title" ? { slug: val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") } : {}) }));
  }

  async function handlePublish() {
    if (!form.title || !form.summary) { setError("Title and summary are required."); return; }
    setSaving(true);
    setError("");
    let coverUrl = null;
    if (coverImage) {
      const fileExt = coverImage.name.split(".").pop();
      const fileName = "spotlight-" + Date.now() + "." + fileExt;
      const { error: uploadError } = await supabase.storage.from("event-images").upload(fileName, coverImage);
      if (uploadError) { setError("Image upload failed: " + uploadError.message); setSaving(false); return; }
      const { data: urlData } = supabase.storage.from("event-images").getPublicUrl(fileName);
      coverUrl = urlData.publicUrl;
    }
    const { error: sbError } = await supabase.from("spotlights").insert([{ title: form.title, slug: form.slug, category: form.category, summary: form.summary, story: form.story, achievements: form.achievements, quote: form.quote, cover_image: coverUrl, featured: form.featured, published: true }]);
    setSaving(false);
    if (sbError) { setError("Error: " + sbError.message); }
    else {
      setSuccess(true);
      setForm({ title: "", slug: "", category: "People", summary: "", story: "", achievements: "", quote: "", cover_image: "", featured: false });
      setCoverImage(null);
      loadSpotlights();
      setTimeout(() => { setSuccess(false); setView("list"); }, 2000);
    }
  }

  const inputStyle = { width: "100%", backgroundColor: "#111", border: "1px solid #2A2A2A", borderRadius: "10px", padding: "12px 16px", color: "#E8E8E8", fontSize: "14px", outline: "none", boxSizing: "border-box" as const };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
        <h2 style={{ fontFamily: "Georgia, serif", fontSize: "24px", fontWeight: 700, color: "#E8E8E8" }}>✨ Spotlight Management</h2>
        <div style={{ display: "flex", gap: "8px" }}>
          <button onClick={() => setView("list")} style={{ backgroundColor: view === "list" ? "#F5A623" : "transparent", color: view === "list" ? "#0D0D0D" : "#6B6B6B", fontWeight: 700, fontSize: "13px", padding: "8px 20px", borderRadius: "999px", border: view === "list" ? "none" : "1px solid #2A2A2A", cursor: "pointer" }}>📋 All Spotlights</button>
          <button onClick={() => setView("write")} style={{ backgroundColor: view === "write" ? "#F5A623" : "transparent", color: view === "write" ? "#0D0D0D" : "#6B6B6B", fontWeight: 700, fontSize: "13px", padding: "8px 20px", borderRadius: "999px", border: view === "write" ? "none" : "1px solid #2A2A2A", cursor: "pointer" }}>✨ Add Spotlight</button>
        </div>
      </div>

      {view === "list" && (
        <div>
          {loading ? <p style={{ color: "#6B6B6B" }}>Loading spotlights...</p> : spotlights.length === 0 ? (
            <div style={{ textAlign: "center", padding: "48px", backgroundColor: "#1A1A1A", border: "1px solid #2A2A2A", borderRadius: "16px" }}>
              <p style={{ color: "#6B6B6B", fontSize: "14px", marginBottom: "16px" }}>No spotlights yet.</p>
              <button onClick={() => setView("write")} style={{ backgroundColor: "#F5A623", color: "#0D0D0D", fontWeight: 700, fontSize: "14px", padding: "10px 20px", borderRadius: "12px", border: "none", cursor: "pointer" }}>Add First Spotlight</button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {spotlights.map((s) => (
                <div key={s.id} style={{ backgroundColor: "#1A1A1A", border: "1px solid #2A2A2A", borderRadius: "16px", padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
                  <div style={{ flex: 1, minWidth: "200px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px", flexWrap: "wrap" }}>
                      <span style={{ fontSize: "11px", fontWeight: 600, padding: "2px 8px", borderRadius: "999px", backgroundColor: s.published ? "#10B98120" : "#2A2A2A", color: s.published ? "#10B981" : "#6B6B6B" }}>{s.published ? "✅ Published" : "⏸️ Draft"}</span>
                      {s.featured && <span style={{ fontSize: "11px", fontWeight: 600, padding: "2px 8px", borderRadius: "999px", backgroundColor: "#F5A62320", color: "#F5A623" }}>⭐ Featured</span>}
                      <span style={{ fontSize: "11px", fontWeight: 600, padding: "2px 8px", borderRadius: "999px", backgroundColor: "#1A1A1A", color: "#6B6B6B", border: "1px solid #2A2A2A" }}>{s.category}</span>
                    </div>
                    <p style={{ color: "#E8E8E8", fontWeight: 700, fontSize: "15px", fontFamily: "Georgia, serif" }}>{s.title}</p>
                  </div>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    <a href={"/spotlight/" + s.slug} target="_blank" rel="noopener noreferrer" style={{ backgroundColor: "transparent", color: "#6B6B6B", fontWeight: 600, fontSize: "12px", padding: "8px 14px", borderRadius: "999px", border: "1px solid #2A2A2A", textDecoration: "none" }}>View</a>
                    <button onClick={() => toggleFeature(s.id, s.featured)} style={{ backgroundColor: "transparent", color: s.featured ? "#F5A623" : "#6B6B6B", fontWeight: 600, fontSize: "12px", padding: "8px 14px", borderRadius: "999px", border: "1px solid " + (s.featured ? "#F5A62330" : "#2A2A2A"), cursor: "pointer" }}>{s.featured ? "⭐ Featured" : "Feature"}</button>
                    <button onClick={() => togglePublish(s.id, s.published)} style={{ backgroundColor: "transparent", color: s.published ? "#F5A623" : "#10B981", fontWeight: 600, fontSize: "12px", padding: "8px 14px", borderRadius: "999px", border: "1px solid " + (s.published ? "#F5A62330" : "#10B98130"), cursor: "pointer" }}>{s.published ? "Unpublish" : "Publish"}</button>
                    <button onClick={() => deleteSpotlight(s.id)} style={{ backgroundColor: "transparent", color: "#F43F5E", fontWeight: 600, fontSize: "12px", padding: "8px 14px", borderRadius: "999px", border: "1px solid #F43F5E30", cursor: "pointer" }}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {view === "write" && (
        <div>
          {error && <div style={{ backgroundColor: "#2A0A0A", border: "1px solid #F43F5E", borderRadius: "10px", padding: "12px 16px", color: "#F43F5E", fontSize: "14px", marginBottom: "20px" }}>{error}</div>}
          {success && <div style={{ backgroundColor: "#0A2A1A", border: "1px solid #10B981", borderRadius: "10px", padding: "12px 16px", color: "#10B981", fontSize: "14px", marginBottom: "20px" }}>✅ Spotlight published!</div>}
          <div style={{ backgroundColor: "#1A1A1A", border: "1px solid #2A2A2A", borderRadius: "20px", padding: "32px", display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
              <label style={{ display: "block", color: "#E8E8E8", fontSize: "13px", fontWeight: 600, marginBottom: "8px" }}>Cover Image</label>
              <label style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", backgroundColor: "#111", border: "1px dashed #2A2A2A", borderRadius: "10px", padding: "20px", cursor: "pointer", color: "#6B6B6B", fontSize: "14px" }}>
                📷 {coverImage ? coverImage.name : "Click to upload cover image"}
                <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) setCoverImage(f); }} style={{ display: "none" }} />
              </label>
            </div>
            <div><label style={{ display: "block", color: "#E8E8E8", fontSize: "13px", fontWeight: 600, marginBottom: "8px" }}>Title *</label><input name="title" value={form.title} onChange={handleChange} placeholder="e.g. How Amaka Built a $1M Business from Lagos" style={inputStyle} /></div>
            <div><label style={{ display: "block", color: "#E8E8E8", fontSize: "13px", fontWeight: 600, marginBottom: "8px" }}>Slug (auto-generated)</label><input name="slug" value={form.slug} onChange={handleChange} style={{ ...inputStyle, color: "#6B6B6B" }} /></div>
            <div>
              <label style={{ display: "block", color: "#E8E8E8", fontSize: "13px", fontWeight: 600, marginBottom: "8px" }}>Category</label>
              <select name="category" value={form.category} onChange={handleChange} style={inputStyle}>
                {["People", "Businesses", "Startups", "Students", "Communities", "African Legends"].map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div><label style={{ display: "block", color: "#E8E8E8", fontSize: "13px", fontWeight: 600, marginBottom: "8px" }}>Summary * (short introduction)</label><textarea name="summary" value={form.summary} onChange={handleChange} rows={3} placeholder="A short compelling introduction..." style={{ ...inputStyle, resize: "vertical" }} /></div>
            <div><label style={{ display: "block", color: "#E8E8E8", fontSize: "13px", fontWeight: 600, marginBottom: "8px" }}>Inspirational Quote</label><input name="quote" value={form.quote} onChange={handleChange} placeholder='e.g. "The only way to do great work is to love what you do."' style={inputStyle} /></div>
            <div><label style={{ display: "block", color: "#E8E8E8", fontSize: "13px", fontWeight: 600, marginBottom: "8px" }}>Full Story</label><textarea name="story" value={form.story} onChange={handleChange} rows={10} placeholder="Write the full story here..." style={{ ...inputStyle, resize: "vertical" }} /></div>
            <div><label style={{ display: "block", color: "#E8E8E8", fontSize: "13px", fontWeight: 600, marginBottom: "8px" }}>Key Achievements</label><textarea name="achievements" value={form.achievements} onChange={handleChange} rows={5} placeholder="List key achievements here..." style={{ ...inputStyle, resize: "vertical" }} /></div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} style={{ width: "16px", height: "16px" }} />
              <label style={{ color: "#E8E8E8", fontSize: "13px", fontWeight: 600 }}>⭐ Feature this spotlight on homepage</label>
            </div>
            <button onClick={handlePublish} disabled={saving} style={{ backgroundColor: saving ? "#6B6B6B" : "#F5A623", color: "#0D0D0D", fontWeight: 700, fontSize: "15px", padding: "16px", borderRadius: "12px", border: "none", cursor: saving ? "not-allowed" : "pointer" }}>
              {saving ? "Publishing..." : "Publish Spotlight →"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
