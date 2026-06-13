// generate role scheme for checkrole
import { z } from "zod";

export const RoleSchema = z.enum(["ADMIN", "RECRUITER", "JOB_SEEKER"]);

export type Role = z.infer<typeof RoleSchema>;
