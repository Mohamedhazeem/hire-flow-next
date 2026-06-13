import { checkRole } from "@/app/features/auth/utils/rbac";

export default async function UserLayout({ children }: { children: React.ReactNode }) {
  // This protects /user AND every sub-page like /user/profile, /user/settings, etc.
  await checkRole(["USER"]);

  return <>{children}</>;
}
