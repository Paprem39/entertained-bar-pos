import { prisma } from "@/lib/prisma";
import { closeBusinessSession as closeSession } from "@/service/close-session.service";

interface OpenBusinessSessionInput {
  openedByUserId: string;
}

interface CloseBusinessSessionInput {
  businessSessionId: string;
  closedByUserId: string;
}

export async function openBusinessSession(
  input: OpenBusinessSessionInput,
) {
  return await prisma.$transaction(async (tx) => {
    const openedSession =
      await tx.businessSession.findFirst({
        where: {
          status: "OPEN",
        },
      });

    if (openedSession) {
      throw new Error(
        "Business session is already open",
      );
    }

    const now = new Date();

    const session =
      await tx.businessSession.create({
        data: {
          businessDate: now,
          openedAt: now,
          status: "OPEN",
          openedByUserId:
            input.openedByUserId,
        },
      });

    await tx.auditLog.create({
      data: {
        userId:
          input.openedByUserId,

        action: "CREATE",

        entityType:
          "BusinessSession",

        entityId:
          session.id,

        targetName:
          session.businessDate
            .toISOString()
            .slice(0, 10),

        description:
          "Open business session",
      },
    });

    return session;
  });
}

export async function closeBusinessSession(
  input: CloseBusinessSessionInput,
) {
  return closeSession(input);
}