import { checkRole } from "@/app/features/auth/utils/rbac";

export const metadata = {
  title: "Company Dashboard",
  description: "Your company dashboard",
};

export default async function CompanyPage() {
  await checkRole(["RECRUITER"]);
  return <>COMPANY DASHBOARD</>;
}
