import { prisma } from "../src/lib/prisma";
import { markBillAsCredit } from "../src/service/credit-bill.service";


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
    await markBillAsCredit({

      billId:
        bill.id,

      markedByUserId:
        user.id,

    });



  console.log(
    "CREDIT RESULT:",
    result
  );

}



main()
.catch(console.error)
.finally(async()=>{
  await prisma.$disconnect();
});