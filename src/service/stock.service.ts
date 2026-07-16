import { prisma } from "@/lib/prisma";


interface IncreaseStockInput {

  productId: string;

  quantity: number;

  reason:
    | "PURCHASE"
    | "RETURN"
    | "OTHER";

  userId?: string;

}



interface DecreaseStockInput {

  productId: string;

  quantity: number;

  reason:
    | "SALE"
    | "DAMAGE"
    | "BORROW"
    | "OTHER";

  userId?: string;

}



interface AdjustStockInput {

  productId: string;

  quantity: number;

  reason:
    | "COUNT"
    | "ADJUSTMENT";

  userId?: string;

}



async function getOrCreateStock(
  tx:any,
  productId:string
){

  const stock =
    await tx.stock.findUnique({

      where:{
        productId,
      },

    });


  if(stock){
    return stock;
  }


  return await tx.stock.create({

    data:{

      productId,

      currentQty:0,

    },

  });

}





export async function increaseStock(
  input: IncreaseStockInput
){

  return await prisma.$transaction(
    async(tx)=>{


      const product =
        await tx.product.findUnique({

          where:{
            id:input.productId,
          },

        });


      if(!product){

        throw new Error(
          "Product not found"
        );

      }



      if(input.quantity <= 0){

        throw new Error(
          "Quantity must be greater than zero"
        );

      }



      const stock =
        await getOrCreateStock(
          tx,
          input.productId
        );



      const beforeQty =
        stock.currentQty;


      const afterQty =
        beforeQty + input.quantity;



      await tx.stock.update({

        where:{
          id:stock.id,
        },

        data:{

          currentQty:
            afterQty,

        },

      });



      return await tx.stockMovement.create({

        data:{

          stockId:
            stock.id,

          productId:
            input.productId,

          userId:
            input.userId,

          movementType:
            "IN",

          reason:
            input.reason,

          quantity:
            input.quantity,

          beforeQty,

          afterQty,

        },

      });


    }
  );

}





export async function decreaseStock(
  input: DecreaseStockInput
){

  return await prisma.$transaction(
    async(tx)=>{


      const stock =
        await tx.stock.findUnique({

          where:{
            productId:
              input.productId,
          },

        });



      if(!stock){

        throw new Error(
          "Stock not found"
        );

      }



      if(input.quantity <= 0){

        throw new Error(
          "Quantity must be greater than zero"
        );

      }



      const beforeQty =
        stock.currentQty;


      const afterQty =
        beforeQty - input.quantity;



      if(afterQty < 0){

        throw new Error(
          "Insufficient stock"
        );

      }



      await tx.stock.update({

        where:{
          id:stock.id,
        },

        data:{

          currentQty:
            afterQty,

        },

      });



      return await tx.stockMovement.create({

        data:{

          stockId:
            stock.id,

          productId:
            input.productId,

          userId:
            input.userId,

          movementType:
            "OUT",

          reason:
            input.reason,

          quantity:
            input.quantity,

          beforeQty,

          afterQty,

        },

      });


    }
  );

}





export async function adjustStock(
  input: AdjustStockInput
){

  return await prisma.$transaction(
    async(tx)=>{


      const stock =
        await getOrCreateStock(
          tx,
          input.productId
        );



      const beforeQty =
        stock.currentQty;



      const afterQty =
        input.quantity;



      await tx.stock.update({

        where:{
          id:stock.id,
        },

        data:{

          currentQty:
            afterQty,

          lastAdjustedAt:
            new Date(),

          updatedByUserId:
            input.userId,

        },

      });



      return await tx.stockMovement.create({

        data:{

          stockId:
            stock.id,

          productId:
            input.productId,

          userId:
            input.userId,

          movementType:
            "ADJUST",

          reason:
            input.reason,

          quantity:
            Math.abs(afterQty - beforeQty),

          beforeQty,

          afterQty,

        },

      });


    }
  );

}