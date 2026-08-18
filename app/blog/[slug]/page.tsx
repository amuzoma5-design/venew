import Navbar from "@/components/Navbar";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import BlogShareButtons from "@/components/BlogShareButtons";
import BlogViewTracker from "@/components/BlogViewTracker";

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { data: post, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (error || !post) notFound();

  const categoryColors: Record<string, string> = {
    Opportunities: "#14B8A6",
    Events: "#F59E0B",
    Communities: "#A78BFA",
    Career: "#10B981",
    Startup: "#3B82F6",
    Church: "#F43F5E",
    General: "#6B7280",
  };

  const catColor = categoryColors[post.category] ?? "#6B7280";
  const shareUrl = "https://venew.ng/blog/" + post.slug;
  const shareText = post.title + " — Read on VENEW 👉 " + shareUrl;

  return (
    <main style={{ backgroundColor: "#FFFFFF", minHeight: "100vh" }}>
      <Navbar />
      <BlogViewTracker postId={post.id} />

      <div style={{ height: "320px", background: post.cover_image ? "url(" + post.cover_image + ") center/cover no-repeat" : "linear-gradient(135deg, " + catColor + "60, " + catColor + "20)", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, background: post.cover_image ? "linear-gradient(to top, rgba(0,0,0,0.5), rgba(0,0,0,0.1))" : "none" }} />
      </div>

      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "40px 24px 80px" }}>

        <Link href="/blog" style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "#6B7280", fontSize: "14px", textDecoration: "none", marginBottom: "32px" }}>
          ← Back to Blog
        </Link>

        <span style={{ display: "inline-block", fontSize: "11px", fontWeight: 700, padding: "4px 12px", borderRadius: "999px", color: catColor, backgroundColor: catColor + "15", marginBottom: "16px" }}>
          {post.category}
        </span>

        <h1 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(28px, 5vw, 44px)", fontWeight: 900, color: "#111827", lineHeight: 1.2, marginBottom: "16px" }}>
          {post.title}
        </h1>

        <p style={{ color: "#9CA3AF", fontSize: "13px", marginBottom: "32px" }}>
          Published {new Date(post.created_at).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" })}
        </p>

        <div style={{ height: "1px", backgroundColor: "#F0F0F0", marginBottom: "32px" }} />

        <div style={{ color: "#374151", fontSize: "16px", lineHeight: 1.9, whiteSpace: "pre-wrap" }}>
          {post.content}
        </div>

        <div style={{ height: "1px", backgroundColor: "#F0F0F0", margin: "40px 0" }} />

        <div>
          <p style={{ fontFamily: "Georgia, serif", fontSize: "18px", fontWeight: 700, color: "#111827", marginBottom: "16px" }}>
            Share this article
          </p>
          <BlogShareButtons shareUrl={shareUrl} shareText={shareText} />
        </div>

        <div style={{ marginTop: "48px", backgroundColor: "#FFF8E7", border: "1px solid #F5A623", borderRadius: "16px", padding: "32px", textAlign: "center" }}>
          <p style={{ fontFamily: "Georgia, serif", fontSize: "22px", fontWeight: 900, color: "#111827", marginBottom: "8px" }}>
            Discover More on VENEW
          </p>
          <p style={{ color: "#6B7280", fontSize: "14px", marginBottom: "20px" }}>
            Find scholarships, grants, fellowships, events, communities and opportunities across Africa.
          </p>
          <Link href="/events" style={{ display: "inline-block", backgroundColor: "#F5A623", color: "#FFFFFF", fontWeight: 700, fontSize: "15px", padding: "14px 32px", borderRadius: "12px", textDecoration: "none" }}>
            Explore Discoveries →
          </Link>
        </div>
      </div>
    </main>
  );
}