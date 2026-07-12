import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

interface ReceivePaymentInput {
  billId: string;

  paymentMethod: "CASH" | "TRANSFER";

  receivedAmount?: Prisma.Decimal | number;

  paymentNote?: string;

  receivedByUserId: string;
}

export async function receivePayment(
    input: ReceivePaymentInput
  ) {
  
    return await prisma.$transaction(
      async (tx) => {
  
        const bill =
          await tx.bill.findUnique({

            where: {
              id: input.billId,
            },

        include: {
          businessSession: true,
        },

      });
  
  
        if (!bill) {
  
          throw new Error(
            "Bill not found"
          );
  
        }
  
        if (bill.status !== "OPEN") {
  
          throw new Error(
            "Bill is already closed"
          );
  
        }

        if (bill.businessSession.status !== "OPEN") {

          throw new Error(
            "Business session is closed"
          );
        
        }

        const user =
  await tx.user.findUnique({

    where: {
      id: input.receivedByUserId,
    },

    select: {

      id: true,

      isActive: true,

      role: true,

    },

  });

          if (!user) {

            throw new Error(
              "User not found"
            );

          }

          if (!user.isActive) {

            throw new Error(
              "User is inactive"
            );

          }

          if (user.role === "STAFF") {

            throw new Error(
              "Staff cannot receive payment"
            );

          }

        const itemCount =
            await tx.billItem.count({

                where: {
                    billId: bill.id,
                },
            });

        if (itemCount === 0) {
        throw new Error("Bill has no items");

        }

        if (bill.totalAmount.lessThanOrEqualTo(0)) {

          throw new Error(
            "Bill total amount must be greater than zero"
          );
        
        }

        let receivedAmount: Prisma.Decimal | null = null;

        let changeAmount: Prisma.Decimal | null = null;


            if (input.paymentMethod === "CASH") {

            if (input.receivedAmount == null) {

                throw new Error(
                "Received amount is required for cash payment"
                );

            }

        receivedAmount =
            new Prisma.Decimal(input.receivedAmount);

        const billTotal =
            bill.totalAmount;

        if (receivedAmount.lessThan(billTotal)) {

            throw new Error(
            "Received amount is less than bill total"
            );

        }

        changeAmount =
            receivedAmount.minus(billTotal);

        } else if (input.paymentMethod === "TRANSFER") {

            // โอนเงิน ไม่มีเงินรับ ไม่มีเงินทอน
            receivedAmount = null;
            changeAmount = null;
          
          }

          const payment =
          await tx.payment.create({
        
            data: {
        
              billId: bill.id,
        
              paymentMethod:
                input.paymentMethod,
        
              amount:
                bill.totalAmount,
        
              receivedAmount,
        
              changeAmount,
        
              paymentNote:
                input.paymentNote,
        
              receivedByUserId:
                input.receivedByUserId,
        
            },
        
          });
        
        
        await tx.bill.update({
        
          where: {
            id: bill.id,
          },
        
          data: {
        
            status: "PAID",
        
            closedAt: new Date(),
        
          },
        
        });
        
        
        await tx.auditLog.create({
        
          data: {
        
            userId:
              input.receivedByUserId,
        
            action: "PAYMENT",
        
            entityType: "Bill",
        
            entityId:
              bill.id,
        
            targetName:
              bill.billNumber,
        
            description:
              `Receive ${input.paymentMethod} payment`,
        
          },
        
        });
        
        
        return payment;
        
      }
    );
}
