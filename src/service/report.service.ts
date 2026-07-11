import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";


interface DailyReportInput {

  businessSessionId: string;

}



export async function getDailyReport(
  input: DailyReportInput
) {


  const session =
    await prisma.businessSession.findUnique({

      where: {
        id: input.businessSessionId,
      },

    });



  if (!session) {

    throw new Error(
      "Business session not found"
    );

  }



  // =====================
  // Sales
  // =====================

  const sales =
    await prisma.bill.aggregate({

      where: {

        businessSessionId:
          input.businessSessionId,

        status:
          "PAID",

      },

      _sum: {

        totalAmount: true,

      },

      _count: {

        id: true,

      },

    });



  // =====================
  // Payment Summary
  // =====================

  const cash =
    await prisma.payment.aggregate({

      where: {

        paymentMethod:
          "CASH",

        bill: {

          businessSessionId:
            input.businessSessionId,

        },

      },

      _sum: {

        amount: true,

      },

    });



  const transfer =
    await prisma.payment.aggregate({

      where: {

        paymentMethod:
          "TRANSFER",

        bill: {

          businessSessionId:
            input.businessSessionId,

        },

      },

      _sum: {

        amount: true,

      },

    });



  // =====================
  // Expense
  // =====================

  const expense =
    await prisma.expense.aggregate({

      where: {

        businessSessionId:
          input.businessSessionId,

      },

      _sum: {

        amount: true,

      },

    });



  // =====================
  // Staff Drink
  // =====================

  const staffDrink =
    await prisma.billItem.aggregate({

      where: {

        isStaffDrink:
          true,

        bill: {

          businessSessionId:
            input.businessSessionId,

        },

      },

      _sum: {

        staffDrinkFee:
          true,

      },

    });



  const totalSales =
    new Prisma.Decimal(
      sales._sum.totalAmount ?? 0
    );


  const cashAmount =
    new Prisma.Decimal(
      cash._sum.amount ?? 0
    );


  const transferAmount =
    new Prisma.Decimal(
      transfer._sum.amount ?? 0
    );


  const totalExpense =
    new Prisma.Decimal(
      expense._sum.amount ?? 0
    );


    const staffDrinkAmount =
    new Prisma.Decimal(
      staffDrink._sum.staffDrinkFee ?? 0
    );



  // =====================
  // Product Sales Summary
  // =====================

  const productSales =
    await prisma.billItem.groupBy({

      by: [
        "productId",
        "productName",
      ],

      where: {

        bill: {

          businessSessionId:
            input.businessSessionId,

          status:
            "PAID",

        },

      },

      _sum: {

        qty: true,

      },

    });



  // =====================
  // Payment Summary
  // =====================

  const paymentSummary =
    await prisma.payment.groupBy({

      by: [
        "paymentMethod",
      ],

      where: {

        bill: {

          businessSessionId:
            input.businessSessionId,

        },

      },

      _count: {

        id: true,

      },

      _sum: {

        amount: true,

      },

    });



  // =====================
  // Bill Status Summary
  // =====================

  const billSummary =
    await prisma.bill.groupBy({

      by: [
        "status",
      ],

      where: {

        businessSessionId:
          input.businessSessionId,

      },

      _count: {

        id: true,

      },

    });

    const netCashRemaining =
    cashAmount.minus(totalExpense);

    return {

      businessSessionId:
        input.businessSessionId,
    
    
      // Financial Summary
    
      totalBills:
        sales._count.id,
    
    
      totalSales,
    
    
      cashAmount,
    
    
      transferAmount,
    
    
      totalExpense,
    
    
      staffDrinkAmount,
    
    
      netCashRemaining,
    
    
    
      // Product Summary
    
      products:
        productSales.map((item) => ({
    
          productId:
            item.productId,
    
          productName:
            item.productName,
    
          quantity:
            item._sum.qty ?? 0,
    
        })),
    
    
    
      // Payment Summary
    
      payments:
        paymentSummary.map((item) => ({
    
          paymentMethod:
            item.paymentMethod,
    
          count:
            item._count.id,
    
          amount:
            item._sum.amount ?? 0,
    
        })),
    
    
    
      // Bill Summary
    
      bills:
        billSummary.map((item) => ({
    
          status:
            item.status,
    
          count:
            item._count.id,
    
        })),
    
    };


}