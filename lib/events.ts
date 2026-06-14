export type Category =
  | "Conference"
  | "Church"
  | "Seminar"
  | "Workshop"
  | "Business"
  | "Music & Entertainment"
  | "Technology"
  | "Real Estate"
  | "Education"
  | "Opportunities";

export interface Event {
  id: string;
  title: string;
  location: string;
  venue: string;
  category: Category;
  date: string;
  time: string;
  description: string;
  highlights: string[];
  speaker?: string;
  speakerTitle?: string;
  price: string;
  imageColor: string;
  tag?: string;
}

export const events: Event[] = [
  {
    id: "leadership-2026",
    title: "Leadership Conference 2026",
    location: "Lagos",
    venue: "Eko Convention Centre, Victoria Island",
    category: "Conference",
    date: "2026-06-12",
    time: "9:00 AM – 6:00 PM",
    description: "A full-day gathering of Africa's boldest leaders, entrepreneurs, and change-makers. Expect keynotes, panel discussions, and networking sessions designed to equip you for the next level.",
    highlights: ["12 keynote speakers", "5 breakout sessions", "Networking lunch", "Certificate of attendance"],
    speaker: "Dr. Adaeze Okonkwo",
    speakerTitle: "CEO, Pan-African Growth Fund",
    price: "₦15,000",
    imageColor: "from-amber-600 to-orange-800",
    tag: "FEATURED",
  },
  {
    id: "sunday-revival-service",
    title: "Great Awakening Revival",
    location: "Abuja",
    venue: "National Christian Centre, Central Area",
    category: "Church",
    date: "2026-06-07",
    time: "8:00 AM – 1:00 PM",
    description: "A powerful inter-denominational revival service drawing thousands for worship, prayer, and the Word. Open to all faiths seeking spiritual renewal and community.",
    highlights: ["Mass worship session", "Guest minister", "Live praise band", "Children's corner available"],
    speaker: "Pastor Emmanuel Dada",
    speakerTitle: "Senior Pastor, The Fountain Church",
    price: "FREE",
    imageColor: "from-purple-700 to-indigo-900",
    tag: "FREE",
  },
  {
    id: "tech-founders-seminar",
    title: "Tech Founders Seminar",
    location: "Lagos",
    venue: "Co-Creation Hub, Yaba",
    category: "Seminar",
    date: "2026-06-19",
    time: "10:00 AM – 3:00 PM",
    description: "Built for early-stage startup founders navigating product-market fit, fundraising, and growth. Learn from those who've already walked the path.",
    highlights: ["Funding landscape in 2026", "Investor Q&A panel", "1-on-1 mentor slots", "Pitch opportunity"],
    speaker: "Tunde Adefolu",
    speakerTitle: "Partner, Ventures Platform",
    price: "₦5,000",
    imageColor: "from-cyan-600 to-blue-900",
    tag: "NEW",
  },
  {
    id: "brand-design-workshop",
    title: "Brand Identity Workshop",
    location: "Lagos",
    venue: "Creative District, Lekki Phase 1",
    category: "Workshop",
    date: "2026-06-25",
    time: "11:00 AM – 4:00 PM",
    description: "A hands-on full-day workshop for designers, entrepreneurs, and marketing teams. Walk away with a fully designed brand system.",
    highlights: ["Figma-based exercises", "Live design critique", "Brand kit template", "Small class (max 20)"],
    speaker: "Chiamaka Eze",
    speakerTitle: "Brand Director, Studiohaus",
    price: "₦20,000",
    imageColor: "from-rose-600 to-pink-900",
  },
  {
    id: "faith-and-finance",
    title: "Faith & Finance Summit",
    location: "Port Harcourt",
    venue: "Treasure Base Hotel, GRA Phase 2",
    category: "Church",
    date: "2026-07-04",
    time: "9:00 AM – 5:00 PM",
    description: "Bridging spiritual values and financial intelligence. Explore stewardship, wealth creation, and kingdom economics with leading voices in faith and business.",
    highlights: ["Biblical wealth principles", "Investment panels", "Breakout sessions", "Resource materials"],
    speaker: "Bishop Olumide Afe",
    speakerTitle: "Presiding Bishop, Covenant Heights",
    price: "₦8,000",
    imageColor: "from-emerald-600 to-teal-900",
  },
  {
    id: "ai-product-workshop",
    title: "Build with AI — Product Workshop",
    location: "Lagos",
    venue: "Andela Office, Ikoyi",
    category: "Workshop",
    date: "2026-07-10",
    time: "9:00 AM – 2:00 PM",
    description: "Roll up your sleeves and build a working AI-powered product in one morning. No deep ML knowledge required — just a laptop and curiosity.",
    highlights: ["Intro to LLM APIs", "Live coding session", "Deploy on Vercel", "Peer demos"],
    speaker: "Seun Martins",
    speakerTitle: "AI Engineer, Anthropic Alumni",
    price: "₦12,000",
    imageColor: "from-violet-600 to-purple-900",
    tag: "HOT",
  },
];

export function getEventById(id: string): Event | undefined {
  return events.find((e) => e.id === id);
}

export const categories: Category[] = [
  "Conference",
  "Church",
  "Seminar",
  "Workshop",
  "Business",
  "Music & Entertainment",
  "Technology",
  "Real Estate",
  "Education",
  "Opportunities",
];

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-NG", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}