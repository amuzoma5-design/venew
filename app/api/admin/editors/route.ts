import { NextResponse } from "next/server";
import { supabaseAdmin, verifyAdminRequest } from "@/lib/verifyAdmin";

const ASSIGNABLE_ROLES = ["editor", "moderator", "finance"];

export async function GET(req: Request) {
  const check = await verifyAdminRequest(req);
  if (!check.ok) return NextResponse.json({ error: check.error }, { status: check.status });

  const { data, error } = await supabaseAdmin
    .from("profiles")
    .select("id, display_name, username, role, created_at")
    .in("role", ASSIGNABLE_ROLES)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ editors: data });
}

export async function POST(req: Request) {
  const check = await verifyAdminRequest(req);
  if (!check.ok) return NextResponse.json({ error: check.error }, { status: check.status });

  const { email, password, displayName, role } = await req.json();

  if (!email || !password || password.length < 8) {
    return NextResponse.json({ error: "Email and a password of at least 8 characters are required." }, { status: 400 });
  }

  if (!ASSIGNABLE_ROLES.includes(role)) {
    return NextResponse.json({ error: "Invalid role selected." }, { status: 400 });
  }

  const { data: created, error: createError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (createError || !created.user) {
    return NextResponse.json({ error: createError?.message || "Could not create account." }, { status: 500 });
  }

  const { error: profileError } = await supabaseAdmin
    .from("profiles")
    .update({ role, display_name: displayName || email })
    .eq("id", created.user.id);

  if (profileError) {
    return NextResponse.json({ error: "Account created, but role assignment failed: " + profileError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, userId: created.user.id });
}