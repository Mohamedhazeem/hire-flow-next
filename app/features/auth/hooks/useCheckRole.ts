"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/app/features/auth/libs/auth-client";
import { Role, RoleSchema } from "../schema/role-schema";

export function useCheckRole(allowedRoles: Role[]) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (isPending) return;

    if (!session || !session.user) {
      router.push("/login");
      return;
    }

    // 3. Check roles safely
    const userRole = RoleSchema.safeParse((session.user as { role?: string }).role);

    if (!userRole.success || !allowedRoles.includes(userRole.data)) {
      router.push("/unauthorized");
    }
  }, [session, isPending, allowedRoles, router]);

  return { session: session?.user, isLoading: isPending };
}
