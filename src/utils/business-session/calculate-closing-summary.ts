import {
    PaymentMethod,
    Prisma,
    StockMovementReason,
  } from "@prisma/client";
  
  export async function calculateClosingSummary(
    tx: Prisma.TransactionClient,
    businessSessionId: string,
  ) {
    // ==========================
    // Bills
    // ==========================
  
    const bills = await tx.bill.findMany({
      where: {
        businessSessionId,
        status: {
          in: ["PAID"],
        },
      },
      include: {
        payments: true,
      },
    });
  
    const totalBills = bills.length;
  
    const totalSales = bills.reduce(
      (sum, bill) => sum.plus(bill.totalAmount),
      new Prisma.Decimal(0),
    );
  
    // ==========================
    // Payments
    // ==========================
  
    let cashAmount = new Prisma.Decimal(0);
    let transferAmount = new Prisma.Decimal(0);
  
    for (const bill of bills) {
      for (const payment of bill.payments) {
        if (payment.paymentMethod === PaymentMethod.CASH) {
          cashAmount = cashAmount.plus(payment.amount);
        }
  
        if (payment.paymentMethod === PaymentMethod.TRANSFER) {
          transferAmount = transferAmount.plus(payment.amount);
        }
      }
    }
  
    // ==========================
    // Expenses
    // ==========================
  
    const expenses = await tx.expense.findMany({
      where: {
        businessSessionId,
      },
    });
  
    const totalExpense = expenses.reduce(
      (sum, expense) => sum.plus(expense.amount),
      new Prisma.Decimal(0),
    );
  
    // ==========================
    // Staff Drink
    // ==========================
  
    const staffDrinkItems = await tx.billItem.findMany({
      where: {
        bill: {
          businessSessionId,
          status: "PAID",
        },
        isStaffDrink: true,
      },
      select: {
        staffDrinkFee: true,
      },
    });
  
    const staffDrinkAmount = staffDrinkItems.reduce(
      (sum, item) => sum.plus(item.staffDrinkFee ?? 0),
      new Prisma.Decimal(0),
    );
  
    // ==========================
    // Product Summary
    // ==========================
  
    const productSummary = await tx.billItem.groupBy({
      by: ["productId", "productName"],
      where: {
        bill: {
          businessSessionId,
          status: "PAID",
        },
      },
      _sum: {
        qty: true,
        lineTotal: true,
      },
    });
  
    // ==========================
    // Net Cash
    // ==========================
  
    const netCashRemaining = cashAmount.minus(totalExpense);
  
    return {
      totalBills,
  
      totalSales,
  
      cashAmount,
  
      transferAmount,
  
      totalExpense,
  
      staffDrinkAmount,
  
      netCashRemaining,
  
      productSummary,
  
    };
  }