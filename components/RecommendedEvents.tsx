"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import EventCard from "@/components/EventCard";

export default function RecommendedEvents({ events }: { events: any[] }) {
  const [recommended, setRecommended] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getRecommendations() {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        setLoading(false);
        return;
      }

      // Get user profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("interests, city")
        .eq("id", session.user.id)
        .single();

      // Get user activity - categories they viewed
      const { data: activity } = await supabase
        .from("user_activity")
        .select("event_id")
        .eq("user_id", session.user.id)
        .eq("action_type", "viewed");

      // Get categories of viewed events
      const viewedEventIds = activity?.map((a) => a.event_id) ?? [];
      let viewedCategories: string[] = [];

      if (viewedEventIds.length > 0) {
        const { data: viewedEvents } = await supabase
          .from("events")
          .select("category")
          .in("id", viewedEventIds);
        viewedCategories = viewedEvents?.map((e) => e.category) ?? [];
      }

      const interests = profile?.interests ?? [];
      const city = profile?.city ?? "";

      // Score each event
      const scored = events.map((event) => {
        let score = 0;

        // +5 if matches user interest
        if (interests.includes(event.category)) score += 5;

        // +3 if matches user city
        if (
          city &&
          event.location?.toLowerCase().includes(city.toLowerCase())
        ) score += 3;

        // +2 if user viewed similar category before
        if (viewedCategories.includes(event.category)) score += 2;

        // +1 for featured events
        if (event.featured) score += 1;

        return { ...event, score };
      });

      // Filter events with score > 0 and sort by score
      const filtered = scored
        .filter((e) => e.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);

      setRecommended(filtered);
      setLoading(false);
    }

    getRecommendations();
  }, [events]);

  if (loading || recommended.length === 0) return null;

  return (
    <section style={{ padding: "0 24px 0" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
            <span style={{ fontSize: "20px" }}>🎯</span>
            <h2 style={{
              fontFamily: "Georgia, serif",
              fontSize: "22px",
              fontWeight: 700,
              color: "#111827",
            }}>
              Recommended For You
            </h2>
          </div>
          <p style={{ color: "#9CA3AF", fontSize: "13px" }}>
            Based on your interests and activity
          </p>
        </div>

        {/* Cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "24px",
          marginBottom: "40px",
        }}>
          {recommended.map((event, i) => (
            <EventCard key={event.id} event={event} index={i} />
          ))}
        </div>

        {/* Divider */}
        <div style={{ height: "1px", backgroundColor: "#F0F0F0", marginBottom: "40px" }} />
      </div>
    </section>
  );
}