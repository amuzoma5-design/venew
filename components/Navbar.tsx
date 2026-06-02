"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

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
    router.push("/");
  }

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
          }}>
            Event Discovery
          </span>
        </Link>

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
         <Link href="/events" style={{
  color: "#6B6B6B",
  fontSize: "14px",
  textDecoration: "none",
}}>
  Browse Events
</Link>

          {user ? (
            <>
              {/* User email */}
              <span style={{
                color: "#6B6B6B",
                fontSize: "13px",
                maxWidth: "160px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}>
                {user.email}
              </span>

              {/* My Account */}
              <Link href="/account" style={{
                color: "#6B6B6B",
                fontSize: "14px",
                textDecoration: "none",
              }}>
                My Account
              </Link>

              {/* Submit Event */}
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

              {/* Logout */}
              <button
                onClick={handleLogout}
                style={{
                  backgroundColor: "transparent",
                  border: "1px solid #2A2A2A",
                  color: "#6B6B6B",
                  fontSize: "13px",
                  padding: "7px 14px",
                  borderRadius: "999px",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" style={{
                color: "#6B6B6B",
                fontSize: "14px",
                textDecoration: "none",
              }}>
                Log in
              </Link>
              <Link href="/auth/signup" style={{
                backgroundColor: "#F5A623",
                color: "#0D0D0D",
                fontWeight: 700,
                fontSize: "14px",
                padding: "8px 18px",
                borderRadius: "999px",
                textDecoration: "none",
                whiteSpace: "nowrap",
              }}>
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}