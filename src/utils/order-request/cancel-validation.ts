// src/utils/order-request/cancel-validation.ts

import { Prisma } from "@prisma/client";

interface CancelValidationInput {
  prisma: Prisma.TransactionClient;
  orderRequestId: string;
  requestedByUserId: string;
}

export async function cancelValidation({
  prisma,
  orderRequestId,
  requestedByUserId,
}: CancelValidationInput) {
  const orderRequest = await prisma.orderRequest.findUnique({
    where: {
      id: orderRequestId,
    },
    include: {
      requestedBy: true,
    },
  });

  if (!orderRequest) {
    throw new Error("Order request not found.");
  }

  if (orderRequest.status !== "PENDING") {
    throw new Error(
      "Only pending order requests can be cancelled.",
    );
  }

  if (orderRequest.requestedByUserId !== requestedByUserId) {
    throw new Error(
      "You can only cancel your own order request.",
    );
  }

  if (!orderRequest.requestedBy.isActive) {
    throw new Error("User is inactive.");
  }

  if (orderRequest.requestedBy.role !== "STAFF") {
    throw new Error(
      "Only staff can cancel order requests.",
    );
  }

  return orderRequest;
}