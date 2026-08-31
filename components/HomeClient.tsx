"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { Category } from "@/lib/events";
import { getGroupForType, PrimaryGroup } from "@/lib/discoveryTypes";
import { rankDiscoveries } from "@/lib/rankDiscoveries";
import DiscoveryFullCard from "@/components/DiscoveryFullCard";
import DiscoveryFilterPanel from "@/components/DiscoveryFilterPanel";

interface Event {
  id: string;
  title: string;
  location: string;
  venue: string;
  category: string;
  type?: string;
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

const NAVBAR_HEIGHT = 72; // adjust if this doesn't match your actual Navbar height

export default function HomeClient({ events }: { events: Event[] }) {
  const [activeGroup, setActiveGroup] = useState<PrimaryGroup>("All");
  const [activeCategory, setActiveCategory] = useState<Category | "All">("All");
  const [search, setSearch] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<"next" | "prev">("next");

  const [interests, setInterests] = useState<string[]>([]);
  const [city, setCity] = useState("");
  const [viewedCategories, setViewedCategories] = useState<string[]>([]);

  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    async function loadSignals() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("interests, city")
        .eq("id", session.user.id)
        .single();

      const { data: activity } = await supabase
        .from("user_activity")
        .select("event_id")
        .eq("user_id", session.user.id)
        .eq("action_type", "viewed");

      const viewedEventIds = activity?.map((a) => a.event_id) ?? [];
      let viewedCats: string[] = [];
      if (viewedEventIds.length > 0) {
        const { data: viewedEvents } = await supabase
          .from("events")
          .select("category")
          .in("id", viewedEventIds);
        viewedCats = viewedEvents?.map((e) => e.category) ?? [];
      }

      setInterests(profile?.interests ?? []);
      setCity(profile?.city ?? "");
      setViewedCategories(viewedCats);
    }

    loadSignals();
  }, []);

  const filtered = useMemo(() => {
    return events.filter((e) => {
      const matchesGroup = activeGroup === "All" || getGroupForType(e.type) === activeGroup;
      const matchesCategory = activeCategory === "All" || e.category === activeCategory;
      const matchesSearch =
        search === "" ||
        e.title.toLowerCase().includes(search.toLowerCase()) ||
        e.location.toLowerCase().includes(search.toLowerCase()) ||
        e.description?.toLowerCase().includes(search.toLowerCase());
      return matchesGroup && matchesCategory && matchesSearch;
    });
  }, [events, activeGroup, activeCategory, search]);

  const ranked = useMemo(
    () => rankDiscoveries(filtered, { interests, city, viewedCategories }),
    [filtered, interests, city, viewedCategories]
  );

  useEffect(() => {
    setIndex(0);
  }, [activeGroup, activeCategory, search]);

  const goNext = useCallback(() => {
    setDirection("next");
    setIndex((i) => Math.min(i + 1, ranked.length - 1));
  }, [ranked.length]);

  const goPrev = useCallback(() => {
    setDirection("prev");
    setIndex((i) => Math.max(i - 1, 0));
  }, []);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [goNext, goPrev]);

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const SWIPE_THRESHOLD = 50;

    if (deltaX < -SWIPE_THRESHOLD) goNext();
    else if (deltaX > SWIPE_THRESHOLD) goPrev();

    touchStartX.current = null;
  }

  const current = ranked[index];

  return (
    <div style={{ backgroundColor: "#0D0D0D" }}>
      <style>{`
        @keyframes discoverySlideInNext {
          from { opacity: 0; transform: translateX(24px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes discoverySlideInPrev {
          from { opacity: 0; transform: translateX(-24px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @media (max-width: 767px) {
          .discovery-desktop-nav { display: none; }
        }
      `}</style>

      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{
          position: "relative",
          width: "100%",
          height: `calc(100dvh - ${NAVBAR_HEIGHT}px)`,
          overflow: "hidden",
        }}
      >
        {ranked.length === 0 ? (
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            textAlign: "center",
            padding: "0 24px",
          }}>
            <p style={{ fontSize: "48px", marginBottom: "16px" }}>🔍</p>
            <p style={{ fontFamily: "Georgia, serif", fontSize: "22px", fontWeight: 700, color: "#E8E8E8", marginBottom: "8px" }}>
              Your discovery journey starts here
            </p>
            <p style={{ color: "#6B6B6B", fontSize: "14px", marginBottom: "24px" }}>
              Try a different search or category
            </p>
            <button
              onClick={() => { setSearch(""); setActiveCategory("All"); setActiveGroup("All"); }}
              style={{ backgroundColor: "#F5A623", color: "#0D0D0D", fontWeight: 700, fontSize: "14px", padding: "12px 24px", borderRadius: "999px", border: "none", cursor: "pointer" }}
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div
            key={current.id}
            style={{
              width: "100%",
              height: "100%",
              animation: `${direction === "next" ? "discoverySlideInNext" : "discoverySlideInPrev"} 0.25s ease-out`,
            }}
          >
            <DiscoveryFullCard event={current} />
          </div>
        )}

        <div style={{
          position: "absolute",
          top: "16px",
          left: "16px",
          right: "16px",
          zIndex: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <span style={{
            color: "#FFFFFF",
            fontSize: "12px",
            fontWeight: 600,
            backgroundColor: "rgba(0,0,0,0.4)",
            padding: "6px 12px",
            borderRadius: "999px",
          }}>
            {ranked.length > 0 ? `${index + 1} / ${ranked.length}` : "0 / 0"}
          </span>

          <button
            onClick={() => setFilterOpen(true)}
            style={{
              backgroundColor: "rgba(0,0,0,0.4)",
              border: "none",
              borderRadius: "999px",
              width: "36px",
              height: "36px",
              color: "#FFFFFF",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            🔍
          </button>
        </div>

        <div className="discovery-desktop-nav">
          <button
            onClick={goPrev}
            disabled={index === 0}
            aria-label="Previous discovery"
            style={{
              position: "absolute",
              left: "16px",
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 2,
              backgroundColor: "rgba(0,0,0,0.4)",
              border: "none",
              borderRadius: "50%",
              width: "44px",
              height: "44px",
              color: "#FFFFFF",
              fontSize: "20px",
              cursor: index === 0 ? "default" : "pointer",
              opacity: index === 0 ? 0.3 : 1,
            }}
          >
            ‹
          </button>
          <button
            onClick={goNext}
            disabled={index >= ranked.length - 1}
            aria-label="Next discovery"
            style={{
              position: "absolute",
              right: "16px",
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 2,
              backgroundColor: "rgba(0,0,0,0.4)",
              border: "none",
              borderRadius: "50%",
              width: "44px",
              height: "44px",
              color: "#FFFFFF",
              fontSize: "20px",
              cursor: index >= ranked.length - 1 ? "default" : "pointer",
              opacity: index >= ranked.length - 1 ? 0.3 : 1,
            }}
          >
            ›
          </button>
        </div>
      </div>

      <DiscoveryFilterPanel
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        search={search}
        onSearchChange={setSearch}
        activeGroup={activeGroup}
        onGroupChange={setActiveGroup}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        resultCount={ranked.length}
      />
    </div>
  );
}