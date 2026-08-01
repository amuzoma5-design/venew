import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Link from "next/link";

export const revalidate = 60;

export default async function SpotlightPage() {
  const { data: spotlights } = await supabase
    .from("spotlights")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });

  const featured = spotlights?.find((s) => s.featured);
  const rest = spotlights?.filter((s) => !s.featured) ?? [];

  const categoryColors: Record<string, string> = {
    People: "#F5A623",
    Businesses: "#10B981",
    Startups: "#3B82F6",
    Students: "#A78BFA",
    Communities: "#F43F5E",
    "African Legends": "#F59E0B",
  };

  const categories = ["People", "Businesses", "Startups", "Students", "Communities", "African Legends"];

  return (
    <main style={{ backgroundColor: "#0D0D0D", minHeight: "100vh" }}>
      <Navbar />

      {/* Hero */}
      <section style={{ padding: "60px 24px 48px", background: "radial-gradient(ellipse at top right, rgba(245,166,35,0.1), transparent 60%)", borderBottom: "1px solid #2A2A2A", textAlign: "center" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", backgroundColor: "#1A1A1A", border: "1px solid #F5A623", borderRadius: "999px", padding: "6px 16px", marginBottom: "24px" }}>
            <span style={{ fontSize: "14px" }}>✨</span>
            <span style={{ color: "#F5A623", fontSize: "12px", fontWeight: 600 }}>Venew Spotlight</span>
          </div>
          <h1 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(32px, 6vw, 56px)", fontWeight: 900, color: "#E8E8E8", lineHeight: 1.1, marginBottom: "16px" }}>
            Inspiring People,
            <br />
            <span style={{ color: "#F5A623" }}>Remarkable Stories</span>
          </h1>
          <p style={{ color: "#6B6B6B", fontSize: "16px", lineHeight: 1.8, marginBottom: "32px" }}>
            Celebrating the people, businesses, startups, students, communities,
            and African legends who are building something worth discovering.
          </p>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center" }}>
            {categories.map((cat) => {
              const color = categoryColors[cat] ?? "#F5A623";
              return (
                <span key={cat} style={{ fontSize: "12px", fontWeight: 600, padding: "6px 14px", borderRadius: "999px", backgroundColor: color + "20", color: color, border: "1px solid " + color + "30" }}>
                  {cat}
                </span>
              );
            })}
          </div>
        </div>
      </section>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "48px 24px 80px" }}>

        {/* Featured Spotlight */}
        {featured && (
          <div style={{ marginBottom: "64px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "24px" }}>
              <span style={{ fontSize: "18px" }}>✨</span>
              <h2 style={{ fontFamily: "Georgia, serif", fontSize: "20px", fontWeight: 700, color: "#F5A623" }}>Featured Spotlight</h2>
            </div>
            <Link href={"/spotlight/" + featured.slug} style={{ textDecoration: "none", display: "block" }}>
              <div style={{ backgroundColor: "#1A1A1A", border: "1px solid #F5A62330", borderRadius: "20px", overflow: "hidden", display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: "360px" }}>
                <div style={{ background: featured.cover_image ? "url(" + featured.cover_image + ") center/cover no-repeat" : "linear-gradient(135deg, #F5A62340, #1A1A1A)", minHeight: "360px" }} />
                <div style={{ padding: "40px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <span style={{ fontSize: "12px", fontWeight: 700, padding: "4px 12px", borderRadius: "999px", backgroundColor: (categoryColors[featured.category] ?? "#F5A623") + "20", color: categoryColors[featured.category] ?? "#F5A623", display: "inline-block", marginBottom: "16px", width: "fit-content" }}>{featured.category}</span>
                  <h3 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(20px, 3vw, 32px)", fontWeight: 900, color: "#E8E8E8", lineHeight: 1.2, marginBottom: "16px" }}>{featured.title}</h3>
                  <p style={{ color: "#6B6B6B", fontSize: "15px", lineHeight: 1.7, marginBottom: "24px" }}>{featured.summary}</p>
                  {featured.quote && (
                    <p style={{ color: "#F5A623", fontSize: "14px", fontStyle: "italic", borderLeft: "3px solid #F5A623", paddingLeft: "16px" }}>"{featured.quote}"</p>
                  )}
                  <p style={{ color: "#F5A623", fontWeight: 700, fontSize: "14px", marginTop: "24px" }}>Read Full Story →</p>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* All Spotlights */}
        {rest.length > 0 ? (
          <div>
            <h2 style={{ fontFamily: "Georgia, serif", fontSize: "24px", fontWeight: 700, color: "#E8E8E8", marginBottom: "24px" }}>
              {featured ? "More Spotlights" : "All Spotlights"}
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "24px" }}>
              {rest.map((spotlight) => {
                const catColor = categoryColors[spotlight.category] ?? "#F5A623";
                return (
                  <Link key={spotlight.id} href={"/spotlight/" + spotlight.slug} style={{ textDecoration: "none" }}>
                    <div style={{ backgroundColor: "#1A1A1A", border: "1px solid #2A2A2A", borderRadius: "16px", overflow: "hidden", height: "100%" }}>
                      <div style={{ height: "200px", background: spotlight.cover_image ? "url(" + spotlight.cover_image + ") center/cover no-repeat" : "linear-gradient(135deg, " + catColor + "40, #1A1A1A)", position: "relative" }}>
                        <span style={{ position: "absolute", top: "16px", left: "16px", fontSize: "11px", fontWeight: 700, padding: "4px 10px", borderRadius: "999px", backgroundColor: "#0D0D0D90", color: catColor }}>{spotlight.category}</span>
                      </div>
                      <div style={{ padding: "20px" }}>
                        <h3 style={{ fontFamily: "Georgia, serif", fontSize: "18px", fontWeight: 700, color: "#E8E8E8", lineHeight: 1.3, marginBottom: "10px" }}>{spotlight.title}</h3>
                        <p style={{ color: "#6B6B6B", fontSize: "14px", lineHeight: 1.6, marginBottom: "16px" }}>{spotlight.summary}</p>
                        {spotlight.quote && (
                          <p style={{ color: "#F5A623", fontSize: "13px", fontStyle: "italic", borderLeft: "2px solid #F5A623", paddingLeft: "12px", marginBottom: "16px" }}>"{spotlight.quote}"</p>
                        )}
                        <p style={{ color: "#F5A623", fontWeight: 700, fontSize: "13px" }}>Read Story →</p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ) : !featured ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <p style={{ fontSize: "48px", marginBottom: "16px" }}>✨</p>
            <p style={{ fontFamily: "Georgia, serif", fontSize: "22px", fontWeight: 700, color: "#E8E8E8", marginBottom: "8px" }}>First spotlight coming soon</p>
            <p style={{ color: "#6B6B6B", fontSize: "14px" }}>We are curating inspiring stories from across Africa. Check back soon!</p>
          </div>
        ) : null}
      </div>
    </main>
  );
}