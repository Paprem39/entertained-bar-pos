import { createBill } from "@/service/bill.service";
import { prisma } from "@/lib/prisma";

async function main() {
  const session = await prisma.businessSession.findFirst({
    where: {
      status: "OPEN",
    },
  });

  if (!session) {
    throw new Error("No open business session.");
  }

  const cashier = await prisma.user.findFirst({
    where: {
      role: "CASHIER",
      isActive: true,
    },
  });

  if (!cashier) {
    throw new Error("Cashier not found.");
  }

  const bill = await createBill({
    businessSessionId: session.id,
    createdByUserId: cashier.id,
    billName: "ORDER REQUEST TEST",
  });

  console.dir(bill, {
    depth: null,
  });
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });