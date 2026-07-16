// src/utils/order-request/reject-validation.ts

import { Prisma } from "@prisma/client";

interface RejectValidationInput {
  prisma: Prisma.TransactionClient;
  orderRequestId: string;
  approvedByUserId: string;
}

export async function rejectValidation({
  prisma,
  orderRequestId,
  approvedByUserId,
}: RejectValidationInput) {
  // ============================
  // User
  // ============================

  const user = await prisma.user.findUnique({
    where: {
      id: approvedByUserId,
    },
  });

  if (!user) {
    throw new Error("User not found.");
  }

  if (!user.isActive) {
    throw new Error("User is inactive.");
  }

  if (
    user.role !== "ADMIN" &&
    user.role !== "CASHIER"
  ) {
    throw new Error(
      "Only admin or cashier can reject order requests.",
    );
  }

  // ============================
  // Order Request
  // ============================

  const orderRequest =
    await prisma.orderRequest.findUnique({
      where: {
        id: orderRequestId,
      },
      include: {
        bill: {
          include: {
            businessSession: true,
          },
        },

        requestedBy: true,

        items: true,
      },
    });

  if (!orderRequest) {
    throw new Error("Order request not found.");
  }

  // ============================
  // Status
  // ============================

  if (orderRequest.status !== "PENDING") {
    throw new Error(
      "Order request is already processed.",
    );
  }

  // ============================
  // Bill
  // ============================

  if (orderRequest.bill.status !== "OPEN") {
    throw new Error(
      "Bill is already closed.",
    );
  }

  // ============================
  // Business Session
  // ============================

  if (
    orderRequest.bill.businessSession.status !==
    "OPEN"
  ) {
    throw new Error(
      "Business session is closed.",
    );
  }

  return {
    user,
    orderRequest,
  };
}