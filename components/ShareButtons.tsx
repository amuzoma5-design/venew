"use client";

export default function ShareButtons({ eventId, eventTitle }: { eventId: string; eventTitle: string }) {
  const url = "https://venew.ng/event/" + eventId;
  const text = "Check out: " + eventTitle + " on VENEW! ";
  function copyLink() {
    navigator.clipboard.writeText(url);
    alert("Link copied!");
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <a href={"https://wa.me/?text=" + encodeURIComponent(text + url)} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", backgroundColor: "#25D366", color: "white", fontWeight: 700, fontSize: "14px", padding: "14px", borderRadius: "12px", textDecoration: "none", boxSizing: "border-box" }}>
        Share on WhatsApp
      </a>
      <a href={"https://twitter.com/intent/tweet?text=" + encodeURIComponent(text) + "&url=" + encodeURIComponent(url)} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", backgroundColor: "#000", color: "white", fontWeight: 700, fontSize: "14px", padding: "14px", borderRadius: "12px", textDecoration: "none", boxSizing: "border-box" }}>
        Share on X
      </a>
      <button onClick={copyLink} style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", backgroundColor: "transparent", color: "#6B6B6B", fontWeight: 600, fontSize: "14px", padding: "14px", borderRadius: "12px", border: "1px solid #2A2A2A", cursor: "pointer", boxSizing: "border-box" }}>
        Copy Link
      </button>
    </div>
  );
}