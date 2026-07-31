"use client";

import { categories, Category } from "@/lib/events";

const categoryIcons: Record<Category, string> = {
  Conference: "🎤",
  Church: "⛪",
  Seminar: "📚",
  Workshop: "🛠️",
  Business: "💼",
  "Music & Entertainment": "🎵",
  Technology: "💻",
  "Real Estate": "🏠",
  Education: "🎓",
  Opportunities: "🚀",
  "Health & Wellness": "💊",
};

interface CategoryFilterProps {
  active: Category | "All";
  onChange: (cat: Category | "All") => void;
}

export default function CategoryFilter({ active, onChange }: CategoryFilterProps) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
      <button
        onClick={() => onChange("All")}
        style={{
          backgroundColor: active === "All" ? "#F5A623" : "#FFFFFF",
          color: active === "All" ? "#FFFFFF" : "#6B7280",
          border: active === "All" ? "1.5px solid #F5A623" : "1.5px solid #E5E7EB",
          borderRadius: "999px",
          padding: "8px 16px",
          fontSize: "13px",
          fontWeight: active === "All" ? 700 : 500,
          cursor: "pointer",
          transition: "all 0.2s",
        }}
      >
        All
      </button>

      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          style={{
            backgroundColor: active === cat ? "#F5A623" : "#FFFFFF",
            color: active === cat ? "#FFFFFF" : "#6B7280",
            border: active === cat ? "1.5px solid #F5A623" : "1.5px solid #E5E7EB",
            borderRadius: "999px",
            padding: "8px 16px",
            fontSize: "13px",
            fontWeight: active === cat ? 700 : 500,
            cursor: "pointer",
            transition: "all 0.2s",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <span>{categoryIcons[cat]}</span>
          {cat}
        </button>
      ))}
    </div>
  );
}