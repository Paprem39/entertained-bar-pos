// src/utils/order-request/validate-mixer.ts

import { Prisma } from "@prisma/client";

interface ValidateMixerInput {
    prisma: Prisma.TransactionClient;

  productId: string;

  mixerProductIds: string[];
}

export async function validateMixer({
  prisma,
  productId,
  mixerProductIds,
}: ValidateMixerInput): Promise<void> {
  // ไม่มี Mixer ถือว่าผ่าน
  if (mixerProductIds.length === 0) {
    return;
  }

  // หา Mixer ที่อนุญาตของสินค้านี้
  const availableMixers = await prisma.productMixer.findMany({
    where: {
      productId,
    },
    select: {
      mixerProductId: true,
    },
  });

  const allowedMixerIds = new Set(
    availableMixers.map((item) => item.mixerProductId),
  );

  for (const mixerProductId of mixerProductIds) {
    if (!allowedMixerIds.has(mixerProductId)) {
      throw new Error(
        `Mixer (${mixerProductId}) is not allowed for this product.`,
      );
    }
  }
}