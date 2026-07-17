import { prisma } from "@/lib/prisma";


async function main(){

  const session =
    await prisma.businessSession.findFirst({
      where:{
        status:"OPEN",
      },
    });


  if(!session){
    throw new Error(
      "No open session"
    );
  }


  const result =
    await prisma.bill.updateMany({

      where:{
        businessSessionId:
          session.id,

        status:"OPEN",

        billName:{
          startsWith:"TEST",
        },
      },

      data:{
        status:"CANCELLED",
      },

    });


  console.log(
    "Cancelled bills:",
    result.count
  );

}


main()
.finally(
  ()=>prisma.$disconnect()
);