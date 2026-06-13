import { checkRole } from "@/app/features/auth/utils/rbac";

export const metadata = {
  title: "Admin Dashboard",
  description: "Your personal admin dashboard",
};

export default async function AdminPage() {
  const user = await checkRole(["ADMIN"]);

  return <>ADMIN DASHBOARD {user?.name}</>;
}
