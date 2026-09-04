import { createClient } from "@supabase/supabase-js";
import { hasPermission, Permission } from "@/lib/permissions";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

export async function verifyAdminRequest(req: Request): Promise<{ ok: true; userId: string } | { ok: false; error: string; status: number }> {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");

  if (!token) {
    return { ok: false, error: "Not authenticated.", status: 401 };
  }

  const supabaseAsUser = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });

  const { data: { user }, error: userError } = await supabaseAsUser.auth.getUser();

  if (userError || !user) {
    return { ok: false, error: "Invalid session.", status: 401 };
  }

  const { data: profile, error: profileError } = await supabaseAdmin
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError || profile?.role !== "admin") {
    return { ok: false, error: "You do not have admin access.", status: 403 };
  }

  return { ok: true, userId: user.id };
}

export async function verifyPermission(req: Request, permission: Permission): Promise<{ ok: true; userId: string } | { ok: false; error: string; status: number }> {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");

  if (!token) return { ok: false, error: "Not authenticated.", status: 401 };

  const supabaseAsUser = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });

  const { data: { user }, error: userError } = await supabaseAsUser.auth.getUser();
  if (userError || !user) return { ok: false, error: "Invalid session.", status: 401 };

  const { data: profile, error: profileError } = await supabaseAdmin
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError || !hasPermission(profile?.role, permission)) {
    return { ok: false, error: "You do not have permission for this action.", status: 403 };
  }

  return { ok: true, userId: user.id };
}