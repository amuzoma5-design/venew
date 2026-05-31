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
};

interface CategoryFilterProps {
  active: Category | "All";
  onChange: (cat: Category | "All") => void;
}

export default function CategoryFilter({ active, onChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onChange("All")}
        className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200"
        style={{
          backgroundColor: active === "All" ? "#F5A623" : "#1A1A1A",
          color: active === "All" ? "#0D0D0D" : "#6B6B6B",
          border: active === "All" ? "1px solid #F5A623" : "1px solid #2A2A2A",
        }}
      >
        All Events
      </button>

      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-1.5"
          style={{
            backgroundColor: active === cat ? "#F5A623" : "#1A1A1A",
            color: active === cat ? "#0D0D0D" : "#6B6B6B",
            border: active === cat ? "1px solid #F5A623" : "1px solid #2A2A2A",
          }}
        >
          <span>{categoryIcons[cat]}</span>
          {cat}
        </button>
      ))}
    </div>
  );
}