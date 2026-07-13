"use client";

interface BlogShareButtonsProps {
  shareUrl: string;
  shareText: string;
}

export default function BlogShareButtons({ shareUrl, shareText }: BlogShareButtonsProps) {
  return (
    <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
      <a href={"https://wa.me/?text=" + encodeURIComponent(shareText)} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "8px", backgroundColor: "#25D366", color: "#FFFFFF", fontWeight: 700, fontSize: "14px", padding: "12px 20px", borderRadius: "12px", textDecoration: "none" }}>
        📱 Share on WhatsApp
      </a>
      <a href={"https://twitter.com/intent/tweet?text=" + encodeURIComponent(shareText)} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "8px", backgroundColor: "#000000", color: "#FFFFFF", fontWeight: 700, fontSize: "14px", padding: "12px 20px", borderRadius: "12px", textDecoration: "none" }}>
        🐦 Share on X
      </a>
      <a href={"https://www.linkedin.com/sharing/share-offsite/?url=" + encodeURIComponent(shareUrl)} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "8px", backgroundColor: "#0A66C2", color: "#FFFFFF", fontWeight: 700, fontSize: "14px", padding: "12px 20px", borderRadius: "12px", textDecoration: "none" }}>
        💼 Share on LinkedIn
      </a>
      <button onClick={() => { navigator.clipboard.writeText(shareUrl); alert("Link copied!"); }} style={{ display: "inline-flex", alignItems: "center", gap: "8px", backgroundColor: "#F3F4F6", color: "#374151", fontWeight: 700, fontSize: "14px", padding: "12px 20px", borderRadius: "12px", border: "none", cursor: "pointer" }}>
        🔗 Copy Link
      </button>
    </div>
  );
}