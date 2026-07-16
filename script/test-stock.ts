import { prisma } from "@/lib/prisma";
import {
  increaseStock,
  decreaseStock,
  adjustStock,
} from "@/service/stock.service";


async function main(){


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



  const user =
    await prisma.user.findFirst({

      where:{
        role:"ADMIN",
      },

    });



  if(!user){

    throw new Error(
      "User not found"
    );

  }



  console.log(
    "PRODUCT:",
    product.name
  );



  console.log(
    "\n=== INCREASE STOCK ==="
  );


  const increase =
    await increaseStock({

      productId:
        product.id,

      quantity:
        10,

      reason:
        "PURCHASE",

      userId:
        user.id,

    });



  console.log(
    increase
  );



  console.log(
    "\n=== DECREASE STOCK ==="
  );


  const decrease =
    await decreaseStock({

      productId:
        product.id,

      quantity:
        2,

      reason:
        "SALE",

      userId:
        user.id,

    });



  console.log(
    decrease
  );




  console.log(
    "\n=== ADJUST STOCK ==="
  );


  const adjust =
    await adjustStock({

      productId:
        product.id,

      quantity:
        20,

      reason:
        "COUNT",

      userId:
        user.id,

    });



  console.log(
    adjust
  );




  const stock =
    await prisma.stock.findUnique({

      where:{
        productId:
          product.id,
      },

    });



  console.log(
    "\nFINAL STOCK:",
    stock
  );




}


main()
.catch(console.error)
.finally(
  ()=>prisma.$disconnect()
);