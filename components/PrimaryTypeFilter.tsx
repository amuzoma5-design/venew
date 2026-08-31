"use client";

import { PRIMARY_GROUPS, PrimaryGroup } from "@/lib/discoveryTypes";

interface PrimaryTypeFilterProps {
  active: PrimaryGroup;
  onChange: (group: PrimaryGroup) => void;
}

export default function PrimaryTypeFilter({ active, onChange }: PrimaryTypeFilterProps) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
      {PRIMARY_GROUPS.map(({ value, icon }) => (
        <button
          key={value}
          onClick={() => onChange(value)}
          style={{
            backgroundColor: active === value ? "#111827" : "#FFFFFF",
            color: active === value ? "#FFFFFF" : "#374151",
            border: active === value ? "1.5px solid #111827" : "1.5px solid #E5E7EB",
            borderRadius: "999px",
            padding: "8px 16px",
            fontSize: "13px",
            fontWeight: active === value ? 700 : 500,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <span>{icon}</span>
          {value}
        </button>
      ))}
    </div>
  );
}