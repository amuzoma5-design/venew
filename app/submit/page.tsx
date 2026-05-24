"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { categories } from "@/lib/events";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function SubmitEventPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    category: "",
    date: "",
    time: "",
    location: "",
    venue: "",
    price: "",
    description: "",
    speaker: "",
    speakerTitle: "",
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push("/auth/login");
      } else {
        setChecking(false);
      }
    });
  }, [router]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  }

  async function handleSubmit() {
    if (!form.title || !form.category || !form.date || !form.location) {
      setError("Please fill in Title, Category, Date and Location.");
      return;
    }

    setLoading(true);
    setError("");

    const id = form.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // Upload image if provided
    let imageUrl = null;
    if (image) {
      const fileExt = image.name.split(".").pop();
      const fileName = `${id}-${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from("event-images")
        .upload(fileName, image);

      if (uploadError) {
        setError("Image upload failed: " + uploadError.message);
        setLoading(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from("event-images")
        .getPublicUrl(fileName);

      imageUrl = urlData.publicUrl;
    }

    const { error: sbError } = await supabase.from("events").insert([
      {
        id,
        title: form.title,
        category: form.category,
        date: form.date,
        time: form.time,
        location: form.location,
        venue: form.venue,
        price: form.price || "FREE",
        description: form.description,
        speaker: form.speaker,
        speaker_title: form.speakerTitle,
        highlights: [],
        image_color: "from-amber-600 to-orange-800",
        image_url: imageUrl,
        tag: null,
      },
    ]);

    setLoading(false);

    if (sbError) {
      setError("Something went wrong: " + sbError.message);
    } else {
      setSubmitted(true);
    }
  }

  if (checking) {
    return (
      <main style={{ backgroundColor: "#0D0D0D", minHeight: "100vh" }}>
        <Navbar />
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "60vh",
        }}>
          <p style={{ color: "#6B6B6B", fontSize: "16px" }}>Checking login...</p>
        </div>
      </main>
    );
  }

  if (submitted) {
    return (
      <main style={{ backgroundColor: "#0D0D0D", minHeight: "100vh" }}>
        <Navbar />
        <div style={{
          maxWidth: "560px",
          margin: "0 auto",
          padding: "80px 24px",
          textAlign: "center",
        }}>
          <p style={{ fontSize: "64px", marginBottom: "24px" }}>🎉</p>
          <h1 style={{
            fontFamily: "Georgia, serif",
            fontSize: "36px",
            fontWeight: 900,
            color: "#E8E8E8",
            marginBottom: "16px",
          }}>
            Event Submitted!
          </h1>
          <p style={{
            color: "#6B6B6B",
            fontSize: "16px",
            lineHeight: 1.7,
            marginBottom: "40px",
          }}>
            <strong style={{ color: "#F5A623" }}>{form.title}</strong> has been
            added to VENEW and is now live!
          </p>
          <Link href="/" style={{
            display: "inline-block",
            backgroundColor: "#F5A623",
            color: "#0D0D0D",
            fontWeight: 700,
            fontSize: "14px",
            padding: "14px 32px",
            borderRadius: "12px",
            textDecoration: "none",
          }}>
            View All Events
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main style={{ backgroundColor: "#0D0D0D", minHeight: "100vh" }}>
      <Navbar />

      <div style={{ maxWidth: "680px", margin: "0 auto", padding: "40px 24px 80px" }}>

        <Link href="/" style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          color: "#6B6B6B",
          fontSize: "14px",
          textDecoration: "none",
          marginBottom: "32px",
        }}>
          ← Back to all events
        </Link>

        <div style={{ marginBottom: "40px" }}>
          <p style={{
            color: "#F5A623",
            fontSize: "11px",
            fontWeight: 600,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            marginBottom: "12px",
          }}>
            Share with the Community
          </p>
          <h1 style={{
            fontFamily: "Georgia, serif",
            fontSize: "40px",
            fontWeight: 900,
            color: "#E8E8E8",
            lineHeight: 1.1,
          }}>
            Submit an Event
          </h1>
        </div>

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

        <div style={{
          backgroundColor: "#1A1A1A",
          border: "1px solid #2A2A2A",
          borderRadius: "20px",
          padding: "36px",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
        }}>

          {/* Image upload */}
          <div>
            <label style={{
              display: "block",
              color: "#E8E8E8",
              fontSize: "13px",
              fontWeight: 600,
              marginBottom: "8px",
            }}>
              Event Image
            </label>

            {imagePreview && (
              <div style={{ marginBottom: "12px" }}>
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{
                    width: "100%",
                    height: "180px",
                    objectFit: "cover",
                    borderRadius: "10px",
                    border: "1px solid #2A2A2A",
                  }}
                />
              </div>
            )}

            <label style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              backgroundColor: "#111",
              border: "1px dashed #2A2A2A",
              borderRadius: "10px",
              padding: "20px",
              cursor: "pointer",
              color: "#6B6B6B",
              fontSize: "14px",
            }}>
              📷 {image ? image.name : "Click to upload image"}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
            </label>
          </div>

          {/* Text fields */}
          {[
            { label: "Event Title *", name: "title", type: "text", placeholder: "e.g. Leadership Summit 2026" },
            { label: "Location / City *", name: "location", type: "text", placeholder: "e.g. Lagos" },
            { label: "Venue", name: "venue", type: "text", placeholder: "e.g. Eko Hotel, Victoria Island" },
            { label: "Date *", name: "date", type: "date", placeholder: "" },
            { label: "Time", name: "time", type: "text", placeholder: "e.g. 9:00 AM – 5:00 PM" },
            { label: "Price", name: "price", type: "text", placeholder: "e.g. ₦5,000 or FREE" },
            { label: "Speaker Name", name: "speaker", type: "text", placeholder: "e.g. Dr. Amaka Obi" },
            { label: "Speaker Title", name: "speakerTitle", type: "text", placeholder: "e.g. CEO, TechNaija" },
          ].map(({ label, name, type, placeholder }) => (
            <div key={name}>
              <label style={{
                display: "block",
                color: "#E8E8E8",
                fontSize: "13px",
                fontWeight: 600,
                marginBottom: "8px",
              }}>
                {label}
              </label>
              <input
                type={type}
                name={name}
                placeholder={placeholder}
                value={form[name as keyof typeof form]}
                onChange={handleChange}
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
          ))}

          {/* Category */}
          <div>
            <label style={{
              display: "block",
              color: "#E8E8E8",
              fontSize: "13px",
              fontWeight: 600,
              marginBottom: "8px",
            }}>
              Category *
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              style={{
                width: "100%",
                backgroundColor: "#111",
                border: "1px solid #2A2A2A",
                borderRadius: "10px",
                padding: "12px 16px",
                color: form.category ? "#E8E8E8" : "#6B6B6B",
                fontSize: "14px",
                outline: "none",
                boxSizing: "border-box",
              }}
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label style={{
              display: "block",
              color: "#E8E8E8",
              fontSize: "13px",
              fontWeight: 600,
              marginBottom: "8px",
            }}>
              Description
            </label>
            <textarea
              name="description"
              placeholder="Tell people what this event is about..."
              value={form.description}
              onChange={handleChange}
              rows={5}
              style={{
                width: "100%",
                backgroundColor: "#111",
                border: "1px solid #2A2A2A",
                borderRadius: "10px",
                padding: "12px 16px",
                color: "#E8E8E8",
                fontSize: "14px",
                outline: "none",
                resize: "vertical",
                boxSizing: "border-box",
              }}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: "100%",
              backgroundColor: loading ? "#6B6B6B" : "#F5A623",
              color: "#0D0D0D",
              fontWeight: 700,
              fontSize: "15px",
              padding: "16px",
              borderRadius: "12px",
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              marginTop: "8px",
            }}
          >
            {loading ? "Submitting..." : "Submit Event →"}
          </button>

          <p style={{ color: "#6B6B6B", fontSize: "12px", textAlign: "center" }}>
            Fields marked * are required. Event goes live immediately.
          </p>
        </div>
      </div>
    </main>
  );
}