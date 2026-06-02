"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function ActivityTracker({ eventId }: { eventId: string }) {
  useEffect(() => {
    async function track() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      await supabase.from("user_activity").insert({
        user_id: session.user.id,
        event_id: eventId,
        action_type: "viewed",
      });
    }
    track();
  }, [eventId]);

  return null;
}