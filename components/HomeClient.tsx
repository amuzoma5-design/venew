"use client";

import { useState } from "react";
import { categories, Category } from "@/lib/events";
import EventCard from "@/components/EventCard";
import CategoryFilter from "@/components/CategoryFilter";
import RecommendedEvents from "@/components/RecommendedEvents";

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

  const filtered = events.filter((e) => {
    const matchesCategory =
      activeCategory === "All" || e.category === activeCategory;
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
    <>
      {/* Hero */}
      <section style={{
        padding: "80px 24px 60px",
        background: "radial-gradient(ellipse at top right, rgba(245,166,35,0.08), transparent 60%)",
      }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
         <p style={{
            color: "#F5A623",
            fontSize: "11px",
            fontWeight: 600,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            marginBottom: "16px",
          }}>
            Events & Opportunities
          </p>

          <h1 style={{
            fontFamily: "Georgia, serif",
            fontSize: "clamp(40px, 8vw, 80px)",
            fontWeight: 900,
            color: "#E8E8E8",
            lineHeight: 1,
            marginBottom: "24px",
          }}>
            Discover<br />
            <span style={{ color: "#F5A623" }}>What&apos;s On.</span>
          </h1>

          <p style={{
            color: "#6B6B6B",
            fontSize: "18px",
            lineHeight: 1.7,
            maxWidth: "480px",
            marginBottom: "40px",
          }}>
            Conferences, church events, seminars, and workshops — all in one
            place. Find your next transformative experience.
          </p>

          {/* Stats */}
          <div style={{ display: "flex", gap: "48px", marginBottom: "32px", flexWrap: "wrap" }}>
            {[
              { label: "Events", value: `${events.length}` },
              { label: "Cities", value: "3" },
              { label: "Categories", value: `${categories.length}` },
            ].map(({ label, value }) => (
              <div key={label}>
                <p style={{
                  fontFamily: "Georgia, serif",
                  fontSize: "36px",
                  fontWeight: 900,
                  color: "#F5A623",
                  lineHeight: 1,
                }}>
                  {value}
                </p>
                <p style={{
                  color: "#6B6B6B",
                  fontSize: "11px",
                  textTransform: "uppercase",
                  letterSpacing: "0.2em",
                  marginTop: "6px",
                }}>
                  {label}
                </p>
              </div>
            ))}
          </div>

          {/* Feature Your Event CTA */}
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "12px",
            backgroundColor: "#1A1A1A",
            border: "1px solid #F5A623",
            borderRadius: "12px",
            padding: "12px 20px",
            marginBottom: "32px",
            flexWrap: "wrap",
          }}>
            <span style={{ fontSize: "20px" }}>⭐</span>
            <p style={{ color: "#E8E8E8", fontSize: "14px" }}>
              Want your event featured at the top?
            </p>
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                backgroundColor: "#F5A623",
                color: "#0D0D0D",
                fontWeight: 700,
                fontSize: "13px",
                padding: "8px 16px",
                borderRadius: "999px",
                textDecoration: "none",
                whiteSpace: "nowrap",
              }}
            >
              Feature My Event
            </a>
          </div>

          {/* Search bar */}
          <div style={{
            position: "relative",
            maxWidth: "600px",
          }}>
            <span style={{
              position: "absolute",
              left: "18px",
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: "18px",
              pointerEvents: "none",
            }}>
              🔍
            </span>
            <input
              type="text"
              placeholder="Search events, cities, topics..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                backgroundColor: "#1A1A1A",
                border: "1px solid #2A2A2A",
                borderRadius: "999px",
                padding: "16px 20px 16px 52px",
                color: "#E8E8E8",
                fontSize: "15px",
                outline: "none",
                boxSizing: "border-box",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => e.target.style.borderColor = "#F5A623"}
              onBlur={(e) => e.target.style.borderColor = "#2A2A2A"}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                style={{
                  position: "absolute",
                  right: "16px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  backgroundColor: "#2A2A2A",
                  border: "none",
                  borderRadius: "50%",
                  width: "24px",
                  height: "24px",
                  color: "#6B6B6B",
                  cursor: "pointer",
                  fontSize: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div style={{ height: "1px", backgroundColor: "#2A2A2A", margin: "0 24px" }} />

      {/* Recommended events */}
      <div style={{ paddingTop: "48px" }}>
        <RecommendedEvents events={events} />
      </div>

      {/* Events section */}
      <section style={{ padding: "48px 24px 80px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

          {/* Header + filter row */}
          <div style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "20px",
            marginBottom: "36px",
          }}>
            <div>
              <h2 style={{
                fontFamily: "Georgia, serif",
                fontSize: "28px",
                fontWeight: 700,
                color: "#E8E8E8",
              }}>
                {search ? `Results for "${search}"` : "Upcoming Events"}
              </h2>
              <p style={{ color: "#6B6B6B", fontSize: "14px", marginTop: "4px" }}>
                {filtered.length} event{filtered.length !== 1 ? "s" : ""} found
              </p>
            </div>
            <CategoryFilter active={activeCategory} onChange={setActiveCategory} />
          </div>

          {/* Featured events */}
          {featuredEvents.length > 0 && (
            <div style={{ marginBottom: "40px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
                <span style={{ fontSize: "18px" }}>⭐</span>
                <h3 style={{
                  fontFamily: "Georgia, serif",
                  fontSize: "20px",
                  fontWeight: 700,
                  color: "#F5A623",
                }}>
                  Featured Events
                </h3>
              </div>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: "24px",
              }}>
                {featuredEvents.map((event, i) => (
                  <EventCard key={event.id} event={event as any} index={i} />
                ))}
              </div>
              <div style={{ height: "1px", backgroundColor: "#2A2A2A", margin: "40px 0" }} />
            </div>
          )}

          {/* Regular events */}
          {regularEvents.length > 0 ? (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "24px",
            }}>
              {regularEvents.map((event, i) => (
                <EventCard key={event.id} event={event as any} index={i} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "96px 0",
              textAlign: "center",
            }}>
              <p style={{ fontSize: "48px", marginBottom: "16px" }}>🔍</p>
              <p style={{
                fontFamily: "Georgia, serif",
                fontSize: "20px",
                fontWeight: 700,
                color: "#E8E8E8",
                marginBottom: "8px",
              }}>
                No events found
              </p>
              <p style={{ color: "#6B6B6B", fontSize: "14px", marginBottom: "24px" }}>
                Try a different search or category
              </p>
              <button
                onClick={() => { setSearch(""); setActiveCategory("All"); }}
                style={{
                  backgroundColor: "#F5A623",
                  color: "#0D0D0D",
                  fontWeight: 700,
                  fontSize: "14px",
                  padding: "12px 24px",
                  borderRadius: "999px",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Clear filters
              </button>
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
}