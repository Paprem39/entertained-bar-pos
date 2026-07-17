import { prisma } from "@/lib/prisma";


async function main() {

  console.log("\n=== AUDIT LOG CHECK ===\n");


  const logs =
    await prisma.auditLog.findMany({

      orderBy: {
        createdAt: "desc",
      },

      take: 50,

      include: {

        user: {

          select: {

            username: true,

            displayName: true,

          },

        },

      },

    });



  if (logs.length === 0) {

    console.log("No audit logs found");

    return;

  }



  for (const log of logs) {

    console.log({
      
      time:
        log.createdAt,

      user:
        log.user?.displayName ??
        log.user?.username ??
        "SYSTEM",

      action:
        log.action,

      entity:
        log.entityType,

      entityId:
        log.entityId,

      description:
        log.description,

    });

  }


  console.log(
    `\nTOTAL LOGS: ${logs.length}`
  );

}



main()
.catch(console.error)
.finally(
  () => prisma.$disconnect()
);