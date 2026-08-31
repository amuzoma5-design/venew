"use client";

import DiscoverySearch from "@/components/DiscoverySearch";
import PrimaryTypeFilter from "@/components/PrimaryTypeFilter";
import CategoryFilter from "@/components/CategoryFilter";
import { Category } from "@/lib/events";
import { PrimaryGroup } from "@/lib/discoveryTypes";

interface DiscoveryFilterPanelProps {
  open: boolean;
  onClose: () => void;
  search: string;
  onSearchChange: (v: string) => void;
  activeGroup: PrimaryGroup;
  onGroupChange: (g: PrimaryGroup) => void;
  activeCategory: Category | "All";
  onCategoryChange: (c: Category | "All") => void;
  resultCount: number;
}

export default function DiscoveryFilterPanel({
  open, onClose, search, onSearchChange,
  activeGroup, onGroupChange, activeCategory, onCategoryChange, resultCount,
}: DiscoveryFilterPanelProps) {
  if (!open) return null;

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      backgroundColor: "rgba(13,13,13,0.94)",
      zIndex: 50,
      display: "flex",
      flexDirection: "column",
      overflowY: "auto",
      padding: "24px 20px 40px",
    }}>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "16px" }}>
        <button
          onClick={onClose}
          style={{
            backgroundColor: "#1A1A1A",
            border: "1px solid #2A2A2A",
            borderRadius: "50%",
            width: "36px",
            height: "36px",
            color: "#E8E8E8",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          ✕
        </button>
      </div>

      <div style={{ maxWidth: "600px", width: "100%", margin: "0 auto" }}>
        <h3 style={{ fontFamily: "Georgia, serif", fontSize: "24px", fontWeight: 700, color: "#E8E8E8", marginBottom: "20px" }}>
          What do you want to discover?
        </h3>

        <DiscoverySearch value={search} onChange={onSearchChange} />

        <div style={{ marginTop: "28px" }}>
          <p style={{ color: "#6B6B6B", fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "10px" }}>
            Type
          </p>
          <PrimaryTypeFilter active={activeGroup} onChange={onGroupChange} />
        </div>

        <div style={{ marginTop: "24px" }}>
          <p style={{ color: "#6B6B6B", fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "10px" }}>
            Category
          </p>
          <CategoryFilter active={activeCategory} onChange={onCategoryChange} />
        </div>

        <button
          onClick={onClose}
          style={{
            width: "100%",
            marginTop: "32px",
            backgroundColor: "#F5A623",
            color: "#0D0D0D",
            fontWeight: 700,
            fontSize: "15px",
            padding: "16px",
            borderRadius: "12px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Show {resultCount} discover{resultCount !== 1 ? "ies" : "y"}
        </button>
      </div>
    </div>
  );
}