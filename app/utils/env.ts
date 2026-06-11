import { z } from "zod";

export const envSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.url(),
  NEXT_PUBLIC_ENABLE_TEMP_CHECK: z.string().default("false"),

  BETTER_AUTH_URL: z.url(),

  BETTER_AUTH_SECRET: z.string(),
  DATABASE_URL: z.string(),
});

export type EnvTypes = z.infer<typeof envSchema>;

export const env = envSchema.safeParse(process.env);
