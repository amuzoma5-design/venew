import { createClient } from "@supabase/supabase-js";

// Paste your actual values here
const supabaseUrl = "https://kyqdhrblrfmjodweqkic.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt5cWRocmJscmZtam9kd2Vxa2ljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk1NTY0MjIsImV4cCI6MjA5NTEzMjQyMn0.mjQdcJhu1hTnik6E6I5JPBr02ZpTAKn149hX6ISfbAk

const supabase = createClient(supabaseUrl, supabaseKey);

const events = [
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
    speaker_title: "CEO, Pan-African Growth Fund",
    price: "₦15,000",
    image_color: "from-amber-600 to-orange-800",
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
    speaker_title: "Senior Pastor, The Fountain Church",
    price: "FREE",
    image_color: "from-purple-700 to-indigo-900",
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
    speaker_title: "Partner, Ventures Platform",
    price: "₦5,000",
    image_color: "from-cyan-600 to-blue-900",
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
    speaker_title: "Brand Director, Studiohaus",
    price: "₦20,000",
    image_color: "from-rose-600 to-pink-900",
    tag: null,
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
    speaker_title: "Presiding Bishop, Covenant Heights",
    price: "₦8,000",
    image_color: "from-emerald-600 to-teal-900",
    tag: null,
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
    speaker_title: "AI Engineer, Anthropic Alumni",
    price: "₦12,000",
    image_color: "from-violet-600 to-purple-900",
    tag: "HOT",
  },
];

async function seed() {
  const { error } = await supabase.from("events").upsert(events);
  if (error) {
    console.error("Seed failed:", error.message);
  } else {
    console.log("✅ Database seeded successfully!");
  }
}

seed();