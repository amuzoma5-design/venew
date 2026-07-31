"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { categories } from "@/lib/events";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

const DISCOVERY_TYPES = [
  { value: "event", label: "🎤 Event" },
  { value: "scholarship", label: "🎓 Scholarship" },
  { value: "grant", label: "💰 Grant & Funding" },
  { value: "fellowship", label: "🌍 Fellowship" },
  { value: "internship", label: "🏢 Internship" },
  { value: "job", label: "💼 Job" },
  { value: "competition", label: "🏆 Competition" },
  { value: "community", label: "🤝 Community" },
  { value: "learning", label: "📚 Learning Resource" },
  { value: "accelerator", label: "🚀 Accelerator Programme" },
  { value: "business", label: "📈 Business Opportunity" },
  { value: "health", label: "💊 Health & Wellness" },
];

export default function SubmitDiscoveryPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    type: "event",
    category: "",
    date: "",
    time: "",
    location: "",
    venue: "",
    price: "",
    description: "",
    speaker: "",
    speakerTitle: "",
    registrationUrl: "",
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
      .replace(/(^-|-$)/g, "") + "-" + Date.now();

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
        type: form.type,
        category: form.category,
        date: form.date,
        time: form.time,
        location: form.location,
        venue: form.venue,
        price: form.price || "FREE",
        description: form.description,
        speaker: form.speaker,
        speaker_title: form.speakerTitle,
        registration_url: form.registrationUrl,
        highlights: [],
        image_color: "from-amber-600 to-orange-800",
        image_url: imageUrl,
        tag: null,
        user_id: (await supabase.auth.getSession()).data.session?.user.id,
      },
    ]);

    setLoading(false);

    if (sbError) {
      setError("Something went wrong: " + sbError.message);
    } else {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        await fetch("/api/notify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: form.title,
            category: form.category,
            location: form.location,
            date: form.date,
            submitterEmail: session?.user.email,
          }),
        });
      } catch (e) {
        console.error("Notification failed:", e);
      }
      setSubmitted(true);
    }
  }

  const inputStyle = {
    width: "100%",
    backgroundColor: "#111",
    border: "1px solid #2A2A2A",
    borderRadius: "10px",
    padding: "12px 16px",
    color: "#E8E8E8",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box" as const,
  };

  if (checking) {
    return (
      <main style={{ backgroundColor: "#0D0D0D", minHeight: "100vh" }}>
        <Navbar />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh" }}>
          <p style={{ color: "#6B6B6B", fontSize: "16px" }}>Checking login...</p>
        </div>
      </main>
    );
  }

  if (submitted) {
    return (
      <main style={{ backgroundColor: "#0D0D0D", minHeight: "100vh" }}>
        <Navbar />
        <div style={{ maxWidth: "560px", margin: "0 auto", padding: "80px 24px", textAlign: "center" }}>
          <p style={{ fontSize: "64px", marginBottom: "24px" }}>🎉</p>
          <h1 style={{ fontFamily: "Georgia, serif", fontSize: "36px", fontWeight: 900, color: "#E8E8E8", marginBottom: "16px" }}>
            Discovery Submitted!
          </h1>
          <p style={{ color: "#6B6B6B", fontSize: "16px", lineHeight: 1.7, marginBottom: "40px" }}>
            <strong style={{ color: "#F5A623" }}>{form.title}</strong> has been
            submitted and is pending review. We will publish it shortly!
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/events" style={{ display: "inline-block", backgroundColor: "#F5A623", color: "#0D0D0D", fontWeight: 700, fontSize: "14px", padding: "14px 32px", borderRadius: "12px", textDecoration: "none" }}>
              Explore Discoveries
            </Link>
            <Link href="/submit" style={{ display: "inline-block", backgroundColor: "transparent", color: "#6B6B6B", fontWeight: 700, fontSize: "14px", padding: "14px 32px", borderRadius: "12px", textDecoration: "none", border: "1px solid #2A2A2A" }}>
              Submit Another
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main style={{ backgroundColor: "#0D0D0D", minHeight: "100vh" }}>
      <Navbar />

      <div style={{ maxWidth: "680px", margin: "0 auto", padding: "40px 24px 80px" }}>

        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "#6B6B6B", fontSize: "14px", textDecoration: "none", marginBottom: "32px" }}>
          ← Back to home
        </Link>

        <div style={{ marginBottom: "40px" }}>
          <p style={{ color: "#F5A623", fontSize: "11px", fontWeight: 600, letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: "12px" }}>
            Share a Discovery
          </p>
          <h1 style={{ fontFamily: "Georgia, serif", fontSize: "40px", fontWeight: 900, color: "#E8E8E8", lineHeight: 1.1 }}>
            Submit a Discovery
          </h1>
          <p style={{ color: "#6B6B6B", fontSize: "15px", marginTop: "12px", lineHeight: 1.6 }}>
            Share an opportunity, event, scholarship, grant, fellowship, internship,
            job, competition, or community with people across Africa.
          </p>
        </div>

        {error && (
          <div style={{ backgroundColor: "#2A0A0A", border: "1px solid #F43F5E", borderRadius: "10px", padding: "14px 16px", color: "#F43F5E", fontSize: "14px", marginBottom: "24px" }}>
            {error}
          </div>
        )}

        <div style={{ backgroundColor: "#1A1A1A", border: "1px solid #2A2A2A", borderRadius: "20px", padding: "36px", display: "flex", flexDirection: "column", gap: "24px" }}>

          {/* Discovery Type */}
          <div>
            <label style={{ display: "block", color: "#E8E8E8", fontSize: "13px", fontWeight: 600, marginBottom: "8px" }}>
              Discovery Type *
            </label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {DISCOVERY_TYPES.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setForm({ ...form, type: value })}
                  style={{
                    backgroundColor: form.type === value ? "#F5A623" : "#111",
                    color: form.type === value ? "#0D0D0D" : "#6B6B6B",
                    fontWeight: form.type === value ? 700 : 500,
                    fontSize: "13px",
                    padding: "8px 14px",
                    borderRadius: "999px",
                    border: form.type === value ? "none" : "1px solid #2A2A2A",
                    cursor: "pointer",
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Image upload */}
          <div>
            <label style={{ display: "block", color: "#E8E8E8", fontSize: "13px", fontWeight: 600, marginBottom: "8px" }}>
              Discovery Image
            </label>
            {imagePreview && (
              <div style={{ marginBottom: "12px" }}>
                <img src={imagePreview} alt="Preview" style={{ width: "100%", height: "180px", objectFit: "cover", borderRadius: "10px", border: "1px solid #2A2A2A" }} />
              </div>
            )}
            <label style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", backgroundColor: "#111", border: "1px dashed #2A2A2A", borderRadius: "10px", padding: "20px", cursor: "pointer", color: "#6B6B6B", fontSize: "14px" }}>
              📷 {image ? image.name : "Click to upload image"}
              <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} />
            </label>
          </div>

          {/* Title */}
          <div>
            <label style={{ display: "block", color: "#E8E8E8", fontSize: "13px", fontWeight: 600, marginBottom: "8px" }}>
              Discovery Title *
            </label>
            <input
              type="text"
              name="title"
              placeholder="e.g. Tony Elumelu Foundation Entrepreneurship Programme 2026"
              value={form.title}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          {/* Location */}
          <div>
            <label style={{ display: "block", color: "#E8E8E8", fontSize: "13px", fontWeight: 600, marginBottom: "8px" }}>
              Location / City *
            </label>
            <input
              type="text"
              name="location"
              placeholder="e.g. Lagos, Nigeria or Online"
              value={form.location}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          {/* Venue */}
          <div>
            <label style={{ display: "block", color: "#E8E8E8", fontSize: "13px", fontWeight: 600, marginBottom: "8px" }}>
              Venue or Organisation
            </label>
            <input
              type="text"
              name="venue"
              placeholder="e.g. Tony Elumelu Foundation or Eko Hotel"
              value={form.venue}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          {/* Date */}
          <div>
            <label style={{ display: "block", color: "#E8E8E8", fontSize: "13px", fontWeight: 600, marginBottom: "8px" }}>
              Date / Deadline *
            </label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          {/* Time */}
          <div>
            <label style={{ display: "block", color: "#E8E8E8", fontSize: "13px", fontWeight: 600, marginBottom: "8px" }}>
              Time (if applicable)
            </label>
            <input
              type="text"
              name="time"
              placeholder="e.g. 9:00 AM – 5:00 PM"
              value={form.time}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          {/* Price */}
          <div>
            <label style={{ display: "block", color: "#E8E8E8", fontSize: "13px", fontWeight: 600, marginBottom: "8px" }}>
              Price or Value
            </label>
            <input
              type="text"
              name="price"
              placeholder="e.g. FREE, ₦5,000 or $5,000 grant"
              value={form.price}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          {/* Speaker */}
          <div>
            <label style={{ display: "block", color: "#E8E8E8", fontSize: "13px", fontWeight: 600, marginBottom: "8px" }}>
              Speaker / Host / Organiser Name
            </label>
            <input
              type="text"
              name="speaker"
              placeholder="e.g. Dr. Amaka Obi or Tony Elumelu Foundation"
              value={form.speaker}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          {/* Speaker Title */}
          <div>
            <label style={{ display: "block", color: "#E8E8E8", fontSize: "13px", fontWeight: 600, marginBottom: "8px" }}>
              Speaker / Host Title or Role
            </label>
            <input
              type="text"
              name="speakerTitle"
              placeholder="e.g. CEO, TechNaija or Programme Director"
              value={form.speakerTitle}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          {/* Registration URL */}
          <div>
            <label style={{ display: "block", color: "#E8E8E8", fontSize: "13px", fontWeight: 600, marginBottom: "8px" }}>
              Apply / Register Link
            </label>
            <input
              type="text"
              name="registrationUrl"
              placeholder="e.g. https://tefconnect.com or https://forms.gle/yourform"
              value={form.registrationUrl}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          {/* Category */}
          <div>
            <label style={{ display: "block", color: "#E8E8E8", fontSize: "13px", fontWeight: 600, marginBottom: "8px" }}>
              Category *
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              style={{ ...inputStyle, color: form.category ? "#E8E8E8" : "#6B6B6B" }}
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label style={{ display: "block", color: "#E8E8E8", fontSize: "13px", fontWeight: 600, marginBottom: "8px" }}>
              Description
            </label>
            <textarea
              name="description"
              placeholder="Tell people what this discovery is about, who it is for, and why they should care..."
              value={form.description}
              onChange={handleChange}
              rows={6}
              style={{ ...inputStyle, resize: "vertical" }}
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
            {loading ? "Submitting..." : "Submit Discovery →"}
          </button>

          <p style={{ color: "#6B6B6B", fontSize: "12px", textAlign: "center" }}>
            Fields marked * are required. Your discovery will be reviewed before going live.
          </p>
        </div>
      </div>
    </main>
  );
}