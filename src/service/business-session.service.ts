import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

interface OpenBusinessSessionInput {

  openedByUserId: string;

}

interface CloseBusinessSessionInput {

  businessSessionId: string;

  closedByUserId: string;

}

export async function openBusinessSession(
    input: OpenBusinessSessionInput
  ) {
  
    return await prisma.$transaction(
      async (tx) => {
  
        // =====================
        // ตรวจว่ามีกะเปิดอยู่หรือไม่
        // =====================
  
        const openedSession =
          await tx.businessSession.findFirst({
  
            where: {
              status: "OPEN",
            },
  
          });
  
        if (openedSession) {
  
          throw new Error(
            "Business session is already open"
          );
  
        }
  
        // =====================
        // สร้าง Business Session
        // =====================
  
        const session =
          await tx.businessSession.create({
  
            data: {
  
              businessDate: new Date(),
  
              openedAt: new Date(),
  
              status: "OPEN",
  
              openedByUserId:
                input.openedByUserId,
  
            },
  
          });
  
        // =====================
        // Audit Log
        // =====================
  
        await tx.auditLog.create({
  
          data: {
  
            userId:
              input.openedByUserId,
  
            action: "CREATE",
  
            entityType: "BusinessSession",
  
            entityId:
              session.id,
  
              targetName: session.businessDate.toISOString().slice(0, 10),
  
            description:
              "Open business session",
  
          },
  
        });
  
        return session;
  
      }
    );
  
  }

  export async function closeBusinessSession(
    input: CloseBusinessSessionInput
  ) {
  
    return await prisma.$transaction(
      async (tx) => {
  
        const session =
          await tx.businessSession.findUnique({
  
            where: {
              id: input.businessSessionId,
            },
  
          });
  
        if (!session) {
  
          throw new Error(
            "Business session not found"
          );
  
        }
  
        if (session.status !== "OPEN") {
  
          throw new Error(
            "Business session is already closed"
          );
  
        }
  
        // =====================
        // Sales
        // =====================
  
        const sales =
          await tx.bill.aggregate({
  
            where: {
              businessSessionId: session.id,
              status: "PAID",
            },
  
            _sum: {
              totalAmount: true,
            },
  
            _count: {
              id: true,
            },
  
          });
  
        // =====================
        // Cash
        // =====================
  
        const cash =
          await tx.payment.aggregate({
  
            where: {
  
              bill: {
                businessSessionId: session.id,
              },
  
              paymentMethod: "CASH",
  
            },
  
            _sum: {
              amount: true,
            },
  
          });
  
        // =====================
        // Transfer
        // =====================
  
        const transfer =
          await tx.payment.aggregate({
  
            where: {
  
              bill: {
                businessSessionId: session.id,
              },
  
              paymentMethod: "TRANSFER",
  
            },
  
            _sum: {
              amount: true,
            },
  
          });
  
        // =====================
        // Expense
        // =====================
  
        const expense =
          await tx.expense.aggregate({
  
            where: {
              businessSessionId: session.id,
            },
  
            _sum: {
              amount: true,
            },
  
          });
  
        // =====================
        // Staff Drink
        // =====================
  
        const staffDrink =
          await tx.billItem.aggregate({
  
            where: {
  
              bill: {
                businessSessionId: session.id,
              },
  
              isStaffDrink: true,
  
            },
  
            _sum: {
              staffDrinkFee: true,
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
        
        const netCashRemaining =
          cashAmount.minus(totalExpense);
  
        // =====================
        // Snapshot
        // =====================
  
        await tx.dailyClosingSnapshot.create({
  
          data: {
  
            businessSessionId:
              session.id,
  
            totalBills:
              sales._count.id,
  
            totalSales,
  
            cashAmount,
  
            transferAmount,
  
            totalExpense,
  
            staffDrinkAmount,
  
            netCashRemaining,
  
          },
  
        });
  
        // =====================
        // Close Session
        // =====================
  
        await tx.businessSession.update({
  
          where: {
            id: session.id,
          },
  
          data: {
  
            status: "CLOSED",
  
            closedAt: new Date(),
  
            closedByUserId:
              input.closedByUserId,
  
          },
  
        });
  
        // =====================
        // Audit
        // =====================
  
        await tx.auditLog.create({
  
          data: {
  
            userId:
              input.closedByUserId,
  
            action: "CLOSE_SESSION",
  
            entityType: "BusinessSession",
  
            entityId:
              session.id,
  
            targetName:
              session.businessDate.toISOString().slice(0, 10),
  
            description:
              "Close business session",
  
          },
  
        });
  
        return true;
  
      }
    );
  
  }