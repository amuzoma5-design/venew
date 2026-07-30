import Navbar from "@/components/Navbar";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export const revalidate = 60;

export default async function BlogPage() {
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });

  const categoryColors: Record<string, string> = {
    Opportunities: "#14B8A6",
    Events: "#F59E0B",
    Communities: "#A78BFA",
    Career: "#10B981",
    Startup: "#3B82F6",
    Church: "#F43F5E",
    General: "#6B7280",
  };

  return (
    <main style={{ backgroundColor: "#FFFFFF", minHeight: "100vh" }}>
      <Navbar />

      {/* Hero */}
      <section style={{
        padding: "60px 24px 48px",
        background: "linear-gradient(135deg, #FFFBF0 0%, #FFFFFF 60%)",
        borderBottom: "1px solid #F0F0F0",
        textAlign: "center",
      }}>
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <p style={{
            color: "#D97706",
            fontSize: "11px",
            fontWeight: 600,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            marginBottom: "16px",
          }}>
            Discovery Hub
          </p>
          <h1 style={{
            fontFamily: "Georgia, serif",
            fontSize: "clamp(32px, 6vw, 52px)",
            fontWeight: 900,
            color: "#111827",
            lineHeight: 1.1,
            marginBottom: "16px",
          }}>
            Insights on Events,
            <br />
            <span style={{ color: "#F5A623" }}>Opportunities & Growth</span>
          </h1>
          <p style={{
            color: "#6B7280",
            fontSize: "16px",
            lineHeight: 1.8,
            marginBottom: "24px",
          }}>
            Discover scholarships, opportunities, events and communities
            that can help you grow personally, professionally and spiritually.
          </p>
          <Link href="/events" style={{
            display: "inline-block",
            backgroundColor: "#F5A623",
            color: "#FFFFFF",
            fontWeight: 700,
            fontSize: "14px",
            padding: "12px 24px",
            borderRadius: "12px",
            textDecoration: "none",
          }}>
            Explore Discoveries →
          </Link>
        </div>
      </section>

      {/* Posts */}
      <section style={{ padding: "48px 24px 80px", maxWidth: "1100px", margin: "0 auto" }}>
        {!posts || posts.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <p style={{ fontSize: "48px", marginBottom: "16px" }}>✍️</p>
            <p style={{
              fontFamily: "Georgia, serif",
              fontSize: "22px",
              fontWeight: 700,
              color: "#111827",
              marginBottom: "8px",
            }}>
              First discovery coming soon
            </p>
            <p style={{ color: "#9CA3AF", fontSize: "14px" }}>
              We are curating verified opportunities and discoveries for you. Check back soon!
            </p>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "24px",
          }}>
            {posts.map((post) => {
              const catColor = categoryColors[post.category] ?? "#6B7280";
              return (
                <Link key={post.id} href={`/blog/${post.slug}`} style={{ textDecoration: "none" }}>
                  <div style={{
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #E5E7EB",
                    borderRadius: "16px",
                    overflow: "hidden",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                    transition: "box-shadow 0.2s, transform 0.2s",
                    height: "100%",
                  }}>
                    {/* Cover image */}
                    <div style={{
                      height: "180px",
                      background: post.cover_image
                        ? `url(${post.cover_image}) center/cover no-repeat`
                        : `linear-gradient(135deg, ${catColor}40, ${catColor}20)`,
                      display: "flex",
                      alignItems: "flex-end",
                      padding: "16px",
                    }}>
                      <span style={{
                        fontSize: "11px",
                        fontWeight: 700,
                        padding: "4px 10px",
                        borderRadius: "999px",
                        color: catColor,
                        backgroundColor: "white",
                      }}>
                        {post.category}
                      </span>
                    </div>

                    {/* Content */}
                    <div style={{ padding: "20px" }}>
                      <h2 style={{
                        fontFamily: "Georgia, serif",
                        fontSize: "18px",
                        fontWeight: 700,
                        color: "#111827",
                        lineHeight: 1.3,
                        marginBottom: "10px",
                      }}>
                        {post.title}
                      </h2>
                      <p style={{
                        color: "#6B7280",
                        fontSize: "14px",
                        lineHeight: 1.6,
                        marginBottom: "16px",
                      }}>
                        {post.excerpt}
                      </p>
                      <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        paddingTop: "12px",
                        borderTop: "1px solid #F3F4F6",
                      }}>
                        <p style={{ color: "#9CA3AF", fontSize: "12px" }}>
                          {new Date(post.created_at).toLocaleDateString("en-NG", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </p>
                        <span style={{ color: "#F5A623", fontSize: "13px", fontWeight: 700 }}>
                          Read →
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}