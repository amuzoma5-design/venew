"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav style={{
      backgroundColor: "#141414",
      borderBottom: "1px solid #2A2A2A",
      position: "sticky",
      top: 0,
      zIndex: 50,
    }}>
      <div style={{
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "0 24px",
        height: "64px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>

        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "2px" }}>
          <span style={{ color: "#F5A623", fontSize: "24px", fontWeight: 900, fontFamily: "Georgia, serif" }}>VE</span>
          <span style={{ color: "#E8E8E8", fontSize: "24px", fontWeight: 900, fontFamily: "Georgia, serif" }}>NEW</span>
          <span style={{
            color: "#6B6B6B",
            fontSize: "11px",
            fontWeight: 500,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            marginLeft: "10px",
            display: "none",
          }}
            className="nav-tagline"
          >
            Event Discovery
          </span>
        </Link>

        {/* Desktop links */}
        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          <Link href="/" style={{
            color: "#6B6B6B",
            fontSize: "14px",
            textDecoration: "none",
          }}>
            Browse
          </Link>
          <Link href="/submit" style={{
            backgroundColor: "#F5A623",
            color: "#0D0D0D",
            fontWeight: 700,
            fontSize: "14px",
            padding: "8px 18px",
            borderRadius: "999px",
            textDecoration: "none",
            whiteSpace: "nowrap",
          }}>
            Submit Event
          </Link>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          backgroundColor: "#141414",
          borderTop: "1px solid #2A2A2A",
          padding: "16px 24px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}>
          <Link href="/" onClick={() => setMenuOpen(false)} style={{
            color: "#E8E8E8",
            fontSize: "16px",
            textDecoration: "none",
          }}>
            Browse Events
          </Link>
          <Link href="/submit" onClick={() => setMenuOpen(false)} style={{
            color: "#F5A623",
            fontSize: "16px",
            textDecoration: "none",
            fontWeight: 700,
          }}>
            Submit Event
          </Link>
        </div>
      )}
    </nav>
  );
}