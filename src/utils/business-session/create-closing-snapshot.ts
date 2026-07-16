import { Prisma } from "@prisma/client";

type ClosingSummary = {
  totalBills: number;
  totalSales: Prisma.Decimal;
  cashAmount: Prisma.Decimal;
  transferAmount: Prisma.Decimal;
  totalExpense: Prisma.Decimal;
  staffDrinkAmount: Prisma.Decimal;
  netCashRemaining: Prisma.Decimal;
};

export async function createClosingSnapshot(
  tx: Prisma.TransactionClient,
  businessSessionId: string,
  summary: ClosingSummary,
) {
  const snapshot = await tx.dailyClosingSnapshot.create({
    data: {
      businessSessionId,

      totalBills: summary.totalBills,

      totalSales: summary.totalSales,

      cashAmount: summary.cashAmount,

      transferAmount: summary.transferAmount,

      totalExpense: summary.totalExpense,

      staffDrinkAmount: summary.staffDrinkAmount,

      netCashRemaining: summary.netCashRemaining,
    },
  });

  return snapshot;
}