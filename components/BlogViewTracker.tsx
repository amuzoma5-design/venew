"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function BlogViewTracker({ postId }: { postId: string }) {
  useEffect(() => {
    async function track() {
      await supabase.rpc("increment_blog_views", { post_id: postId });
    }
    track();
  }, [postId]);

  return null;
}