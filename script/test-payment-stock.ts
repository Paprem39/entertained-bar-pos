import { prisma } from "@/lib/prisma";
import { receivePayment } from "@/service/payment.service";
import { createBill, addItemToBill } from "@/service/bill.service";



async function main(){


  const user =
    await prisma.user.findFirst({

      where:{
        role:"ADMIN",
      },

    });



  if(!user){

    throw new Error(
      "Admin user not found"
    );

  }




  const session =
    await prisma.businessSession.findFirst({

      where:{
        status:"OPEN",
      },

    });



  if(!session){

    throw new Error(
      "Open business session not found"
    );

  }






  const product =
    await prisma.product.findUnique({

      where:{
        name:"Black Label",
      },

    });



  if(!product){

    throw new Error(
      "Product not found"
    );

  }






  console.log(
    "\n=== STOCK BEFORE ==="
  );


  const stockBefore =
    await prisma.stock.findUnique({

      where:{
        productId:
          product.id,
      },

    });


  console.log(stockBefore);






  console.log(
    "\n=== CREATE BILL ==="
  );



  const bill =
    await createBill({

      billName:
        "TEST PAYMENT STOCK BILL",

      createdByUserId:
        user.id,

      businessSessionId:
        session.id,

    });



  console.log(bill);






  console.log(
    "\n=== ADD ITEM ==="
  );



  const item =
    await addItemToBill({

      billId:
        bill.id,

      productId:
        product.id,

      qty:
        1,

      mixerProductIds:
        [],

      addedByUserId:
        user.id,

    });



  console.log(item);







  console.log(
    "\n=== RECEIVE PAYMENT ==="
  );



  const result =
    await receivePayment({

      billId:
        bill.id,

      paymentMethod:
        "CASH",

      receivedAmount:
        200,

      paymentNote:
        "Test payment stock",

      receivedByUserId:
        user.id,

    });



  console.log(result);







  console.log(
    "\n=== STOCK AFTER ==="
  );



  const stockAfter =
    await prisma.stock.findUnique({

      where:{
        productId:
          product.id,
      },

    });


  console.log(stockAfter);






  console.log(
    "\n=== STOCK MOVEMENT ==="
  );



  const movement =
    await prisma.stockMovement.findMany({

      where:{

        productId:
          product.id,

        referenceId:
          bill.id,

      },

      orderBy:{
        createdAt:"desc",
      },

    });



  console.log(movement);





}



main()

.catch(console.error)

.finally(
  ()=>prisma.$disconnect()
);