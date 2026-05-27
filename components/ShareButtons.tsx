"use client";

interface ShareButtonsProps {
  eventId: string;
  eventTitle: string;
}

export default function ShareButtons({ eventId, eventTitle }: ShareButtonsProps) {
  const url = `https://venew-two.vercel.app/event/${eventId}`;
  const text = `Check out this event: ${eventTitle} on VENEW!`;

  function copyLink() {
    navigator.clipboard.writeText(url);
    alert("Link copied!");
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {/* WhatsApp */}
      
        href={`https://wa.me/?text=${encodeURIComponent(text + " " + url)}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          width: "100%",
          backgroundColor: "#25D366",
          color: "white",
          fontWeight: 700,
          fontSize: "14px",
          padding: "14px",
          borderRadius: "12px",
          textDecoration: "none",
          boxSizing: "border-box",
        }}
      >
        📱 Share on WhatsApp
      </a>

      {/* Twitter/X */}
      
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          width: "100%",
          backgroundColor: "#000",
          color: "white",
          fontWeight: 700,
          fontSize: "14px",
          padding: "14px",
          borderRadius: "12px",
          textDecoration: "none",
          boxSizing: "border-box",
        }}
      >
        🐦 Share on X
      </a>

      {/* Copy link */}
      <button
        onClick={copyLink}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          width: "100%",
          backgroundColor: "transparent",
          color: "#6B6B6B",
          fontWeight: 600,
          fontSize: "14px",
          padding: "14px",
          borderRadius: "12px",
          border: "1px solid #2A2A2A",
          cursor: "pointer",
          boxSizing: "border-box",
        }}
      >
        🔗 Copy Link
      </button>
    </div>
  );
}