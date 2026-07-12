import { prisma } from "@/lib/prisma";
import { openBusinessSession } from "@/service/business-session.service";


async function main() {

  const user =
    await prisma.user.findFirst({
      where:{
        role:"CASHIER",
        isActive:true,
      },
    });


  if(!user){
    throw new Error(
      "No active cashier found"
    );
  }


  const session =
    await openBusinessSession({
      openedByUserId:user.id,
    });


  console.log(
    "OPEN SESSION:",
    session
  );

}


main()
  .catch(console.error)
  .finally(async()=>{
    await prisma.$disconnect();
  });