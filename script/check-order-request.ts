import { prisma } from "@/lib/prisma";

async function main() {
  const requests = await prisma.orderRequest.findMany({
    select: {
      id: true,
      status: true,
      bill: {
        select: {
          billNumber: true,
        },
      },
      createdAt: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  console.dir(requests, {
    depth: null,
  });
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });