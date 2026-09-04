import { NextResponse } from "next/server";
import { supabaseAdmin, verifyAdminRequest } from "@/lib/verifyAdmin";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const check = await verifyAdminRequest(req);
  if (!check.ok) return NextResponse.json({ error: check.error }, { status: check.status });

  const { id } = await params;
  const { newPassword } = await req.json();

  if (!newPassword || newPassword.length < 8) {
    return NextResponse.json({ error: "New password must be at least 8 characters." }, { status: 400 });
  }

  const { error } = await supabaseAdmin.auth.admin.updateUserById(id, { password: newPassword });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const check = await verifyAdminRequest(req);
  if (!check.ok) return NextResponse.json({ error: check.error }, { status: check.status });

  const { id } = await params;

  const { error } = await supabaseAdmin
    .from("profiles")
    .update({ role: "user" })
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}