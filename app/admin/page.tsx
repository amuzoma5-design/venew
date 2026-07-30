"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

type Tab = "events" | "users" | "analytics" | "blog";

export default function AdminPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("events");

  const ADMIN_PASSWORD = "venew2026";

  function handleLogin() {
    if (password === ADMIN_PASSWORD) {
      setAuthed(true);
      loadAll();
    } else {
      setError("Wrong password.");
    }
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
            <p style={{ color: "#6B6B6B", fontSize: "14px", marginBottom: "28px" }}>Enter your admin password to continue</p>
            {error && <div style={{ backgroundColor: "#2A0A0A", border: "1px solid #F43F5E", borderRadius: "10px", padding: "12px", color: "#F43F5E", fontSize: "14px", marginBottom: "20px" }}>{error}</div>}
            <input type="password" placeholder="Admin password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleLogin()} style={{ width: "100%", backgroundColor: "#111", border: "1px solid #2A2A2A", borderRadius: "10px", padding: "12px 16px", color: "#E8E8E8", fontSize: "14px", outline: "none", boxSizing: "border-box", marginBottom: "16px" }} />
            <button onClick={handleLogin} style={{ width: "100%", backgroundColor: "#F5A623", color: "#0D0D0D", fontWeight: 700, fontSize: "15px", padding: "14px", borderRadius: "12px", border: "none", cursor: "pointer" }}>Enter Admin Panel →</button>
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
        <Link href="/" style={{ color: "#6B6B6B", fontSize: "14px", textDecoration: "none" }}>← Back to site</Link>
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

        {/* Tabs */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "32px", flexWrap: "wrap" }}>
          {(["events", "users", "analytics", "blog"] as Tab[]).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{ backgroundColor: activeTab === tab ? "#F5A623" : "#1A1A1A", color: activeTab === tab ? "#0D0D0D" : "#6B6B6B", fontWeight: 700, fontSize: "13px", padding: "8px 20px", borderRadius: "999px", border: activeTab === tab ? "none" : "1px solid #2A2A2A", cursor: "pointer" }}>
              {tab === "events" ? "📋 Discoveries" : tab === "users" ? "👥 Users" : tab === "analytics" ? "📊 Analytics" : "✍️ Discovery Hub"}
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

      </div>
    </main>
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
