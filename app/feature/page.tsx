import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function FeaturePage() {
  return (
    <main style={{ backgroundColor: "#0D0D0D", minHeight: "100vh" }}>
      <Navbar />

      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "80px 24px", textAlign: "center" }}>
        <p style={{ fontSize: "48px", marginBottom: "16px" }}>⭐</p>
        <h1 style={{
          fontFamily: "Georgia, serif",
          fontSize: "32px",
          fontWeight: 900,
          color: "#E8E8E8",
          marginBottom: "16px",
        }}>
          Feature Your Event
        </h1>
        <p style={{ color: "#6B6B6B", fontSize: "15px", lineHeight: 1.8, marginBottom: "32px" }}>
          Want your event placed at the top of VENEW with a Featured badge?
          Reach out to us on WhatsApp and we will get your event featured.
        </p>
        <Link
          href="https://wa.me/2349044209650?text=Hi%2C%20I%20want%20to%20feature%20my%20event%20on%20VENEW"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-block",
            backgroundColor: "#F5A623",
            color: "#0D0D0D",
            fontWeight: 700,
            fontSize: "15px",
            padding: "14px 32px",
            borderRadius: "12px",
            textDecoration: "none",
          }}
        >
          Chat With Us on WhatsApp
        </Link>
        <div style={{ marginTop: "32px" }}>
          <Link href="/dashboard" style={{ color: "#6B6B6B", fontSize: "13px", textDecoration: "none" }}>
            Back to Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}