import { prisma } from "@/lib/prisma";


async function main(){

  const session =
    await prisma.businessSession.findFirst({
      where:{
        status:"OPEN",
      },
    });


  if(!session){
    console.log(
      "No OPEN session"
    );
    return;
  }


  const bills =
    await prisma.bill.findMany({
      where:{
        businessSessionId:
          session.id,

        status:
          "OPEN",
      },

      include:{
        items:true,
      },
    });


  console.log(
    "OPEN BILLS:"
  );


  for(const bill of bills){

    console.log({
      id: bill.id,
      billNumber: bill.billNumber,
      billName: bill.billName,
      totalAmount: bill.totalAmount.toString(),
      items: bill.items.length,
    });

  }

}


main()
.finally(
  ()=>prisma.$disconnect()
);