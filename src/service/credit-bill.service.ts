import { prisma } from "@/lib/prisma";

interface MarkBillAsCreditInput {
  billId: string;
  markedByUserId: string;
}

export async function markBillAsCredit(
  input: MarkBillAsCreditInput
) {
  return await prisma.$transaction(async (tx) => {

    // 1. Find Bill
    const bill = await tx.bill.findUnique({
      where: {
        id: input.billId,
      },
      include: {
        businessSession: true,
        items: true,
      },
    });

    if (!bill) {
      throw new Error("Bill not found");
    }


    // 2. Bill must be OPEN
    if (bill.status !== "OPEN") {
      throw new Error("Bill is already closed");
    }


    // 3. Check Business Session
    if (!bill.businessSession) {
      throw new Error("Business session not found");
    }

    if (bill.businessSession.status !== "OPEN") {
      throw new Error("Business session is closed");
    }


    // 4. Check User
    const user = await tx.user.findUnique({
      where: {
        id: input.markedByUserId,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    if (!user.isActive) {
      throw new Error("User is inactive");
    }

    if (user.role === "STAFF") {
      throw new Error("Staff cannot mark bill as credit");
    }


    // 5. Check Bill Items
    if (bill.items.length === 0) {
      throw new Error("Bill has no items");
    }


    // 6. Check Total Amount
    if (Number(bill.totalAmount) <= 0) {
      throw new Error("Invalid bill amount");
    }


    // 7. Update Bill OPEN -> CREDIT
    const updatedBill = await tx.bill.update({
      where: {
        id: bill.id,
      },
      data: {
        status: "CREDIT",
        closedAt: new Date(),
      },
      include: {
        items: true,
        payments: true,
      },
    });


    // 8. Audit Log
    await tx.auditLog.create({
      data: {
        userId: user.id,
        action: "MARK_CREDIT",
        entityType: "Bill",
        entityId: bill.id,
        targetName: bill.billNumber,
        description: "Bill marked as credit",
        oldValue: JSON.stringify({
          status: "OPEN",
        }),
        newValue: JSON.stringify({
          status: "CREDIT",
        }),
      },
    });


    // 9. Return
    return updatedBill;
  });
}