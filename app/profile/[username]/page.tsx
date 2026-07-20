import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProfileShareButtons from "@/components/ProfileShareButtons";

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .eq("is_public", true)
    .single();

  if (error || !profile) notFound();

  const { data: events } = await supabase
    .from("events")
    .select("id, title, category, date, location, status")
    .eq("user_id", profile.id)
    .eq("approved", true)
    .order("date", { ascending: false })
    .limit(6);

  const profileUrl = "https://venew.ng/profile/" + username;

  const completionItems = [
    { done: !!profile.avatar_url, label: "Profile photo" },
    { done: !!profile.display_name, label: "Full name" },
    { done: !!profile.title, label: "Professional title" },
    { done: !!profile.bio, label: "Bio" },
    { done: !!profile.city, label: "City" },
    { done: profile.skills?.length > 0, label: "Skills" },
    { done: !!profile.cover_url, label: "Cover image" },
  ];

  const completionScore = Math.round(
    (completionItems.filter((i) => i.done).length / completionItems.length) * 100
  );

  const categoryColors: Record<string, string> = {
    Conference: "#F59E0B",
    Church: "#A78BFA",
    Seminar: "#22D3EE",
    Workshop: "#FB7185",
    Business: "#10B981",
    "Music & Entertainment": "#F43F5E",
    Technology: "#3B82F6",
    "Real Estate": "#8B5CF6",
    Education: "#F97316",
    Opportunities: "#14B8A6",
  };

  const socialLinks = profile.social_links || {};

  return (
    <main style={{ backgroundColor: "#FFFFFF", minHeight: "100vh" }}>
      <Navbar />

      <div style={{ height: "200px", background: profile.cover_url ? "url(" + profile.cover_url + ") center/cover no-repeat" : "linear-gradient(135deg, #FFF8E7 0%, #F5A62320 100%)", borderBottom: "1px solid #F0F0F0" }} />

      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 24px" }}>

        <div style={{ marginTop: "-60px", marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "16px" }}>
          <div style={{ width: "120px", height: "120px", borderRadius: "50%", border: "4px solid #FFFFFF", background: profile.avatar_url ? "url(" + profile.avatar_url + ") center/cover no-repeat" : "linear-gradient(135deg, #F5A623, #D97706)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Georgia, serif", fontSize: "40px", fontWeight: 900, color: "white", flexShrink: 0, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
            {!profile.avatar_url && (profile.display_name?.[0] ?? "V")}
          </div>
          <ProfileShareButtons profileUrl={profileUrl} name={profile.display_name || username} />
        </div>

        <div style={{ marginBottom: "24px" }}>
          <h1 style={{ fontFamily: "Georgia, serif", fontSize: "28px", fontWeight: 900, color: "#111827", marginBottom: "4px" }}>
            {profile.display_name || username}
          </h1>
          {profile.title && <p style={{ color: "#374151", fontSize: "16px", fontWeight: 600, marginBottom: "4px" }}>{profile.title}</p>}
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginTop: "8px" }}>
            {profile.city && <span style={{ color: "#6B7280", fontSize: "14px" }}>📍 {profile.city}</span>}
            {profile.availability && (
              <span style={{ fontSize: "12px", fontWeight: 600, padding: "3px 10px", borderRadius: "999px", backgroundColor: profile.availability === "open" ? "#D1FAE5" : "#F3F4F6", color: profile.availability === "open" ? "#065F46" : "#6B7280" }}>
                {profile.availability === "open" ? "🟢 Open to opportunities" : "⚫ Not available"}
              </span>
            )}
          </div>
        </div>

        {Object.keys(socialLinks).length > 0 && (
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "32px" }}>
            {socialLinks.linkedin && <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "6px", backgroundColor: "#EFF6FF", color: "#0A66C2", fontWeight: 600, fontSize: "13px", padding: "8px 14px", borderRadius: "999px", textDecoration: "none" }}>💼 LinkedIn</a>}
            {socialLinks.twitter && <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "6px", backgroundColor: "#F9FAFB", color: "#111827", fontWeight: 600, fontSize: "13px", padding: "8px 14px", borderRadius: "999px", textDecoration: "none" }}>🐦 Twitter/X</a>}
            {socialLinks.whatsapp && <a href={"https://wa.me/" + socialLinks.whatsapp} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "6px", backgroundColor: "#F0FDF4", color: "#16A34A", fontWeight: 600, fontSize: "13px", padding: "8px 14px", borderRadius: "999px", textDecoration: "none" }}>📱 WhatsApp</a>}
            {socialLinks.website && <a href={socialLinks.website} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "6px", backgroundColor: "#FFF8E7", color: "#D97706", fontWeight: 600, fontSize: "13px", padding: "8px 14px", borderRadius: "999px", textDecoration: "none" }}>🌍 Website</a>}
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 260px", gap: "24px", alignItems: "start", paddingBottom: "80px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

            {profile.bio && (
              <div style={{ backgroundColor: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: "16px", padding: "24px" }}>
                <h2 style={{ fontFamily: "Georgia, serif", fontSize: "18px", fontWeight: 700, color: "#111827", marginBottom: "12px" }}>About</h2>
                <p style={{ color: "#374151", fontSize: "15px", lineHeight: 1.8 }}>{profile.bio}</p>
              </div>
            )}

            {profile.skills && profile.skills.length > 0 && (
              <div style={{ backgroundColor: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: "16px", padding: "24px" }}>
                <h2 style={{ fontFamily: "Georgia, serif", fontSize: "18px", fontWeight: 700, color: "#111827", marginBottom: "16px" }}>Skills</h2>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {profile.skills.map((skill: string) => (
                    <span key={skill} style={{ fontSize: "13px", fontWeight: 600, padding: "6px 14px", borderRadius: "999px", backgroundColor: "#FFF8E7", color: "#D97706", border: "1px solid #F5A62330" }}>{skill}</span>
                  ))}
                </div>
              </div>
            )}

            {events && events.length > 0 && (
              <div style={{ backgroundColor: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: "16px", padding: "24px" }}>
                <h2 style={{ fontFamily: "Georgia, serif", fontSize: "18px", fontWeight: 700, color: "#111827", marginBottom: "16px" }}>Events Organised</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {events.map((event: any) => {
                    const catColor = categoryColors[event.category] ?? "#F5A623";
                    return (
                      <Link key={event.id} href={"/event/" + event.id} style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "12px", padding: "12px", backgroundColor: "#F9FAFB", borderRadius: "10px", border: "1px solid #F3F4F6" }}>
                        <span style={{ fontSize: "11px", fontWeight: 700, padding: "3px 8px", borderRadius: "999px", color: catColor, backgroundColor: catColor + "15", flexShrink: 0 }}>{event.category}</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ color: "#111827", fontWeight: 600, fontSize: "14px" }}>{event.title}</p>
                          <p style={{ color: "#9CA3AF", fontSize: "12px" }}>📅 {event.date} · 📍 {event.location}</p>
                        </div>
                        <span style={{ color: "#F5A623", fontSize: "12px", fontWeight: 700, flexShrink: 0 }}>View →</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px", position: "sticky", top: "88px" }}>
            <div style={{ backgroundColor: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: "16px", padding: "20px" }}>
              <h3 style={{ fontFamily: "Georgia, serif", fontSize: "16px", fontWeight: 700, color: "#111827", marginBottom: "12px" }}>Profile Completeness</h3>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                <div style={{ flex: 1, height: "8px", backgroundColor: "#F3F4F6", borderRadius: "999px", overflow: "hidden" }}>
                  <div style={{ width: completionScore + "%", height: "100%", backgroundColor: completionScore >= 80 ? "#10B981" : completionScore >= 50 ? "#F5A623" : "#F43F5E", borderRadius: "999px" }} />
                </div>
                <span style={{ fontFamily: "Georgia, serif", fontSize: "18px", fontWeight: 900, color: "#F5A623" }}>{completionScore}%</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {completionItems.filter((i) => !i.done).map((item) => (
                  <p key={item.label} style={{ color: "#9CA3AF", fontSize: "12px" }}>✗ Add {item.label}</p>
                ))}
              </div>
            </div>

            {profile.interests && profile.interests.length > 0 && (
              <div style={{ backgroundColor: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: "16px", padding: "20px" }}>
                <h3 style={{ fontFamily: "Georgia, serif", fontSize: "16px", fontWeight: 700, color: "#111827", marginBottom: "12px" }}>Interests</h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {profile.interests.map((interest: string) => (
                    <span key={interest} style={{ fontSize: "12px", fontWeight: 600, padding: "4px 10px", borderRadius: "999px", backgroundColor: "#F3F4F6", color: "#6B7280" }}>{interest}</span>
                  ))}
                </div>
              </div>
            )}

            <div style={{ backgroundColor: "#FFF8E7", border: "1px solid #F5A623", borderRadius: "16px", padding: "20px", textAlign: "center" }}>
              <p style={{ fontFamily: "Georgia, serif", fontSize: "15px", fontWeight: 700, color: "#111827", marginBottom: "8px" }}>Discover Events & Opportunities</p>
              <p style={{ color: "#6B7280", fontSize: "12px", marginBottom: "12px" }}>Find events near you on VENEW</p>
              <Link href="/events" style={{ display: "inline-block", backgroundColor: "#F5A623", color: "#FFFFFF", fontWeight: 700, fontSize: "13px", padding: "10px 20px", borderRadius: "10px", textDecoration: "none" }}>Browse VENEW →</Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}