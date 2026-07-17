import { BusinessSessionStatus, Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

import { validateCloseSession } from "@/utils/business-session/validate-close-session";
import { calculateClosingSummary } from "@/utils/business-session/calculate-closing-summary";
import { createClosingSnapshot } from "@/utils/business-session/create-closing-snapshot";

type CloseBusinessSessionInput = {
  businessSessionId: string;
  closedByUserId: string;
};

export async function closeBusinessSession(
  input: CloseBusinessSessionInput,
) {
  return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    await validateCloseSession(
      tx,
      input.businessSessionId,
      input.closedByUserId,
    );

    const summary = await calculateClosingSummary(
      tx,
      input.businessSessionId, 
    );

    const snapshot = await createClosingSnapshot(
      tx,
      input.businessSessionId,
      summary,
    );

    const session = await tx.businessSession.update({
      where: {
        id: input.businessSessionId,
      },
      data: {
        status: BusinessSessionStatus.CLOSED,
        closedAt: new Date(),
        closedByUserId: input.closedByUserId,
      },
    });

    await tx.auditLog.create({
      data: {
        userId: input.closedByUserId,
    
        action: "CLOSE_SESSION",
    
        entityType: "BusinessSession",
    
        entityId: session.id,
    
        targetName:
          session.businessDate
            .toISOString()
            .slice(0, 10),
    
        description:
          "Close business session",
      },
    });

    return {
      session,
      snapshot,
      summary,
    };
  });
}