import { prisma } from "@/lib/prisma";

interface ReceiveCreditPaymentInput {

  billId: string;

  receivedByUserId: string;

  paymentMethod: "CASH" | "TRANSFER";

  amount: number;

  receivedAmount?: number;

  paymentNote?: string;

}

export async function receiveCreditPayment(
  input: ReceiveCreditPaymentInput
) {

  return await prisma.$transaction(
    async (tx) => {


      // =====================
      // Find Bill
      // =====================

      const bill =
        await tx.bill.findUnique({

          where: {
            id: input.billId,
          },

          include: {
            businessSession: true,
            payments: true,
            items: true,
          }

        });



      if (!bill) {

        throw new Error(
          "Bill not found"
        );

      }



      // =====================
      // Bill must be CREDIT
      // =====================

      if (bill.status !== "CREDIT") {

        throw new Error(
          "Bill is not credit"
        );

      }



      // =====================
      // Check Session
      // =====================

      if (!bill.businessSession) {

        throw new Error(
          "Business session not found"
        );

      }


      if (
        bill.businessSession.status !== "OPEN"
      ) {

        throw new Error(
          "Business session is closed"
        );

      }



      // =====================
      // Check User
      // =====================

      const user =
        await tx.user.findUnique({

          where:{
            id: input.receivedByUserId,
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



      // =====================
      // Validate Amount
      // =====================

      if (input.amount <= 0) {

        throw new Error(
          "Payment amount must be greater than zero"
        );

      }



      const billAmount =
        Number(
          bill.totalAmount
        );



      if (
        input.amount !== billAmount
      ) {

        throw new Error(
          "Payment amount does not match bill amount"
        );

      }



      // =====================
      // Create Payment
      // =====================

      const payment =
  await tx.payment.create({

    data: {

      billId:
        bill.id,

      receivedByUserId:
        user.id,

      paymentMethod:
        input.paymentMethod,

      amount:
        input.amount,

      receivedAmount:
        input.receivedAmount ?? input.amount,

      changeAmount:
        0,

      paymentNote:
        input.paymentNote,

    },

  });



      // =====================
      // Update Bill
      // =====================

      const updatedBill =
        await tx.bill.update({

          where:{
            id: bill.id,
          },

          data:{
            status:"PAID",
          },

          include:{
            payments:true,
            items:true,
          },

        });

      // =====================
      // Audit Log
      // =====================

      await tx.auditLog.create({

        data: {

          userId:
            user.id,

          action:
            "PAYMENT",

          entityType:
            "Bill",

          entityId:
            bill.id,

          targetName:
            bill.billNumber,

          description:
            "Receive credit payment",

        },

      });



      return updatedBill;


    }
  );

}