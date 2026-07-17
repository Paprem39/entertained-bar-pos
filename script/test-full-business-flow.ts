import { prisma } from "@/lib/prisma";

import {
  openBusinessSession,
} from "@/service/business-session.service";

import {
  createBill,
} from "@/service/bill.service";

import {
  createOrderRequest,
  approveOrderRequest,
} from "@/service/order-request.service";

import {
    receivePayment,
  } from "@/service/payment.service";

import {
  closeBusinessSession,
} from "@/service/business-session.service";


async function main() {

  console.log(
    "START FULL BUSINESS FLOW TEST"
  );


  const admin =
    await prisma.user.findFirst({
      where:{
        role:"ADMIN",
      },
    });


  const cashier =
    await prisma.user.findFirst({
      where:{
        role:"CASHIER",
      },
    });


  const staff =
    await prisma.user.findFirst({
      where:{
        role:"STAFF",
      },
    });


  const product =
    await prisma.product.findFirst();


  if(
    !admin ||
    !cashier ||
    !staff ||
    !product
  ){
    throw new Error(
      "Test data missing"
    );
  }



  // =========================
  // OPEN SESSION
  // =========================


  const session =
    await openBusinessSession({

      openedByUserId:
        admin.id,

    });


  console.log(
    "SESSION:",
    session.id
  );



  // =========================
  // CREATE BILL
  // =========================


  const bill =
    await createBill({

      billName:
        "FULL FLOW TEST",

      createdByUserId:
        cashier.id,

      businessSessionId:
        session.id,

    });


  console.log(
    "BILL:",
    bill.id
  );



  // =========================
  // STAFF ORDER REQUEST
  // =========================


  const orderRequest =
    await createOrderRequest({

      billId:
        bill.id,

      requestedByUserId:
        staff.id,

      items:[

        {
          productId:
            product.id,

          quantity:
            1,

        },

      ],

    });


  console.log(
    "ORDER:",
    orderRequest?.id
  );



  // =========================
  // APPROVE
  // =========================


  const approved =
    await approveOrderRequest({

      orderRequestId:
        orderRequest!.id,

      approvedByUserId:
        cashier.id,

    });


  console.log(
    "APPROVED:",
    approved?.id
  );



  // =========================
  // PAYMENT
  // =========================


  const payment =
  await receivePayment({

    billId:
      bill.id,

    paymentMethod:
      "CASH",

    receivedAmount:
      1000,

    receivedByUserId:
      cashier.id,

  });


console.log(
  "PAYMENT:",
  payment?.id
);



  // =========================
  // CLOSE SESSION
  // =========================


  const closed =
    await closeBusinessSession({

      businessSessionId:
        session.id,

      closedByUserId:
        admin.id,

    });


    console.log(
        "CLOSED SESSION:",
        closed.session.id
      );
      
      
      console.log(
        "SNAPSHOT:",
        closed.snapshot.id
      );



  console.log(
    "FULL BUSINESS FLOW TEST COMPLETE"
  );

}



main()
.catch(console.error)
.finally(
  () =>
    prisma.$disconnect()
);