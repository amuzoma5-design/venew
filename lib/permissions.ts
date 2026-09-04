export type Role = "admin" | "editor" | "moderator" | "finance" | "user";

export type Permission =
  | "manage_discoveries"
  | "manage_blog"
  | "manage_spotlight"
  | "manage_users"
  | "manage_editors"
  | "manage_finance"
  | "view_analytics";

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  admin: [
    "manage_discoveries",
    "manage_blog",
    "manage_spotlight",
    "manage_users",
    "manage_editors",
    "manage_finance",
    "view_analytics",
  ],
  editor: ["manage_blog", "manage_spotlight"],
  moderator: ["manage_discoveries"],
  finance: ["manage_finance", "view_analytics"],
  user: [],
};

export function hasPermission(role: string | null | undefined, permission: Permission): boolean {
  if (!role) return false;
  const permissions = ROLE_PERMISSIONS[role as Role];
  return permissions ? permissions.includes(permission) : false;
}