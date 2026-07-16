import { roleGuard } from "@/utils/auth/role-guard";
import { UserRole } from "@prisma/client";

function main() {
  const result = roleGuard({
    userRole: UserRole.ADMIN,
    allowedRoles: [
      UserRole.ADMIN,
      UserRole.CASHIER,
    ],
  });

  console.log("ROLE GUARD RESULT:", result);
}

main();