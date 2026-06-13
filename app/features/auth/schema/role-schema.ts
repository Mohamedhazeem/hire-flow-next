// generate role scheme for checkrole
import { z } from "zod";

export const RoleSchema = z.enum(["ADMIN", "RECRUITER", "USER"]);

export type Role = z.infer<typeof RoleSchema>;
