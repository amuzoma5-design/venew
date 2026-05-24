import Navbar from "@/components/Navbar";
import HomeClient from "@/components/HomeClient";
import { supabase } from "@/lib/supabase";

export const revalidate = 60;

export default async function HomePage() {
  const { data: events, error } = await supabase
    .from("events")
    .select("*")
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