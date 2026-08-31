"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { categories, Category } from "@/lib/events";
import EventCard from "@/components/EventCard";
import CategoryFilter from "@/components/CategoryFilter";
import RecommendedEvents from "@/components/RecommendedEvents";
import DiscoverySearch from "@/components/DiscoverySearch";

interface Event {
  id: string;
  title: string;
  location: string;
  venue: string;
  category: string;
  date: string;
  time: string;
  description: string;
  highlights: string[];
  speaker?: string;
  speaker_title?: string;
  price: string;
  image_color: string;
  tag?: string;
  featured?: boolean;
}

export default function HomeClient({ events }: { events: Event[] }) {
  const [activeCategory, setActiveCategory] = useState<Category | "All">("All");
  const [search, setSearch] = useState("");

  const waLink = "https://wa.me/2349044209650?text=Hi, I want to feature my event on VENEW";
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
  }, []);

  const filtered = events.filter((e) => {
    const matchesCategory = activeCategory === "All" || e.category === activeCategory;
    const matchesSearch =
      search === "" ||
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.location.toLowerCase().includes(search.toLowerCase()) ||
      e.description?.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredEvents = filtered.filter((e) => e.featured);
  const regularEvents = filtered.filter((e) => !e.featured);

  return (
    <div style={{ backgroundColor: "#FFFFFF", minHeight: "100vh" }}>
      {/* Lean, search-first hero */}
      <section style={{
        padding: "64px 24px 40px",
        background: "linear-gradient(135deg, #FFFBF0 0%, #FFFFFF 60%)",
        borderBottom: "1px solid #F0F0F0",
      }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <p style={{ color: "#D97706", fontSize: "11px", fontWeight: 600, letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: "16px" }}>
            Africa's Discovery Platform
          </p>
          <h1 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(36px, 6vw, 56px)", fontWeight: 900, color: "#111827", lineHeight: 1.1, marginBottom: "32px" }}>
            Discover what's <span style={{ color: "#F5A623" }}>next.</span>
          </h1>

          <DiscoverySearch value={search} onChange={setSearch} />

          <p style={{ color: "#9CA3AF", fontSize: "14px", lineHeight: 1.6, maxWidth: "520px", marginTop: "24px" }}>
            Opportunities, scholarships, grants, fellowships, internships, jobs, events, competitions, and communities — all in one trusted place.
          </p>
        </div>
      </section>

      {/* Quiet secondary strip — stats + feature CTA, no longer competing with search */}
      <section style={{ padding: "20px 24px", backgroundColor: "#FFFFFF", borderBottom: "1px solid #F0F0F0" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
          <div style={{ display: "flex", gap: "24px", flexWrap: "wrap", color: "#9CA3AF", fontSize: "13px" }}>
            <span><strong style={{ color: "#F5A623" }}>{events.length}</strong> discoveries</span>
            <span><strong style={{ color: "#F5A623" }}>{categories.length}</strong> categories</span>
            <span>🇳🇬 Nigeria</span>
          </div>

          {user && (
            <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", backgroundColor: "#FFF8E7", border: "1px solid #F5A623", borderRadius: "999px", padding: "8px 16px", flexWrap: "wrap" }}>
              <span style={{ fontSize: "16px" }}>⭐</span>
              <span style={{ color: "#374151", fontSize: "13px" }}>Want your discovery featured?</span>
              <a href={waLink} target="_blank" rel="noopener noreferrer" style={{ backgroundColor: "#F5A623", color: "#FFFFFF", fontWeight: 700, fontSize: "12px", padding: "6px 14px", borderRadius: "999px", textDecoration: "none", whiteSpace: "nowrap" }}>
                Feature My Discovery
              </a>
            </div>
          )}
        </div>
      </section>

      <div style={{ paddingTop: "48px", backgroundColor: "#FFFFFF" }}>
        <RecommendedEvents events={events} />
      </div>

      <section style={{ padding: "48px 24px 80px", backgroundColor: "#FFFFFF" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", justifyContent: "space-between", gap: "20px", marginBottom: "36px" }}>
            <div>
              <h2 style={{ fontFamily: "Georgia, serif", fontSize: "28px", fontWeight: 700, color: "#111827" }}>
                {search ? `Results for "${search}"` : "Latest Discoveries"}
              </h2>
              <p style={{ color: "#9CA3AF", fontSize: "14px", marginTop: "4px" }}>
                {filtered.length} discover{filtered.length !== 1 ? "ies" : "y"} found
              </p>
            </div>
            <CategoryFilter active={activeCategory} onChange={setActiveCategory} />
          </div>

          {featuredEvents.length > 0 && (
            <div style={{ marginBottom: "40px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
                <span style={{ fontSize: "18px" }}>⭐</span>
                <h3 style={{ fontFamily: "Georgia, serif", fontSize: "20px", fontWeight: 700, color: "#D97706" }}>Featured Events & Opportunities</h3>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "24px" }}>
                {featuredEvents.map((event, i) => (
                  <EventCard key={event.id} event={event as any} index={i} />
                ))}
              </div>
              <div style={{ height: "1px", backgroundColor: "#F0F0F0", margin: "40px 0" }} />
            </div>
          )}

          {regularEvents.length > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "24px" }}>
              {regularEvents.map((event, i) => (
                <EventCard key={event.id} event={event as any} index={i} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "96px 0", textAlign: "center" }}>
              <p style={{ fontSize: "48px", marginBottom: "16px" }}>🔍</p>
              <p style={{ fontFamily: "Georgia, serif", fontSize: "20px", fontWeight: 700, color: "#111827", marginBottom: "8px" }}>No listings found</p>
              <p style={{ color: "#9CA3AF", fontSize: "14px", marginBottom: "24px" }}>Try a different search or category</p>
              <button onClick={() => { setSearch(""); setActiveCategory("All"); }} style={{ backgroundColor: "#F5A623", color: "#FFFFFF", fontWeight: 700, fontSize: "14px", padding: "12px 24px", borderRadius: "999px", border: "none", cursor: "pointer" }}>
                Clear filters
              </button>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}