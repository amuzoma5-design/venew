"use client";

import { useEffect, useState } from "react";

const PLACEHOLDER_EXAMPLES = [
  "Scholarships for young Africans",
  "Events happening near me",
  "Opportunities for students",
  "Leadership programmes",
  "Tech communities",
  "Something exciting in Lagos",
];

const SUGGESTION_CHIPS = [
  "Scholarships",
  "Events near me",
  "Opportunities",
  "Communities",
  "Internships",
];

interface DiscoverySearchProps {
  value: string;
  onChange: (value: string) => void;
}

export default function DiscoverySearch({ value, onChange }: DiscoverySearchProps) {
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((i) => (i + 1) % PLACEHOLDER_EXAMPLES.length);
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ maxWidth: "600px" }}>
      <div style={{ position: "relative" }}>
        <span style={{
          position: "absolute",
          left: "18px",
          top: "50%",
          transform: "translateY(-50%)",
          fontSize: "18px",
          pointerEvents: "none",
        }}>
          🔍
        </span>
        <input
          type="text"
          placeholder={`What do you want to discover? e.g. ${PLACEHOLDER_EXAMPLES[placeholderIndex]}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: "100%",
            backgroundColor: "#FFFFFF",
            border: "1.5px solid #E5E7EB",
            borderRadius: "999px",
            padding: "18px 20px 18px 52px",
            color: "#111827",
            fontSize: "16px",
            outline: "none",
            boxSizing: "border-box",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            transition: "border-color 0.2s, box-shadow 0.2s",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "#F5A623";
            e.target.style.boxShadow = "0 0 0 3px rgba(245,166,35,0.12)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "#E5E7EB";
            e.target.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)";
          }}
        />
        {value && (
          <button
            onClick={() => onChange("")}
            style={{
              position: "absolute",
              right: "16px",
              top: "50%",
              transform: "translateY(-50%)",
              backgroundColor: "#F3F4F6",
              border: "none",
              borderRadius: "50%",
              width: "24px",
              height: "24px",
              color: "#6B7280",
              cursor: "pointer",
              fontSize: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ✕
          </button>
        )}
      </div>

      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "8px",
        marginTop: "16px",
        alignItems: "center",
      }}>
        <span style={{ color: "#9CA3AF", fontSize: "13px", marginRight: "4px" }}>
          Try discovering
        </span>
        {SUGGESTION_CHIPS.map((chip) => (
          <button
            key={chip}
            onClick={() => onChange(chip)}
            style={{
              backgroundColor: "#FFFFFF",
              color: "#6B7280",
              border: "1.5px solid #E5E7EB",
              borderRadius: "999px",
              padding: "6px 14px",
              fontSize: "13px",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            {chip}
          </button>
        ))}
      </div>
    </div>
  );
}