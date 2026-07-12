import { prisma } from "../src/lib/prisma";
import { createBill } from "../src/service/bill.service";


async function main() {

  const session =
    await prisma.businessSession.findFirst({
      where: {
        status: "OPEN",
      },
    });


  if (!session) {
    throw new Error(
      "No open business session"
    );
  }


  const user =
    await prisma.user.findFirst({
      where: {
        role: "CASHIER",
        isActive: true,
      },
    });


  if (!user) {
    throw new Error(
      "No active cashier found"
    );
  }


  const bill =
    await createBill({
      billName: "TEST CREDIT BILL",
      createdByUserId: user.id,
      businessSessionId: session.id,
    });


  console.log(
    "CREATED BILL:",
    bill
  );

}


main()
  .catch(console.error)
  .finally(async()=>{
    await prisma.$disconnect();
  });