import { prisma } from "@/lib/prisma";
import { createBill } from "@/service/bill.service";

import {
  createOrderRequest,
  approveOrderRequest,
} from "@/service/order-request.service";



async function main() {


  console.log(
    "START ORDER STOCK FLOW TEST"
  );


  // =========================
  // หา Admin / Staff
  // =========================

  const admin =
    await prisma.user.findFirst({

      where:{
        role:"ADMIN",
      },

    });


  const staff =
    await prisma.user.findFirst({

      where:{
        role:"STAFF",
      },

    });


  if(!admin || !staff){

    throw new Error(
      "User not found"
    );

  }



  // =========================
  // Session
  // =========================

  const session =
    await prisma.businessSession.findFirst({

      where:{
        status:"OPEN",
      },

    });


  if(!session){

    throw new Error(
      "No open business session"
    );

  }



  // =========================
  // Product
  // =========================

  const product =
    await prisma.product.findFirst({

      where:{
        name:"Singha",
      },

    });


  if(!product){

    throw new Error(
      "Product not found"
    );

  }



  // =========================
  // Stock Before
  // =========================

  const stockBefore =
    await prisma.stock.findUnique({

      where:{
        productId:
          product.id,
      },

    });



  console.log(
    "STOCK BEFORE:",
    stockBefore?.currentQty
  );



  // =========================
  // Create Bill
  // =========================

  const bill =
  await createBill({

    billName:
      "TEST STAFF ORDER",

    createdByUserId:
      admin.id,

    businessSessionId:
      session.id,

  });



  console.log(
    "BILL:",
    bill.id
  );



  // =========================
  // Staff Create Order
  // =========================

  const orderRequest =
    await createOrderRequest({

      billId:
        bill.id,

      requestedByUserId:
        staff.id,

      note:
        "TEST STAFF ORDER",

        items:[

            {
          
              productId:
                product.id,
          
              quantity:
                2,
          
              isStaffDrink:false,
          
              staffDrinkFee:0,
          
              mixers:[],
          
            },
          
          ],

    });



  console.log(
    "ORDER REQUEST:",
    orderRequest?.id
  );



  // =========================
  // Approve
  // =========================

  const approved =
    await approveOrderRequest({

      orderRequestId:
        orderRequest!.id,

      approvedByUserId:
        admin.id,

    });



  console.log(
    "APPROVED:",
    approved?.id
  );



  // =========================
  // Stock After
  // =========================

  const stockAfter =
    await prisma.stock.findUnique({

      where:{
        productId:
          product.id,
      },

    });



  console.log(
    "STOCK AFTER:",
    stockAfter?.currentQty
  );



  // =========================
  // Movement
  // =========================

  const movements =
    await prisma.stockMovement.findMany({

      where:{
        productId:
          product.id,
      },

      orderBy:{
        createdAt:"desc",
      },

      take:5,

    });



  console.log(
    "LATEST MOVEMENTS:",
    movements
  );



  console.log(
    "ORDER STOCK FLOW TEST COMPLETE"
  );

}



main()

.catch(console.error)

.finally(
  ()=>prisma.$disconnect()
);