// src/utils/order-request/validate-order-request.ts

import { Prisma } from "@prisma/client";
import { CreateOrderRequestInput } from "@/types/order-request";
import { validateMixer } from "./validate-mixer";

interface ValidateOrderRequestParams {
    prisma: Prisma.TransactionClient;
    input: CreateOrderRequestInput;
  }

export async function validateOrderRequest({
  prisma,
  input,
}: ValidateOrderRequestParams): Promise<void> {
  // ============================
  // User
  // ============================

  const user = await prisma.user.findUnique({
    where: {
      id: input.requestedByUserId,
    },
  });

  if (!user) {
    throw new Error("User not found.");
  }

  if (!user.isActive) {
    throw new Error("User is inactive.");
  }

  if (user.role !== "STAFF") {
    throw new Error("Only staff can create order requests.");
  }

  // ============================
  // Business Session
  // ============================

  const session = await prisma.businessSession.findFirst({
    where: {
      status: "OPEN",
    },
  });

  if (!session) {
    throw new Error("Business session is not open.");
  }

  // ============================
  // Bill
  // ============================

  const bill = await prisma.bill.findUnique({
    where: {
      id: input.billId,
    },
  });

  if (!bill) {
    throw new Error("Bill not found.");
  }

  if (bill.status !== "OPEN") {
    throw new Error("Bill is not open.");
  }

  if (bill.businessSessionId !== session.id) {
    throw new Error("Bill does not belong to current business session.");
  }

  // ============================
  // Items
  // ============================

  if (input.items.length === 0) {
    throw new Error("Order must contain at least one item.");
  }

  for (const item of input.items) {
    if (item.quantity <= 0) {
      throw new Error("Quantity must be greater than zero.");
    }

    const product = await prisma.product.findUnique({
      where: {
        id: item.productId,
      },
    });

    if (!product) {
      throw new Error("Product not found.");
    }

    if (!product.isActive) {
      throw new Error(`Product "${product.name}" is inactive.`);
    }

    if (item.mixers?.length) {
        if (!product.allowMixer) {
          throw new Error(
            `Product "${product.name}" does not allow mixers.`,
          );
        }
      
        await validateMixer({
          prisma,
          productId: item.productId,
          mixerProductIds: item.mixers.map(
            (mixer) => mixer.mixerProductId,
          ),
        });
      }

    if (item.isStaffDrink) {
      if (
        !item.staffDrinkRecipient ||
        item.staffDrinkRecipient.trim() === ""
      ) {
        throw new Error(
          "Staff drink recipient is required.",
        );
      }

      if (
        item.staffDrinkFee === undefined ||
        item.staffDrinkFee === null
      ) {
        throw new Error(
          "Staff drink fee is required.",
        );
      }

      if (item.staffDrinkFee < 0) {
        throw new Error(
          "Staff drink fee cannot be negative.",
        );
      }
    }
  }
}