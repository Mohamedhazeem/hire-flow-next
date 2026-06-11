"use server";

import { signUpSchema } from "@/app/features/auth/types/auth-schema";
import { validateWithZod } from "@/lib/validator";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { z } from "zod";

type RegisterInput = z.infer<typeof signUpSchema>;
type ActionResult =
  | { success: true }
  | { success: false; errors: Record<string, string[] | undefined> };

export async function registerAction(data: unknown): Promise<ActionResult> {
  const validation = validateWithZod<RegisterInput>(signUpSchema, data);

  if (!validation.success) {
    return {
      success: false,
      errors: validation.error.fieldErrors,
    };
  }

  try {
    const response = await auth.api.signUpEmail({
      body: {
        name: validation.data.name,
        email: validation.data.email,
        password: validation.data.password,
      },
      headers: await headers(),
    });

    if (!response.token) {
      return {
        success: false,
        errors: {
          email: ["This email is already registered or signup failed."],
        },
      };
    }

    redirect("/dashboard");
  } catch {
    return {
      success: false,
      errors: {
        form: ["Unable to create your account. Please try again later."],
      },
    };
  }
}
