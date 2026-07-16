// src/utils/order-request/create-order-request-items.ts

import { Prisma } from "@prisma/client";

import { CreateOrderRequestInput } from "@/types/order-request";

import { buildMixerSignature } from "./build-mixer-signature";

interface CreateOrderRequestItemsParams {
    prisma: Prisma.TransactionClient;

  orderRequestId: string;

  input: CreateOrderRequestInput;
}

export async function createOrderRequestItems({
  prisma,
  orderRequestId,
  input,
}: CreateOrderRequestItemsParams): Promise<void> {
  for (const item of input.items) {
    // ============================
    // Product
    // ============================

    const product = await prisma.product.findUnique({
      where: {
        id: item.productId,
      },
    });

    if (!product) {
      throw new Error("Product not found.");
    }

    // ============================
    // Create OrderRequestItem
    // ============================

    const orderRequestItem =
      await prisma.orderRequestItem.create({
        data: {
          orderRequestId,

          productId: product.id,

          productName: product.name,

          quantity: item.quantity,

          note: item.note,

          isStaffDrink: item.isStaffDrink ?? false,

          staffDrinkFee: item.staffDrinkFee,

          staffDrinkRecipient: item.staffDrinkRecipient,
        },
      });

    // ============================
    // Create Mixers
    // ============================

    if (!item.mixers?.length) {
      continue;
    }

    const mixerSignature = buildMixerSignature(
      item.mixers.map((mixer) => mixer.mixerProductId),
    );

    void mixerSignature;

    for (const mixer of item.mixers) {
      const mixerProduct =
        await prisma.product.findUnique({
          where: {
            id: mixer.mixerProductId,
          },
        });

      if (!mixerProduct) {
        throw new Error("Mixer product not found.");
      }

      await prisma.orderRequestItemMixer.create({
        data: {
          orderRequestItemId: orderRequestItem.id,

          productId: product.id,

          mixerProductId: mixerProduct.id,

          mixerName: mixerProduct.name,
        },
      });
    }
  }
}