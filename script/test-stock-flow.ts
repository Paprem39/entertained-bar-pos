import { prisma } from "@/lib/prisma";

import {
  createBill,
  addItemToBill,
} from "@/service/bill.service";

import {
  updateBillItemQuantity,
  deleteBillItem,
} from "@/service/bill-item.service";



async function main() {

  console.log("START STOCK FLOW TEST");



  const user =
    await prisma.user.findFirst({

      where: {
        isActive: true,
      },

    });



  if (!user) {
    throw new Error(
      "No active user found"
    );
  }



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



  const product =
    await prisma.product.findFirst({

      where: {
        isActive: true,
      },

    });



  if (!product) {
    throw new Error(
      "No product found"
    );
  }



  console.log({
    user:
      user.username,

    session:
      session.id,

    product:
      product.name,
  });



  // ==========================
  // CREATE BILL
  // ==========================

  const bill =
    await createBill({

      billName:
        "TEST STOCK FLOW",

      createdByUserId:
        user.id,

      businessSessionId:
        session.id,

    });



  console.log(
    "Bill created",
    bill.id
  );



  // ==========================
  // ADD ITEM QTY 3
  // ==========================


  const item =
    await addItemToBill({

      billId:
        bill.id,

      productId:
        product.id,

      qty:
        3,

      mixerProductIds:
        [],

      addedByUserId:
        user.id,

    });



  console.log(
    "Add item",
    item.id
  );



  // ==========================
  // UPDATE QTY 3 -> 2
  // ==========================


  const updated =
    await updateBillItemQuantity({

      billItemId:
        item.id,

      newQuantity:
        2,

      userId:
        user.id,

    });



  console.log(
    "Updated qty",
    updated.qty
  );



  // ==========================
  // DELETE ITEM
  // ==========================


  await deleteBillItem({

    billItemId:
      item.id,

    userId:
      user.id,

  });



  console.log(
    "Deleted item"
  );


  const movements =
  await prisma.stockMovement.findMany({

    orderBy: {

      createdAt:
        "desc",

    },

    take:
      10,

  });


console.log(
  "STOCK MOVEMENTS:",
  movements
);

  console.log(
    "STOCK FLOW TEST COMPLETE"
  );

}



main()

  .catch((error)=>{

    console.error(error);

    process.exit(1);

  })

  .finally(async()=>{

    await prisma.$disconnect();

  });