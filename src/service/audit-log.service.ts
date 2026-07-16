import { prisma } from "@/lib/prisma";
import { AuditAction, Prisma } from "@prisma/client";

interface CreateAuditLogInput {
  userId?: string;
  action: AuditAction;

  entityType: string;
  entityId: string;
  targetName: string;

  description: string;

  oldValue?: Prisma.InputJsonValue;
  newValue?: Prisma.InputJsonValue;

  ipAddress?: string;
  deviceInfo?: string;
  sessionId?: string;
}

export async function createAuditLog(
  data: CreateAuditLogInput
) {
  return prisma.auditLog.create({
    data: {
      userId: data.userId,

      action: data.action,

      entityType: data.entityType,
      entityId: data.entityId,
      targetName: data.targetName,

      description: data.description,

      oldValue: data.oldValue,
      newValue: data.newValue,

      ipAddress: data.ipAddress,
      deviceInfo: data.deviceInfo,
      sessionId: data.sessionId,
    },
  });
}