function requireEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export function getDatabaseUrl() {
  return requireEnv("DATABASE_URL");
}

export const TABLES = {
  chapters: "chapters",
  users: "users",
  userRoles: "user_roles",
  coaches: "coaches",
  events: "events",
  pages: "pages",
  templateVersions: "template_versions",
  siteSettings: "site_settings",
} as const;

