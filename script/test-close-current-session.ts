import { prisma } from "@/lib/prisma";
import {
  closeBusinessSession,
} from "@/service/business-session.service";


async function main(){

  const admin =
    await prisma.user.findFirst({
      where:{
        role:"ADMIN",
      },
    });


  const session =
    await prisma.businessSession.findFirst({
      where:{
        status:"OPEN",
      },
    });


  if(!session){
    console.log(
      "No open session"
    );
    return;
  }


  const result =
    await closeBusinessSession({

      businessSessionId:
        session.id,

      closedByUserId:
        admin!.id,

    });


  console.log(
    "Closed:",
    result.session.id
  );


  console.log(
    "Snapshot:",
    result.snapshot.id
  );

}


main()
.finally(
  ()=>prisma.$disconnect()
);