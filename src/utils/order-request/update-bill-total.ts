// src/utils/order-request/update-bill-total.ts

import { Prisma } from "@prisma/client";

interface UpdateBillTotalInput {
  prisma: Prisma.TransactionClient;

  billId: string;
}

export async function updateBillTotal({
  prisma,
  billId,
}: UpdateBillTotalInput) {
  // ============================
  // Get Bill Items
  // ============================

  const items = await prisma.billItem.findMany({
    where: {
      billId,
    },
    select: {
      lineTotal: true,
    },
  });

  // ============================
  // Calculate Total
  // ============================

  let subtotal = new Prisma.Decimal(0);

  for (const item of items) {
    subtotal = subtotal.add(item.lineTotal);
  }

  // ============================
  // Update Bill
  // ============================

  return await prisma.bill.update({
    where: {
      id: billId,
    },
    data: {
      subtotal,
      totalAmount: subtotal,
    },
  });
}