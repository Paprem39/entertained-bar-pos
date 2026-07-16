import { createAuditLog } from "@/service/audit-log.service";
import { AuditAction } from "@prisma/client";

async function main() {
  const result = await createAuditLog({
    action: AuditAction.CREATE,

    entityType: "TEST",
    entityId: "test-id",
    targetName: "Audit Test",

    description: "Test create audit log",

    newValue: {
      test: true,
    },
  });

  console.log(result);
}

main()
  .catch(console.error)
  .finally(() => process.exit());