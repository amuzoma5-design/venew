"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin() {
    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);
    setError("");

    const { error: sbError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (sbError) {
      setError(sbError.message);
    } else {
      router.push("/");
    }
  }

  return (
    <main style={{ backgroundColor: "#0D0D0D", minHeight: "100vh" }}>

      {/* Logo */}
      <div style={{ padding: "24px", textAlign: "center" }}>
        <Link href="/" style={{ textDecoration: "none" }}>
          <span style={{ color: "#F5A623", fontSize: "28px", fontWeight: 900, fontFamily: "Georgia, serif" }}>VE</span>
          <span style={{ color: "#E8E8E8", fontSize: "28px", fontWeight: 900, fontFamily: "Georgia, serif" }}>NEW</span>
        </Link>
      </div>

      <div style={{
        maxWidth: "440px",
        margin: "40px auto",
        padding: "0 24px",
      }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h1 style={{
            fontFamily: "Georgia, serif",
            fontSize: "36px",
            fontWeight: 900,
            color: "#E8E8E8",
            marginBottom: "8px",
          }}>
            Welcome back
          </h1>
          <p style={{ color: "#6B6B6B", fontSize: "15px" }}>
            Log in to your VENEW account
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            backgroundColor: "#2A0A0A",
            border: "1px solid #F43F5E",
            borderRadius: "10px",
            padding: "14px 16px",
            color: "#F43F5E",
            fontSize: "14px",
            marginBottom: "24px",
          }}>
            {error}
          </div>
        )}

        {/* Form */}
        <div style={{
          backgroundColor: "#1A1A1A",
          border: "1px solid #2A2A2A",
          borderRadius: "20px",
          padding: "36px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}>

          {/* Email */}
          <div>
            <label style={{
              display: "block",
              color: "#E8E8E8",
              fontSize: "13px",
              fontWeight: 600,
              marginBottom: "8px",
            }}>
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "100%",
                backgroundColor: "#111",
                border: "1px solid #2A2A2A",
                borderRadius: "10px",
                padding: "12px 16px",
                color: "#E8E8E8",
                fontSize: "14px",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Password */}
          <div>
            <label style={{
              display: "block",
              color: "#E8E8E8",
              fontSize: "13px",
              fontWeight: 600,
              marginBottom: "8px",
            }}>
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              style={{
                width: "100%",
                backgroundColor: "#111",
                border: "1px solid #2A2A2A",
                borderRadius: "10px",
                padding: "12px 16px",
                color: "#E8E8E8",
                fontSize: "14px",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Button */}
          <button
            onClick={handleLogin}
            disabled={loading}
            style={{
              width: "100%",
              backgroundColor: loading ? "#6B6B6B" : "#F5A623",
              color: "#0D0D0D",
              fontWeight: 700,
              fontSize: "15px",
              padding: "14px",
              borderRadius: "12px",
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              marginTop: "8px",
            }}
          >
            {loading ? "Logging in..." : "Log In →"}
          </button>

          <p style={{ color: "#6B6B6B", fontSize: "13px", textAlign: "center" }}>
            Don&apos;t have an account?{" "}
            <Link href="/auth/signup" style={{ color: "#F5A623", textDecoration: "none", fontWeight: 600 }}>
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}