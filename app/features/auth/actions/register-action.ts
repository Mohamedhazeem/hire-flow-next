"use server";

import { signUpSchema } from "@/app/features/auth/types/auth-schema";
import { validateWithZod } from "@/lib/validator";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { z } from "zod";
import { APIError } from "better-auth/api";

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

  let redirectTarget: "/dashboard" | null = null;

  try {
    const response = await auth.api.signUpEmail({
      body: validation.data,
      headers: await headers(),
    });

    if (response && response.token) {
      redirectTarget = "/dashboard";
    }
  } catch (error: unknown) {
    console.error("Signup detailed error:", error);
    if (error instanceof APIError) {
      if (
        error.body?.code === "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL" ||
        error.status === "UNPROCESSABLE_ENTITY"
      ) {
        return {
          success: false,
          errors: {
            email: ["This email is already registered. Please use a different email or log in."],
          },
        };
      }
    }

    return {
      success: false,
      errors: {
        form: ["Unable to create your account. Please try again later."],
      },
    };
  }

  if (redirectTarget) {
    redirect(redirectTarget);
  }

  return { success: false, errors: { form: ["An unexpected routing state occurred."] } };
}
