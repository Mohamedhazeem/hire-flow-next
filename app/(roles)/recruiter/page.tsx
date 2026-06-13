import { checkRole } from "@/app/features/auth/utils/rbac";

export const metadata = {
  title: "Recruiter Dashboard",
  description: "Your recruiter dashboard",
};

export default async function RecruiterPage() {
  await checkRole(["RECRUITER"]);
  return <>RECRUITER DASHBOARD</>;
}
