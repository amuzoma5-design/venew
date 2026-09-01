export type DiscoveryType =
  | "event" | "scholarship" | "grant" | "fellowship" | "internship" | "job"
  | "competition" | "community" | "learning" | "accelerator" | "business" | "health";

export const DISCOVERY_TYPES: { value: DiscoveryType; label: string }[] = [
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

export type PrimaryGroup = "All" | "Events" | "Opportunities" | "Communities" | "Experiences";

export const TYPE_TO_GROUP: Record<DiscoveryType, PrimaryGroup> = {
  event: "Events",
  scholarship: "Opportunities",
  grant: "Opportunities",
  fellowship: "Opportunities",
  internship: "Opportunities",
  job: "Opportunities",
  competition: "Opportunities",
  accelerator: "Opportunities",
  business: "Opportunities",
  community: "Communities",
  learning: "Experiences",
  health: "Experiences",
};

export const PRIMARY_GROUPS: { value: PrimaryGroup; icon: string }[] = [
  { value: "All", icon: "✨" },
  { value: "Events", icon: "🎤" },
  { value: "Opportunities", icon: "🚀" },
  { value: "Communities", icon: "🤝" },
  { value: "Experiences", icon: "🌟" },
];

export function getGroupForType(type: string | null | undefined): PrimaryGroup {
  if (!type) return "Events"; // matches submit form's default
  return TYPE_TO_GROUP[type as DiscoveryType] ?? "Events";
}
export interface DiscoveryFieldConfig {
  dateLabel: string;
  showTime: boolean;
  speakerLabel: string;
  speakerTitleLabel: string;
}

export function getFieldConfig(type: string | null | undefined): DiscoveryFieldConfig {
  if (!type || type === "event") {
    return {
      dateLabel: "Date",
      showTime: true,
      speakerLabel: "Speaker / Host Name",
      speakerTitleLabel: "Speaker / Host Title or Role",
    };
  }
  return {
    dateLabel: "Deadline",
    showTime: false,
    speakerLabel: "Organiser / Provider Name",
    speakerTitleLabel: "Contact Person (optional)",
  };
}