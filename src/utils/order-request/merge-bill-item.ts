// src/utils/order-request/merge-bill-item.ts

import { Prisma } from "@prisma/client";

import { buildMixerSignature } from "./build-mixer-signature";

interface MergeBillItemInput {
  prisma: Prisma.TransactionClient;

  billId: string;

  productId: string;

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

export async function mergeBillItem({
  prisma,
  billId,
  productId,
  qty,
  unitPrice,
  isStaffDrink,
  staffDrinkFee,
  staffDrinkRecipient,
  addedByUserId,
  mixers,
}: MergeBillItemInput) {

  // ============================
  // Build Mixer Signature
  // ============================

  const mixerSignature = buildMixerSignature(
    mixers.map((m) => m.mixerProductId),
  );


  // ============================
  // Find Existing Bill Item
  // ============================

  const existingBillItem =
    await prisma.billItem.findUnique({

      where: {

        billId_productId_mixerSignature: {

          billId,

          productId,

          mixerSignature,

        },

      },

    });



  // ============================
  // Merge Qty
  // ============================

  if (existingBillItem) {

    const newQty =
      existingBillItem.qty + qty;


    const fee =
      isStaffDrink && staffDrinkFee
        ? staffDrinkFee.mul(newQty)
        : new Prisma.Decimal(0);


    const productTotal =
      unitPrice.mul(newQty);


    const lineTotal =
      productTotal.add(fee);



    return await prisma.billItem.update({

      where: {

        id:
          existingBillItem.id,

      },

      data: {

        qty:
          newQty,


        lineTotal,


        isStaffDrink,

        staffDrinkFee,

        staffDrinkRecipient,

      },

    });

  }


  // ============================
  // Not Found
  // ============================

  return null;
}