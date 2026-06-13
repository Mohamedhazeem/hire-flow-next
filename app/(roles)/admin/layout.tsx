import { checkRole } from "@/app/features/auth/utils/rbac";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // This protects /admin AND every sub-page like /admin/profile, /admin/settings, etc.
  await checkRole(["ADMIN"]);

  return <>{children}</>;
}
