import { NextResponse } from "next/server";
import { supabaseAdmin, verifyPermission } from "@/lib/verifyAdmin";

export async function POST(req: Request) {
  const check = await verifyPermission(req, "manage_discoveries");
  if (!check.ok) return NextResponse.json({ error: check.error }, { status: check.status });

  const discovery = await req.json();

  if (!discovery.title || !discovery.category) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  const id = discovery.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") + "-" + Date.now();

  const { error } = await supabaseAdmin.from("events").insert([{
    id,
    title: discovery.title,
    type: discovery.type,
    category: discovery.category,
    date: discovery.date,
    location: discovery.location,
    venue: discovery.organisation,
    price: discovery.price,
    description: discovery.description,
    registration_url: discovery.sourceUrl,
    highlights: [],
    image_color: "from-amber-600 to-orange-800",
    tag: null,
    approved: false,
    status: "upcoming",
    source: "ai_agent",
  }]);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}