import { AuthRedirectTargetType, User, UserCredentials } from "../schema/auth.type";
import { Roles } from "../schema/role.schema";

export function getRedirectPath(response: User): AuthRedirectTargetType {
  let redirectTarget: AuthRedirectTargetType = "/";
  switch (response.role) {
    case Roles.ADMIN:
      redirectTarget = "/admin";
      break;
    case Roles.RECRUITER:
      redirectTarget = "/recruiter";
      break;
    default:
      redirectTarget = "/user";
  }
  return redirectTarget;
}
