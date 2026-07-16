import { prisma } from "@/lib/prisma";
import {
  getActiveLoginUsers,
  loginWithPin,
} from "@/service/user.service";


async function main() {

  console.log("=== TEST GET ACTIVE USERS ===");


  const users =
    await getActiveLoginUsers();


  console.log(users);



  console.log("\n=== TEST LOGIN PIN ===");


  const cashier =
    users.find(
      user => user.username === "Ca00"
    );


  if(!cashier){

    throw new Error(
      "Cashier user not found"
    );

  }



  const result =
    await loginWithPin({

      userId:cashier.id,

      pin:"1111",

    });



  console.log(result);

}



main()

  .catch(error=>{

    console.error(error);

    process.exit(1);

  })

  .finally(async()=>{

    await prisma.$disconnect();

  });