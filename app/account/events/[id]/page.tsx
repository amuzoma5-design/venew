"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { categories } from "@/lib/events";

export default function EditEventPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
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
    registrationUrl: "",
    imageUrl: "",
  });

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push("/auth/login"); return; }

      const { data: event, error } = await supabase
        .from("events")
        .select("*")
        .eq("id", params.id)
        .eq("user_id", session.user.id)
        .single();

      if (error || !event) {
        router.push("/account");
        return;
      }

      setForm({
        title: event.title || "",
        category: event.category || "",
        date: event.date || "",
        time: event.time || "",
        location: event.location || "",
        venue: event.venue || "",
        price: event.price || "",
        description: event.description || "",
        speaker: event.speaker || "",
        speakerTitle: event.speaker_title || "",
        registrationUrl: event.registration_url || "",
        imageUrl: event.image_url || "",
      });

      if (event.image_url) setImagePreview(event.image_url);
      setLoading(false);
    }
    load();
  }, [params.id, router]);

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

  async function handleSave() {
    if (!form.title || !form.category || !form.date || !form.location) {
      setError("Please fill in Title, Category, Date and Location.");
      return;
    }

    setSaving(true);
    setError("");

    let imageUrl = form.imageUrl;

    if (image) {
      const fileExt = image.name.split(".").pop();
      const fileName = `${params.id}-${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from("event-images")
        .upload(fileName, image);

      if (uploadError) {
        setError("Image upload failed: " + uploadError.message);
        setSaving(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from("event-images")
        .getPublicUrl(fileName);

      imageUrl = urlData.publicUrl;
    }

    const { error: sbError } = await supabase
      .from("events")
      .update({
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
        registration_url: form.registrationUrl,
        image_url: imageUrl,
      })
      .eq("id", params.id);

    setSaving(false);

    if (sbError) {
      setError("Something went wrong: " + sbError.message);
    } else {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
  }

  if (loading) {
    return (
      <main style={{ backgroundColor: "#0D0D0D", minHeight: "100vh" }}>
        <Navbar />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh" }}>
          <p style={{ color: "#6B6B6B" }}>Loading event...</p>
        </div>
      </main>
    );
  }

  return (
    <main style={{ backgroundColor: "#0D0D0D", minHeight: "100vh" }}>
      <Navbar />

      <div style={{ maxWidth: "680px", margin: "0 auto", padding: "40px 24px 80px" }}>

        <Link href="/account" style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          color: "#6B6B6B",
          fontSize: "14px",
          textDecoration: "none",
          marginBottom: "32px",
        }}>
          ← Back to Profile
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
            Edit Event
          </p>
          <h1 style={{
            fontFamily: "Georgia, serif",
            fontSize: "36px",
            fontWeight: 900,
            color: "#E8E8E8",
            lineHeight: 1.1,
          }}>
            {form.title || "Edit Event"}
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

        {success && (
          <div style={{
            backgroundColor: "#0A2A1A",
            border: "1px solid #10B981",
            borderRadius: "10px",
            padding: "14px 16px",
            color: "#10B981",
            fontSize: "14px",
            marginBottom: "24px",
          }}>
            ✅ Event updated successfully!
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
              📷 {image ? image.name : "Click to change image"}
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
            { label: "Registration Link", name: "registrationUrl", type: "text", placeholder: "e.g. https://forms.gle/yourform" },
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
            onClick={handleSave}
            disabled={saving}
            style={{
              width: "100%",
              backgroundColor: saving ? "#6B6B6B" : "#F5A623",
              color: "#0D0D0D",
              fontWeight: 700,
              fontSize: "15px",
              padding: "16px",
              borderRadius: "12px",
              border: "none",
              cursor: saving ? "not-allowed" : "pointer",
              marginTop: "8px",
            }}
          >
            {saving ? "Saving..." : "Save Changes →"}
          </button>

          <Link
            href={`/event/${params.id}`}
            target="_blank"
            style={{
              display: "block",
              textAlign: "center",
              color: "#6B6B6B",
              fontSize: "13px",
              textDecoration: "none",
            }}
          >
            View event page →
          </Link>
        </div>
      </div>
    </main>
  );
}