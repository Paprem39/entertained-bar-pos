import { UserRole } from "@prisma/client";

interface RoleGuardInput {
  userRole: UserRole;
  allowedRoles: UserRole[];
}

export function roleGuard({
  userRole,
  allowedRoles,
}: RoleGuardInput) {
  if (!allowedRoles.includes(userRole)) {
    throw new Error(
      `Permission denied. Role ${userRole} is not allowed.`
    );
  }

  return true;
}