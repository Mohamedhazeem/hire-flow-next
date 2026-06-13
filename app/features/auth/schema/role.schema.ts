// generate role scheme for checkrole
import { z } from "zod";

export const Roles = {
  ADMIN: "ADMIN",
  RECRUITER: "RECRUITER",
  USER: "USER",
} as const;

export const RoleSchema = z.enum([Roles.ADMIN, Roles.RECRUITER, Roles.USER]);

export type RoleType = z.infer<typeof RoleSchema>;
