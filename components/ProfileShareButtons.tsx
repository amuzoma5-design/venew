"use client";

interface ProfileShareButtonsProps {
  profileUrl: string;
  name: string;
}

export default function ProfileShareButtons({ profileUrl, name }: ProfileShareButtonsProps) {
  return (
    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
      <a href={"https://wa.me/?text=Check out " + name + " on VENEW 👉 " + profileUrl} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "6px", backgroundColor: "#25D366", color: "#FFFFFF", fontWeight: 700, fontSize: "13px", padding: "10px 16px", borderRadius: "999px", textDecoration: "none" }}>
        📱 Share
      </a>
      <button onClick={() => { navigator.clipboard.writeText(profileUrl); alert("Profile link copied!"); }} style={{ display: "inline-flex", alignItems: "center", gap: "6px", backgroundColor: "#F3F4F6", color: "#374151", fontWeight: 700, fontSize: "13px", padding: "10px 16px", borderRadius: "999px", border: "none", cursor: "pointer" }}>
        🔗 Copy Link
      </button>
    </div>
  );
}