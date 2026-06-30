"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    setMenuOpen(false);
    router.push("/");
  }

  return (
    <nav style={{ backgroundColor: "#FFFFFF", borderBottom: "1px solid #E5E7EB", position: "sticky", top: 0, zIndex: 50, boxShadow: "0 1px 12px rgba(0,0,0,0.06)" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 16px", height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>

        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "2px", flexShrink: 0 }}>
          <span style={{ color: "#F5A623", fontSize: "22px", fontWeight: 900, fontFamily: "Georgia, serif" }}>VE</span>
          <span style={{ color: "#111827", fontSize: "22px", fontWeight: 900, fontFamily: "Georgia, serif" }}>NEW</span>
          <span className="venew-nav-tagline" style={{ color: "#9CA3AF", fontSize: "10px", fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase", marginLeft: "8px" }}>
            Events & Opportunities
          </span>
        </Link>

        {/* Desktop nav */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }} className="venew-desktop-nav">
          <Link href="/events" style={{ color: "#6B7280", fontSize: "14px", textDecoration: "none" }}>Browse</Link>
          {user ? (
            <>
              <Link href="/dashboard" style={{ color: "#6B7280", fontSize: "14px", textDecoration: "none" }}>Dashboard</Link>
              <Link href="/account" style={{ color: "#6B7280", fontSize: "14px", textDecoration: "none" }}>Account</Link>
              <Link href="/submit" style={{ backgroundColor: "#F5A623", color: "#FFFFFF", fontWeight: 700, fontSize: "14px", padding: "8px 18px", borderRadius: "999px", textDecoration: "none", whiteSpace: "nowrap" }}>Submit Event</Link>
              <button onClick={handleLogout} style={{ backgroundColor: "transparent", border: "1px solid #E5E7EB", color: "#6B7280", fontSize: "13px", padding: "7px 14px", borderRadius: "999px", cursor: "pointer" }}>Log out</button>
            </>
          ) : (
            <>
              <Link href="/auth/login" style={{ color: "#6B7280", fontSize: "14px", textDecoration: "none" }}>Log in</Link>
              <Link href="/auth/signup" style={{ backgroundColor: "#F5A623", color: "#FFFFFF", fontWeight: 700, fontSize: "14px", padding: "8px 18px", borderRadius: "999px", textDecoration: "none" }}>Sign up</Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="venew-mobile-menu-btn"
          style={{ backgroundColor: "transparent", border: "none", cursor: "pointer", padding: "8px", display: "none", flexDirection: "column", gap: "5px" }}
        >
          <span style={{ display: "block", width: "22px", height: "2px", backgroundColor: menuOpen ? "#F5A623" : "#111827", transition: "all 0.2s", transform: menuOpen ? "rotate(45deg) translate(5px, 5px)" : "none" }} />
          <span style={{ display: "block", width: "22px", height: "2px", backgroundColor: menuOpen ? "#F5A623" : "#111827", transition: "all 0.2s", opacity: menuOpen ? 0 : 1 }} />
          <span style={{ display: "block", width: "22px", height: "2px", backgroundColor: menuOpen ? "#F5A623" : "#111827", transition: "all 0.2s", transform: menuOpen ? "rotate(-45deg) translate(5px, -5px)" : "none" }} />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{ backgroundColor: "#FFFFFF", borderTop: "1px solid #E5E7EB", padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }} className="venew-mobile-menu">
          <Link href="/events" onClick={() => setMenuOpen(false)} style={{ color: "#374151", fontSize: "15px", textDecoration: "none", padding: "10px 0", borderBottom: "1px solid #F3F4F6" }}>Browse Events</Link>
          {user ? (
            <>
              <Link href="/dashboard" onClick={() => setMenuOpen(false)} style={{ color: "#374151", fontSize: "15px", textDecoration: "none", padding: "10px 0", borderBottom: "1px solid #F3F4F6" }}>Dashboard</Link>
              <Link href="/account" onClick={() => setMenuOpen(false)} style={{ color: "#374151", fontSize: "15px", textDecoration: "none", padding: "10px 0", borderBottom: "1px solid #F3F4F6" }}>My Account</Link>
              <Link href="/submit" onClick={() => setMenuOpen(false)} style={{ color: "#374151", fontSize: "15px", textDecoration: "none", padding: "10px 0", borderBottom: "1px solid #F3F4F6" }}>Submit Event</Link>
              <button onClick={handleLogout} style={{ backgroundColor: "transparent", border: "none", color: "#F43F5E", fontSize: "15px", padding: "10px 0", textAlign: "left", cursor: "pointer" }}>Log out</button>
            </>
          ) : (
            <>
              <Link href="/auth/login" onClick={() => setMenuOpen(false)} style={{ color: "#374151", fontSize: "15px", textDecoration: "none", padding: "10px 0", borderBottom: "1px solid #F3F4F6" }}>Log in</Link>
              <Link href="/auth/signup" onClick={() => setMenuOpen(false)} style={{ display: "block", backgroundColor: "#F5A623", color: "#FFFFFF", fontWeight: 700, fontSize: "15px", padding: "12px 16px", borderRadius: "12px", textDecoration: "none", textAlign: "center" }}>Sign up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
