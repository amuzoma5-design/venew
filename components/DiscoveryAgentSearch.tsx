"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { hasPermission } from "@/lib/permissions";

interface AgentDiscovery {
  title: string;
  type: string;
  category: string;
  organisation: string;
  location: string;
  date: string | null;
  dateLabel: string;
  price: string;
  description: string;
  whyThis: string;
  sourceUrl: string;
}

export default function DiscoveryAgentSearch() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<AgentDiscovery[] | null>(null);
  const [error, setError] = useState("");
  const [role, setRole] = useState<string | null>(null);
  const [savedIndices, setSavedIndices] = useState<Set<number>>(new Set());
  const [savingIndex, setSavingIndex] = useState<number | null>(null);
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    async function loadRole() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const { data: profile } = await supabase.from("profiles").select("role").eq("id", session.user.id).single();
      setRole(profile?.role ?? null);
    }
    loadRole();
  }, []);

  async function saveDiscovery(d: AgentDiscovery, index: number) {
    setSavingIndex(index);
    setSaveError("");
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch("/api/discover/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify(d),
      });
      const data = await res.json();
      if (!res.ok) {
        setSaveError(data.error || "Could not save this discovery.");
      } else {
        setSavedIndices((prev) => new Set(prev).add(index));
      }
    } catch (err) {
      setSaveError("Could not reach VENEW to save this discovery.");
    } finally {
      setSavingIndex(null);
    }
  }

  async function handleSearch() {
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    setResults(null);

    try {
      const res = await fetch("/api/discover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
      } else {
        setResults(data.discoveries ?? []);
      }
    } catch (err) {
      setError("Could not reach the discovery agent. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: "700px", margin: "0 auto", padding: "60px 20px 80px" }}>
      <p style={{ color: "#D97706", fontSize: "11px", fontWeight: 600, letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: "12px", textAlign: "center" }}>
        VENEW Discovery Agent
      </p>
      <h1 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(28px, 6vw, 40px)", fontWeight: 900, color: "#E8E8E8", textAlign: "center", marginBottom: "12px" }}>
        What could be next for you?
      </h1>
      <p style={{ color: "#6B6B6B", fontSize: "14px", textAlign: "center", marginBottom: "32px" }}>
        Describe what you're looking for in your own words. The agent searches the current web to find it.
      </p>

      <div style={{ display: "flex", gap: "10px", marginBottom: "8px" }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="e.g. Fully funded technology fellowships for young Nigerians"
          style={{
            flex: 1,
            backgroundColor: "#1A1A1A",
            border: "1.5px solid #2A2A2A",
            borderRadius: "12px",
            padding: "14px 18px",
            color: "#E8E8E8",
            fontSize: "15px",
            outline: "none",
          }}
        />
        <button
          onClick={handleSearch}
          disabled={loading || !query.trim()}
          style={{
            backgroundColor: loading || !query.trim() ? "#2A2A2A" : "#F5A623",
            color: loading || !query.trim() ? "#6B6B6B" : "#0D0D0D",
            fontWeight: 700,
            fontSize: "14px",
            padding: "14px 24px",
            borderRadius: "12px",
            border: "none",
            cursor: loading || !query.trim() ? "default" : "pointer",
            whiteSpace: "nowrap",
          }}
        >
          {loading ? "Searching..." : "Discover"}
        </button>
      </div>
      <p style={{ color: "#4B5563", fontSize: "12px", marginBottom: "32px" }}>
        This searches the live web right now — it can take a moment.
      </p>

      {error && (
        <div style={{ backgroundColor: "#2A0A0A", border: "1px solid #F43F5E", borderRadius: "10px", padding: "14px 16px", color: "#F43F5E", fontSize: "14px", marginBottom: "24px" }}>
          {error}
        </div>
      )}

      {loading && (
        <div style={{ textAlign: "center", padding: "40px 0", color: "#6B6B6B", fontSize: "14px" }}>
          Searching the web for real, current matches — this usually takes 15–30 seconds.
        </div>
      )}

      {results !== null && !loading && results.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px 0" }}>
          <p style={{ color: "#E8E8E8", fontSize: "16px", fontWeight: 700, marginBottom: "8px" }}>
            No strong matches found
          </p>
          <p style={{ color: "#6B6B6B", fontSize: "14px" }}>
            Try describing what you're looking for differently, or be more specific.
          </p>
        </div>
      )}

      {results !== null && results.length > 0 && (
        <>
          <p style={{ color: "#6B6B6B", fontSize: "13px", marginBottom: "20px" }}>
            Found {results.length} discover{results.length !== 1 ? "ies" : "y"} — unverified, found live on the web. Always confirm details on the official source before applying.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {results.map((d, i) => (
              <div key={i} style={{ backgroundColor: "#1A1A1A", border: "1px solid #2A2A2A", borderRadius: "16px", padding: "24px" }}>
                <div style={{ display: "flex", gap: "8px", marginBottom: "12px", flexWrap: "wrap" }}>
                  <span style={{ fontSize: "11px", fontWeight: 700, padding: "4px 10px", borderRadius: "999px", backgroundColor: "#F5A62325", color: "#F5A623" }}>
                    {d.category}
                  </span>
                  <span style={{ fontSize: "11px", fontWeight: 600, padding: "4px 10px", borderRadius: "999px", backgroundColor: "#2A2A2A", color: "#9CA3AF" }}>
                    {d.type}
                  </span>
                </div>

                <h3 style={{ fontFamily: "Georgia, serif", fontSize: "19px", fontWeight: 700, color: "#E8E8E8", marginBottom: "8px" }}>
                  {d.title}
                </h3>

                <p style={{ color: "#9CA3AF", fontSize: "14px", lineHeight: 1.6, marginBottom: "14px" }}>
                  {d.description}
                </p>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "14px", marginBottom: "12px", fontSize: "13px", color: "#D1D5DB" }}>
                  {d.organisation && <span>🏢 {d.organisation}</span>}
                  {d.location && <span>📍 {d.location}</span>}
                  {d.date && <span>📅 {d.dateLabel || "Date"}: {d.date}</span>}
                  <span style={{ color: d.price === "FREE" ? "#34D399" : "#F5A623", fontWeight: 700 }}>{d.price}</span>
                </div>

                                {d.whyThis && (
                  <p style={{ color: "#6B7280", fontSize: "12px", fontStyle: "italic", marginBottom: "16px" }}>
                    Why this: {d.whyThis}
                  </p>
                )}

                {hasPermission(role, "manage_discoveries") && (
                  <div style={{ marginBottom: "12px" }}>
                    {savedIndices.has(i) ? (
                      <span style={{ display: "inline-block", backgroundColor: "#10B98120", color: "#10B981", fontWeight: 700, fontSize: "12px", padding: "8px 16px", borderRadius: "999px" }}>
                        ✓ Saved to VENEW — pending review
                      </span>
                    ) : !d.date ? (
                      <span style={{ display: "inline-block", color: "#6B7280", fontSize: "12px", fontStyle: "italic" }}>
                        No date found — can't save without one
                      </span>
                    ) : (
                      <button
                        onClick={() => saveDiscovery(d, i)}
                        disabled={savingIndex === i}
                        style={{
                          backgroundColor: savingIndex === i ? "#2A2A2A" : "#3B82F6",
                          color: savingIndex === i ? "#6B6B6B" : "#FFFFFF",
                          fontWeight: 700,
                          fontSize: "12px",
                          padding: "8px 16px",
                          borderRadius: "999px",
                          border: "none",
                          cursor: savingIndex === i ? "default" : "pointer",
                          marginRight: "8px",
                        }}
                      >
                        {savingIndex === i ? "Saving..." : "💾 Save to VENEW"}
                      </button>
                    )}
                  </div>
                )}

                {saveError && (
                  <p style={{ color: "#F43F5E", fontSize: "12px", marginBottom: "12px" }}>{saveError}</p>
                )}

                                <a
                  href={d.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: "inline-block", backgroundColor: "#F5A623", color: "#0D0D0D", fontWeight: 700, fontSize: "13px", padding: "10px 20px", borderRadius: "999px", textDecoration: "none" }}
                >
                  Go to Official Source →
                </a>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}