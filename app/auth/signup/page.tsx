"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSignup() {
    if (!email || !password || !confirm) {
      setError("Please fill in all fields.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    setError("");

    const { error: sbError } = await supabase.auth.signUp({
      email,
      password,
    });

    setLoading(false);

    if (sbError) {
      setError(sbError.message);
    } else {
      setSuccess(true);
    }
  }

  if (success) {
    return (
      <main style={{ backgroundColor: "#0D0D0D", minHeight: "100vh" }}>
        <div style={{ padding: "24px", textAlign: "center" }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <span style={{ color: "#F5A623", fontSize: "28px", fontWeight: 900, fontFamily: "Georgia, serif" }}>VE</span>
            <span style={{ color: "#E8E8E8", fontSize: "28px", fontWeight: 900, fontFamily: "Georgia, serif" }}>NEW</span>
          </Link>
        </div>
        <div style={{
          maxWidth: "440px",
          margin: "60px auto",
          padding: "0 24px",
          textAlign: "center",
        }}>
          <p style={{ fontSize: "64px", marginBottom: "24px" }}>📧</p>
          <h1 style={{
            fontFamily: "Georgia, serif",
            fontSize: "32px",
            fontWeight: 900,
            color: "#E8E8E8",
            marginBottom: "16px",
          }}>
            Check your email!
          </h1>
          <p style={{ color: "#6B6B6B", fontSize: "15px", lineHeight: 1.7, marginBottom: "32px" }}>
            We sent a confirmation link to{" "}
            <strong style={{ color: "#F5A623" }}>{email}</strong>.
            Click it to activate your account.
          </p>
          <Link href="/auth/login" style={{
            display: "inline-block",
            backgroundColor: "#F5A623",
            color: "#0D0D0D",
            fontWeight: 700,
            fontSize: "14px",
            padding: "14px 32px",
            borderRadius: "12px",
            textDecoration: "none",
          }}>
            Go to Login
          </Link>
        </div>
      </main>
    );
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
            Create account
          </h1>
          <p style={{ color: "#6B6B6B", fontSize: "15px" }}>
            Join VENEW and start discovering events
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

          {/* Confirm Password */}
          <div>
            <label style={{
              display: "block",
              color: "#E8E8E8",
              fontSize: "13px",
              fontWeight: 600,
              marginBottom: "8px",
            }}>
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSignup()}
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
            onClick={handleSignup}
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
            {loading ? "Creating account..." : "Create Account →"}
          </button>

          <p style={{ color: "#6B6B6B", fontSize: "13px", textAlign: "center" }}>
            Already have an account?{" "}
            <Link href="/auth/login" style={{ color: "#F5A623", textDecoration: "none", fontWeight: 600 }}>
              Log in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}