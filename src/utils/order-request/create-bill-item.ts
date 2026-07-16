// src/utils/order-request/create-bill-item.ts

import { Prisma } from "@prisma/client";

import { buildMixerSignature } from "./build-mixer-signature";

interface CreateBillItemInput {
  prisma: Prisma.TransactionClient;

  billId: string;

  productId: string;

  productName: string;

  qty: number;

  unitPrice: Prisma.Decimal;

  isStaffDrink: boolean;

  staffDrinkFee: Prisma.Decimal | null;

  staffDrinkRecipient: string | null;

  addedByUserId: string;

  mixers: {
    mixerProductId: string;
    mixerName: string;
  }[];
}

export async function createBillItem({
  prisma,
  billId,
  productId,
  productName,
  qty,
  unitPrice,
  isStaffDrink,
  staffDrinkFee,
  staffDrinkRecipient,
  addedByUserId,
  mixers,
}: CreateBillItemInput) {

  // ============================
  // Mixer Signature
  // ============================

  const mixerSignature = buildMixerSignature(
    mixers.map((m) => m.mixerProductId),
  );


  // ============================
  // Calculate Line Total
  // ============================

  const productTotal =
    unitPrice.mul(qty);


  const staffFeeTotal =
    isStaffDrink && staffDrinkFee
      ? staffDrinkFee.mul(qty)
      : new Prisma.Decimal(0);


  const lineTotal =
    productTotal.add(staffFeeTotal);



  // ============================
  // Create Bill Item
  // ============================

  const billItem = await prisma.billItem.create({
    data: {

      billId,

      productId,

      productName,

      qty,

      unitPrice,

      lineTotal,

      mixerSignature,

      isStaffDrink,

      staffDrinkFee,

      staffDrinkRecipient,

      addedByUserId,

    },
  });



  // ============================
  // Create Mixers
  // ============================

  if (mixers.length > 0) {

    await prisma.billItemMixer.createMany({

      data: mixers.map((mixer) => ({

        billItemId: billItem.id,

        productId,

        mixerProductId:
          mixer.mixerProductId,

        mixerName:
          mixer.mixerName,

      })),

    });

  }


  return billItem;
}