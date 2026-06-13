import { checkRole } from "@/app/features/auth/utils/rbac";

export default async function CompanyLayout({ children }: { children: React.ReactNode }) {
  // This protects /company AND every sub-page like /company/profile, /company/settings, etc.
  await checkRole(["RECRUITER"]);

  return <>{children}</>;
}
