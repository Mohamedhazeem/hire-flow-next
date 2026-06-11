"use server";

import { signInSchema } from "@/app/features/auth/types/auth-schema";
import { validateWithZod } from "@/lib/validator";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { z } from "zod";

type LoginInput = z.infer<typeof signInSchema>;
type ActionResult =
  | { success: true }
  | { success: false; errors: Record<string, string[] | undefined> };

export async function loginAction(data: unknown): Promise<ActionResult> {
  const validation = validateWithZod<LoginInput>(signInSchema, data);

  if (!validation.success) {
    return {
      success: false,
      errors: validation.error.fieldErrors,
    };
  }

  try {
    const response = await auth.api.signInEmail({
      body: {
        email: validation.data.email,
        password: validation.data.password,
      },
      headers: await headers(),
    });

    if (!response.token) {
      return {
        success: false,
        errors: {
          email: ["Invalid email or password."],
        },
      };
    }

    redirect("/dashboard");
  } catch {
    return {
      success: false,
      errors: {
        form: ["Unable to sign in. Please try again later."],
      },
    };
  }
}
