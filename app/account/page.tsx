"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useRouter } from "next/navigation";

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

const INTERESTS = [
  "Church",
  "Business",
  "Technology",
  "Education",
  "Real Estate",
  "Music & Entertainment",
  "Conference",
  "Workshop",
];

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [savedCount, setSavedCount] = useState(0);
  const [viewedCount, setViewedCount] = useState(0);
  const [myEvents, setMyEvents] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"profile" | "events">("profile");
  const [form, setForm] = useState({
    display_name: "",
    city: "",
    interests: [] as string[],
  });

  useEffect(() => {
    async function load() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/auth/login");
        return;
      }

      setUser(session.user);

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (profile) {
        setProfile(profile);
        setForm({
          display_name: profile.display_name || "",
          city: profile.city || "",
          interests: profile.interests || [],
        });
      }

      const { count: saved } = await supabase
        .from("saved_events")
        .select("*", { count: "exact", head: true })
        .eq("user_id", session.user.id);

      const { count: viewed } = await supabase
        .from("user_activity")
        .select("*", { count: "exact", head: true })
        .eq("user_id", session.user.id)
        .eq("action_type", "viewed");

      setSavedCount(saved || 0);
      setViewedCount(viewed || 0);

      const { data: myEventsData } = await supabase
        .from("events")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      setMyEvents(myEventsData ?? []);
      setLoading(false);
    }

    load();
  }, [router]);

  function toggleInterest(interest: string) {
    setForm((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  }

  async function handleSave() {
    setSaving(true);

    await supabase.from("profiles").upsert({
      id: user.id,
      display_name: form.display_name,
      city: form.city,
      interests: form.interests,
      updated_at: new Date().toISOString(),
    });

    setProfile({ ...profile, ...form });
    setEditing(false);
    setSaving(false);
  }

  if (loading) {
    return (
      <main style={{ backgroundColor: "#0D0D0D", minHeight: "100vh" }}>
        <Navbar />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "60vh",
          }}
        >
          <p style={{ color: "#6B6B6B" }}>Loading your profile...</p>
        </div>
      </main>
    );
  }

  return (
    <main style={{ backgroundColor: "#0D0D0D", minHeight: "100vh" }}>
      <Navbar />

      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 24px 80px" }}>
        {/* Header */}
        <div style={{ marginBottom: "40px" }}>
          <p
            style={{
              color: "#F5A623",
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              marginBottom: "12px",
            }}
          >
            My Account
          </p>
          <h1
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "36px",
              fontWeight: 900,
              color: "#E8E8E8",
            }}
          >
            {profile?.display_name || "Your Profile"}
          </h1>
          <p style={{ color: "#6B6B6B", fontSize: "14px", marginTop: "8px" }}>
            {user?.email}
          </p>
        </div>

        {/* Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            gap: "16px",
            marginBottom: "32px",
          }}
        >
          {[
            { label: "Saved Events", value: savedCount, icon: "Saved", link: "/account/saved" },
            { label: "Events Viewed", value: viewedCount, icon: "Viewed", link: null },
            { label: "My Events", value: myEvents.length, icon: "Events", link: null },
            { label: "Interests", value: profile?.interests?.length || 0, icon: "Interests", link: null },
          ].map(({ label, value, icon, link }) => (
            <div
              key={label}
              style={{
                backgroundColor: "#1A1A1A",
                border: "1px solid #2A2A2A",
                borderRadius: "16px",
                padding: "20px",
                textAlign: "center",
              }}
            >
              <p style={{ color: "#6B6B6B", fontSize: "12px", fontWeight: 700, marginBottom: "8px" }}>
                {icon}
              </p>
              <p
                style={{
                  fontFamily: "Georgia, serif",
                  fontSize: "32px",
                  fontWeight: 900,
                  color: "#F5A623",
                  lineHeight: 1,
                }}
              >
                {value}
              </p>
              <p style={{ color: "#6B6B6B", fontSize: "12px", marginTop: "6px" }}>
                {label}
              </p>
              {link && (
                <Link
                  href={link}
                  style={{
                    display: "inline-block",
                    marginTop: "8px",
                    color: "#F5A623",
                    fontSize: "12px",
                    textDecoration: "none",
                  }}
                >
                  View all
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "32px" }}>
          {[
            { label: "Profile", value: "profile" },
            { label: "My Events", value: "events" },
          ].map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setActiveTab(value as "profile" | "events")}
              style={{
                backgroundColor: activeTab === value ? "#F5A623" : "#1A1A1A",
                color: activeTab === value ? "#0D0D0D" : "#E8E8E8",
                fontWeight: 700,
                fontSize: "14px",
                padding: "10px 22px",
                borderRadius: "999px",
                border: activeTab === value ? "none" : "1px solid #2A2A2A",
                cursor: "pointer",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* My Events Tab */}
        {activeTab === "events" && (
          <div>
            {myEvents.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "60px 0",
                  backgroundColor: "#1A1A1A",
                  border: "1px solid #2A2A2A",
                  borderRadius: "20px",
                }}
              >
                <p
                  style={{
                    fontFamily: "Georgia, serif",
                    fontSize: "20px",
                    fontWeight: 700,
                    color: "#E8E8E8",
                    marginBottom: "8px",
                  }}
                >
                  No events yet
                </p>
                <p style={{ color: "#6B6B6B", fontSize: "14px", marginBottom: "24px" }}>
                  Submit your first event and it will appear here
                </p>
                <Link
                  href="/submit"
                  style={{
                    display: "inline-block",
                    backgroundColor: "#F5A623",
                    color: "#0D0D0D",
                    fontWeight: 700,
                    fontSize: "14px",
                    padding: "12px 24px",
                    borderRadius: "12px",
                    textDecoration: "none",
                  }}
                >
                  Submit an Event
                </Link>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {myEvents.map((event) => {
                  const catColor = categoryColors[event.category] ?? "#F5A623";

                  return (
                    <div
                      key={event.id}
                      style={{
                        backgroundColor: "#1A1A1A",
                        border: "1px solid #2A2A2A",
                        borderRadius: "16px",
                        padding: "20px 24px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: "16px",
                      }}
                    >
                      <div style={{ flex: 1, minWidth: "200px" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            marginBottom: "6px",
                            flexWrap: "wrap",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "11px",
                              fontWeight: 600,
                              padding: "2px 8px",
                              borderRadius: "999px",
                              color: catColor,
                              backgroundColor: `${catColor}20`,
                            }}
                          >
                            {event.category}
                          </span>
                          <span
                            style={{
                              fontSize: "11px",
                              fontWeight: 600,
                              padding: "2px 8px",
                              borderRadius: "999px",
                              backgroundColor: event.approved ? "#10B98120" : "#F5A62320",
                              color: event.approved ? "#10B981" : "#F5A623",
                            }}
                          >
                            {event.approved ? "Live" : "Pending"}
                          </span>
                          {event.featured && (
                            <span
                              style={{
                                fontSize: "11px",
                                fontWeight: 600,
                                padding: "2px 8px",
                                borderRadius: "999px",
                                backgroundColor: "#F5A62320",
                                color: "#F5A623",
                              }}
                            >
                              Featured
                            </span>
                          )}
                        </div>
                        <h3
                          style={{
                            fontFamily: "Georgia, serif",
                            fontSize: "16px",
                            fontWeight: 700,
                            color: "#E8E8E8",
                            marginBottom: "4px",
                          }}
                        >
                          {event.title}
                        </h3>
                        <p style={{ color: "#6B6B6B", fontSize: "13px" }}>
                          {event.date} - {event.location}
                        </p>
                      </div>

                      <div style={{ display: "flex", gap: "10px" }}>
                        <Link
                          href={`/account/events/${event.id}`}
                          style={{
                            backgroundColor: "#F5A623",
                            color: "#0D0D0D",
                            fontWeight: 700,
                            fontSize: "13px",
                            padding: "8px 18px",
                            borderRadius: "999px",
                            textDecoration: "none",
                          }}
                        >
                          Edit
                        </Link>
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
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <>
            {/* Profile card */}
            <div
              style={{
                backgroundColor: "#1A1A1A",
                border: "1px solid #2A2A2A",
                borderRadius: "20px",
                padding: "32px",
                marginBottom: "24px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "24px",
                }}
              >
                <h2
                  style={{
                    fontFamily: "Georgia, serif",
                    fontSize: "20px",
                    fontWeight: 700,
                    color: "#E8E8E8",
                  }}
                >
                  Profile Details
                </h2>
                <button
                  onClick={() => setEditing(!editing)}
                  style={{
                    backgroundColor: editing ? "transparent" : "#F5A623",
                    color: editing ? "#6B6B6B" : "#0D0D0D",
                    fontWeight: 700,
                    fontSize: "13px",
                    padding: "8px 18px",
                    borderRadius: "999px",
                    border: editing ? "1px solid #2A2A2A" : "none",
                    cursor: "pointer",
                  }}
                >
                  {editing ? "Cancel" : "Edit Profile"}
                </button>
              </div>

              {editing ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  {/* Display name */}
                  <div>
                    <label
                      style={{
                        display: "block",
                        color: "#E8E8E8",
                        fontSize: "13px",
                        fontWeight: 600,
                        marginBottom: "8px",
                      }}
                    >
                      Display Name
                    </label>
                    <input
                      type="text"
                      value={form.display_name}
                      onChange={(e) => setForm({ ...form, display_name: e.target.value })}
                      placeholder="e.g. Uzoma Victor"
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
                      }}
                    />
                  </div>

                  {/* City */}
                  <div>
                    <label
                      style={{
                        display: "block",
                        color: "#E8E8E8",
                        fontSize: "13px",
                        fontWeight: 600,
                        marginBottom: "8px",
                      }}
                    >
                      City
                    </label>
                    <input
                      type="text"
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      placeholder="e.g. Lagos"
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
                      }}
                    />
                  </div>

                  {/* Save button */}
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    style={{
                      backgroundColor: saving ? "#6B6B6B" : "#F5A623",
                      color: "#0D0D0D",
                      fontWeight: 700,
                      fontSize: "14px",
                      padding: "14px",
                      borderRadius: "12px",
                      border: "none",
                      cursor: saving ? "not-allowed" : "pointer",
                    }}
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {[
                    { label: "Display Name", value: profile?.display_name || "Not set" },
                    { label: "Email", value: user?.email },
                    { label: "City", value: profile?.city || "Not set" },
                    {
                      label: "Member Since",
                      value: new Date(user?.created_at).toLocaleDateString("en-NG", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      }),
                    },
                  ].map(({ label, value }) => (
                    <div key={label} style={{ display: "flex", gap: "16px" }}>
                      <p style={{ color: "#6B6B6B", fontSize: "13px", minWidth: "120px" }}>
                        {label}
                      </p>
                      <p style={{ color: "#E8E8E8", fontSize: "13px" }}>{value}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Interests */}
            <div
              style={{
                backgroundColor: "#1A1A1A",
                border: "1px solid #2A2A2A",
                borderRadius: "20px",
                padding: "32px",
                marginBottom: "24px",
              }}
            >
              <h2
                style={{
                  fontFamily: "Georgia, serif",
                  fontSize: "20px",
                  fontWeight: 700,
                  color: "#E8E8E8",
                  marginBottom: "8px",
                }}
              >
                My Interests
              </h2>
              <p style={{ color: "#6B6B6B", fontSize: "13px", marginBottom: "20px" }}>
                Select your interests to get personalized event recommendations
              </p>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "20px" }}>
                {INTERESTS.map((interest) => {
                  const selected = form.interests.includes(interest);

                  return (
                    <button
                      key={interest}
                      onClick={() => toggleInterest(interest)}
                      style={{
                        backgroundColor: selected ? "#F5A623" : "#111",
                        color: selected ? "#0D0D0D" : "#6B6B6B",
                        fontWeight: 600,
                        fontSize: "13px",
                        padding: "8px 16px",
                        borderRadius: "999px",
                        border: selected ? "none" : "1px solid #2A2A2A",
                        cursor: "pointer",
                      }}
                    >
                      {interest}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={handleSave}
                disabled={saving}
                style={{
                  backgroundColor: saving ? "#6B6B6B" : "#F5A623",
                  color: "#0D0D0D",
                  fontWeight: 700,
                  fontSize: "14px",
                  padding: "12px 24px",
                  borderRadius: "12px",
                  border: "none",
                  cursor: saving ? "not-allowed" : "pointer",
                }}
              >
                {saving ? "Saving..." : "Save Interests"}
              </button>
            </div>

            {/* Quick links */}
            <div
              style={{
                backgroundColor: "#1A1A1A",
                border: "1px solid #2A2A2A",
                borderRadius: "20px",
                padding: "32px",
              }}
            >
              <h2
                style={{
                  fontFamily: "Georgia, serif",
                  fontSize: "20px",
                  fontWeight: 700,
                  color: "#E8E8E8",
                  marginBottom: "20px",
                }}
              >
                Quick Links
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {[
                  { label: "My Saved Events", href: "/account/saved" },
                  { label: "Submit an Event", href: "/submit" },
                  { label: "Browse Events", href: "/" },
                ].map(({ label, href }) => (
                  <Link
                    key={href}
                    href={href}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "14px 16px",
                      backgroundColor: "#111",
                      borderRadius: "10px",
                      textDecoration: "none",
                      color: "#E8E8E8",
                      fontSize: "14px",
                      border: "1px solid #2A2A2A",
                    }}
                  >
                    {label}
                    <span style={{ color: "#6B6B6B" }}>Open</span>
                  </Link>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
