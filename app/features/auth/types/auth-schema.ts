import { env } from "@/app/utils/env";
import { z } from "zod";
import disposableDomains from "disposable-email-domains";

const disposableSet = new Set(disposableDomains);

const ENABLE_TEMP_MAIL_CHECK = env.data?.NEXT_PUBLIC_ENABLE_TEMP_CHECK !== "false";

// 1. Declare the base schema first at the top of the file
export const signInSchema = z.object({
  email: z.email("Invalid email address").refine((email) => {
    if (!ENABLE_TEMP_MAIL_CHECK) return true;
    const domain = email.split("@")[1]?.toLowerCase();
    return !disposableSet.has(domain);
  }),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

// 2. Extend the base schema cleanly to create the registration schema
export const signUpSchema = signInSchema.extend({
  name: z.string().min(4, "Name must be at least 4 characters long"),
});
