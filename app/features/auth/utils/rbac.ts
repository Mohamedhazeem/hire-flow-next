import { auth } from "@/app/features/auth/libs/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Role, RoleSchema } from "../schema/role-schema";

export async function checkRole(allowedRoles: Role[]) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user) {
    redirect("/login");
  }

  const userRole = RoleSchema.safeParse((session.user as { role: string }).role);

  if (!userRole.success || !allowedRoles.includes(userRole.data)) {
    redirect("/unauthorized");
  }

  return session.user;
}
