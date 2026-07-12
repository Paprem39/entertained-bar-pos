import { prisma } from "../src/lib/prisma";
import { addItemToBill } from "../src/service/bill.service";


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



  const product =
    await prisma.product.findFirst({
      where:{
        name:"Black Label",
      },
    });



  if(!product){
    throw new Error(
      "Product not found"
    );
  }



  const item =
    await addItemToBill({

      billId:
        bill.id,

      productId:
        product.id,

      qty:1,

      mixerProductIds:[],

      addedByUserId:
        user.id,

    });



  console.log(
    "ADDED ITEM:",
    item
  );


}


main()
.catch(console.error)
.finally(async()=>{
  await prisma.$disconnect();
});