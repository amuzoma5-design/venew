"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface SaveEventButtonProps {
  eventId: string;
}

export default function SaveEventButton({ eventId }: SaveEventButtonProps) {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function check() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { setLoading(false); return; }
      setUser(session.user);

      const { data } = await supabase
        .from("saved_events")
        .select("id")
        .eq("user_id", session.user.id)
        .eq("event_id", eventId)
        .single();

      setSaved(!!data);
      setLoading(false);
    }
    check();
  }, [eventId]);

  async function toggleSave() {
    if (!user) {
      window.location.href = "/auth/login";
      return;
    }

    if (saved) {
      await supabase
        .from("saved_events")
        .delete()
        .eq("user_id", user.id)
        .eq("event_id", eventId);

      // Track activity
      await supabase.from("user_activity").insert({
        user_id: user.id,
        event_id: eventId,
        action_type: "unsaved",
      });

      setSaved(false);
    } else {
      await supabase.from("saved_events").insert({
        user_id: user.id,
        event_id: eventId,
      });

      // Track activity
      await supabase.from("user_activity").insert({
        user_id: user.id,
        event_id: eventId,
        action_type: "saved",
      });

      setSaved(true);
    }
  }

  if (loading) return null;

  return (
    <button
      onClick={toggleSave}
      style={{
        width: "100%",
        backgroundColor: saved ? "#F43F5E" : "transparent",
        color: saved ? "white" : "#F43F5E",
        fontWeight: 700,
        fontSize: "14px",
        padding: "14px",
        borderRadius: "12px",
        border: "1px solid #F43F5E",
        cursor: "pointer",
        marginBottom: "10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        transition: "all 0.2s",
      }}
    >
      {saved ? "❤️ Saved" : "🤍 Save Event"}
    </button>
  );
}