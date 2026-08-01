import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { notFound } from "next/navigation";
import BlogShareButtons from "@/components/BlogShareButtons";

export default async function SpotlightDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { data: spotlight, error } = await supabase
    .from("spotlights")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (error || !spotlight) notFound();

  const { data: related } = await supabase
    .from("spotlights")
    .select("id, title, slug, category, summary, cover_image")
    .eq("published", true)
    .eq("category", spotlight.category)
    .neq("slug", slug)
    .limit(3);

  const categoryColors: Record<string, string> = {
    People: "#F5A623",
    Businesses: "#10B981",
    Startups: "#3B82F6",
    Students: "#A78BFA",
    Communities: "#F43F5E",
    "African Legends": "#F59E0B",
  };

  const catColor = categoryColors[spotlight.category] ?? "#F5A623";
  const shareUrl = "https://venew.ng/spotlight/" + spotlight.slug;
  const shareText = spotlight.title + " — Venew Spotlight 👉 " + shareUrl;

  return (
    <main style={{ backgroundColor: "#0D0D0D", minHeight: "100vh" }}>
      <Navbar />

      {/* Cover */}
      <div style={{ height: "400px", background: spotlight.cover_image ? "url(" + spotlight.cover_image + ") center/cover no-repeat" : "linear-gradient(135deg, " + catColor + "60, #0D0D0D)", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(13,13,13,0.95), rgba(13,13,13,0.3))" }} />
        <div style={{ position: "absolute", bottom: "40px", left: "24px", right: "24px", maxWidth: "800px", margin: "0 auto" }}>
          <span style={{ fontSize: "12px", fontWeight: 700, padding: "4px 12px", borderRadius: "999px", backgroundColor: catColor + "30", color: catColor, display: "inline-block", marginBottom: "16px" }}>
            ✨ {spotlight.category}
          </span>
          <h1 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 900, color: "#E8E8E8", lineHeight: 1.2 }}>
            {spotlight.title}
          </h1>
        </div>
      </div>

      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 24px 80px" }}>

        <Link href="/spotlight" style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "#6B6B6B", fontSize: "14px", textDecoration: "none", marginBottom: "32px" }}>
          ← Back to Spotlight
        </Link>

        {/* Summary */}
        {spotlight.summary && (
          <p style={{ color: "#E8E8E8", fontSize: "18px", lineHeight: 1.8, fontWeight: 500, marginBottom: "32px", padding: "24px", backgroundColor: "#1A1A1A", borderRadius: "16px", border: "1px solid #2A2A2A" }}>
            {spotlight.summary}
          </p>
        )}

        {/* Quote */}
        {spotlight.quote && (
          <div style={{ padding: "28px", backgroundColor: "#1A1A1A", borderRadius: "16px", border: "1px solid #F5A62330", marginBottom: "32px", textAlign: "center" }}>
            <p style={{ color: "#F5A623", fontSize: "20px", fontStyle: "italic", lineHeight: 1.7, fontFamily: "Georgia, serif" }}>
              &ldquo;{spotlight.quote}&rdquo;
            </p>
          </div>
        )}

        {/* Story */}
        {spotlight.story && (
          <div style={{ marginBottom: "40px" }}>
            <h2 style={{ fontFamily: "Georgia, serif", fontSize: "24px", fontWeight: 700, color: "#E8E8E8", marginBottom: "20px" }}>The Story</h2>
            <div style={{ color: "#9CA3AF", fontSize: "16px", lineHeight: 1.9, whiteSpace: "pre-wrap" }}>
              {spotlight.story}
            </div>
          </div>
        )}

        {/* Achievements */}
        {spotlight.achievements && (
          <div style={{ marginBottom: "40px", backgroundColor: "#1A1A1A", border: "1px solid #2A2A2A", borderRadius: "16px", padding: "28px" }}>
            <h2 style={{ fontFamily: "Georgia, serif", fontSize: "24px", fontWeight: 700, color: "#E8E8E8", marginBottom: "20px" }}>Key Achievements</h2>
            <div style={{ color: "#9CA3AF", fontSize: "16px", lineHeight: 1.9, whiteSpace: "pre-wrap" }}>
              {spotlight.achievements}
            </div>
          </div>
        )}

        {/* Divider */}
        <div style={{ height: "1px", backgroundColor: "#2A2A2A", margin: "40px 0" }} />

        {/* Share */}
        <div style={{ marginBottom: "48px" }}>
          <p style={{ fontFamily: "Georgia, serif", fontSize: "18px", fontWeight: 700, color: "#E8E8E8", marginBottom: "16px" }}>Share this Spotlight</p>
          <BlogShareButtons shareUrl={shareUrl} shareText={shareText} />
        </div>

        {/* Related spotlights */}
        {related && related.length > 0 && (
          <div>
            <h2 style={{ fontFamily: "Georgia, serif", fontSize: "22px", fontWeight: 700, color: "#E8E8E8", marginBottom: "20px" }}>Related Spotlights</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "16px" }}>
              {related.map((s: any) => {
                const color = categoryColors[s.category] ?? "#F5A623";
                return (
                  <Link key={s.id} href={"/spotlight/" + s.slug} style={{ textDecoration: "none" }}>
                    <div style={{ backgroundColor: "#1A1A1A", border: "1px solid #2A2A2A", borderRadius: "12px", overflow: "hidden" }}>
                      <div style={{ height: "120px", background: s.cover_image ? "url(" + s.cover_image + ") center/cover no-repeat" : "linear-gradient(135deg, " + color + "40, #1A1A1A)" }} />
                      <div style={{ padding: "16px" }}>
                        <p style={{ color: "#E8E8E8", fontWeight: 700, fontSize: "14px", fontFamily: "Georgia, serif", marginBottom: "6px" }}>{s.title}</p>
                        <p style={{ color: "#F5A623", fontSize: "12px", fontWeight: 700 }}>Read Story →</p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* CTA */}
        <div style={{ marginTop: "48px", backgroundColor: "#1A1A1A", border: "1px solid #F5A62330", borderRadius: "16px", padding: "32px", textAlign: "center" }}>
          <p style={{ fontFamily: "Georgia, serif", fontSize: "22px", fontWeight: 900, color: "#E8E8E8", marginBottom: "8px" }}>Discover More on VENEW</p>
          <p style={{ color: "#6B6B6B", fontSize: "14px", marginBottom: "20px" }}>Find opportunities, events, scholarships and communities across Africa.</p>
          <Link href="/events" style={{ display: "inline-block", backgroundColor: "#F5A623", color: "#0D0D0D", fontWeight: 700, fontSize: "15px", padding: "14px 32px", borderRadius: "12px", textDecoration: "none" }}>
            Explore Discoveries →
          </Link>
        </div>
      </div>
    </main>
  );
}