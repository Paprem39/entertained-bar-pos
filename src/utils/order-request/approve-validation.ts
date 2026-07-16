// src/utils/order-request/approve-validation.ts

import { Prisma } from "@prisma/client";

interface ApproveValidationInput {
  prisma: Prisma.TransactionClient;
  orderRequestId: string;
  approvedByUserId: string;
}

export async function approveValidation({
  prisma,
  orderRequestId,
  approvedByUserId,
}: ApproveValidationInput) {
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
      "Only admin or cashier can approve order requests.",
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

        items: {
          include: {
            product: true,

            mixers: {
              include: {
                mixerProduct: true,
              },
            },
          },
        },

        requestedBy: true,
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

  // ============================
  // Items
  // ============================

  if (orderRequest.items.length === 0) {
    throw new Error(
      "Order request has no items.",
    );
  }

  return {
    user,
    orderRequest,
  };
}