import { prisma } from "../src/lib/prisma";
import { receiveCreditPayment } from "../src/service/credit-payment.service";


async function main() {


  const bill =
    await prisma.bill.findUnique({

      where:{
        id:"cmrieffue0000o0vi4mhr2r4g",
      },

    });


  if(!bill){
    throw new Error(
      "Bill not found"
    );
  }



  const user =
    await prisma.user.findFirst({

      where:{
        role:"CASHIER",
        isActive:true,
      },

    });



  if(!user){
    throw new Error(
      "Cashier not found"
    );
  }



  const result =
    await receiveCreditPayment({

      billId:
        bill.id,

      receivedByUserId:
        user.id,

      paymentMethod:
        "CASH",

      amount:
        Number(bill.totalAmount),

      receivedAmount:
        Number(bill.totalAmount),

      paymentNote:
        "Test credit payment",

    });



  console.log(
    "CREDIT PAYMENT RESULT:",
    result
  );


}



main()
.catch(console.error)
.finally(async()=>{
  await prisma.$disconnect();
});