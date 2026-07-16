// scripts/get-test-data.ts

import { prisma } from "@/lib/prisma";

async function main() {
  console.log("=================================");
  console.log("STAFF");
  console.log("=================================");

  const staffs = await prisma.user.findMany({
    where: {
      role: "STAFF",
      isActive: true,
    },
    select: {
        id: true,
        username: true,
        displayName: true,
      }
  });

  console.table(staffs);

  console.log("\n=================================");
  console.log("OPEN BILL");
  console.log("=================================");

  const session = await prisma.businessSession.findFirst({
    where: {
      status: "OPEN",
    },
  });
  
  const bills = await prisma.bill.findMany({
    where: {
      status: "OPEN",
      businessSessionId: session!.id,
    },
    select: {
      id: true,
      billName: true,
      billNumber: true,
      businessSessionId: true,
    },
  });

  console.table(bills);

  console.log("\n=================================");
  console.log("PRODUCT");
  console.log("=================================");

  const products = await prisma.product.findMany({
    where: {
      isActive: true,
    },
    select: {
      id: true,
      name: true,
      allowMixer: true,
      normalPrice: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  console.table(products);

  console.log("\n=================================");
  console.log("PRODUCT MIXERS");
  console.log("=================================");

  const mixers = await prisma.productMixer.findMany({
    include: {
      product: {
        select: {
          name: true,
        },
      },
      mixerProduct: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      product: {
        name: "asc",
      },
    },
  });

  console.table(
    mixers.map((m) => ({
      product: m.product.name,
      mixer: m.mixerProduct.name,
      mixerProductId: m.mixerProductId,
    })),
  );

console.log("\n=================================");
console.log("OPEN BUSINESS SESSION");
console.log("=================================");

console.dir(session, {
  depth: null,
});

}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });

