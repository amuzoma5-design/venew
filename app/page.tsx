import Navbar from "@/components/Navbar";
import HomeClient from "@/components/HomeClient";
import { supabase } from "@/lib/supabase";

export const revalidate = 60;

export default async function HomePage() {
  // Auto archive past events
  await supabase
    .from("events")
    .update({ status: "archived" })
    .lt("date", new Date().toISOString().split("T")[0])
    .eq("status", "upcoming");

  const { data: events, error } = await supabase
    .from("events")
    .select("*")
    .eq("approved", true)
    .eq("status", "upcoming")
    .order("featured", { ascending: false })
    .order("date", { ascending: true });

  if (error) {
    console.error("Failed to load events:", error.message);
  }

  return (
    <main>
      <Navbar />
      <HomeClient events={events ?? []} />
    </main>
  );
}