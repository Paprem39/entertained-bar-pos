import { Prisma, UserRole } from "@prisma/client";

export async function validateCloseSession(
  tx: Prisma.TransactionClient,
  businessSessionId: string,
  closedByUserId: string,
) {
  // ตรวจสอบผู้ปิดกะ
  const user = await tx.user.findUnique({
    where: {
      id: closedByUserId,
    },
  });

  if (!user || !user.isActive) {
    throw new Error("User not found.");
  }

  if (
    user.role !== UserRole.ADMIN &&
    user.role !== UserRole.CASHIER
  ) {
    throw new Error("Only admin or cashier can close business session.");
  }

  // ตรวจสอบ Business Session
  const session = await tx.businessSession.findUnique({
    where: {
      id: businessSessionId,
    },
  });

  if (!session) {
    throw new Error("Business session not found.");
  }

  if (session.status !== "OPEN") {
    throw new Error("Business session is already closed.");
  }

  // ตรวจสอบ Bill ที่ยังเปิดอยู่
  const openBill = await tx.bill.findFirst({
    where: {
      businessSessionId,
      status: "OPEN",
    },
    select: {
      id: true,
      billNumber: true,
    },
  });

  if (openBill) {
    throw new Error(
      `Cannot close business session. Bill ${openBill.billNumber} is still open.`,
    );
  }

  // ตรวจสอบ Credit Bill ที่ยังไม่ชำระ
  const unpaidCreditBill = await tx.bill.findFirst({
    where: {
      businessSessionId,
      status: "CREDIT",
    },
    select: {
      id: true,
      billNumber: true,
    },
  });

  if (unpaidCreditBill) {
    throw new Error(
      `Cannot close business session. Credit bill ${unpaidCreditBill.billNumber} is unpaid.`,
    );
  }

  // ตรวจสอบ Order Request ที่ยังรออนุมัติ
  const pendingOrderRequest = await tx.orderRequest.findFirst({
    where: {
      bill: {
        businessSessionId,
      },
      status: "PENDING",
    },
    include: {
      bill: {
        select: {
          billNumber: true,
        },
      },
    },
  });

  if (pendingOrderRequest) {
    throw new Error(
      `Cannot close business session. Pending order request exists on bill ${pendingOrderRequest.bill.billNumber}.`,
    );
  }

  return {
    session,
    user,
  };
}