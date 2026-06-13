import { checkRole } from "@/app/features/auth/utils/rbac";

export default async function RecruiterLayout({ children }: { children: React.ReactNode }) {
  // This protects /recruiter AND every sub-page like /recruiter/profile, /recruiter/settings, etc.
  await checkRole(["RECRUITER"]);

  return <>{children}</>;
}
