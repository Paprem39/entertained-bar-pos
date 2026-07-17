import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import {decreaseStock, increaseStock,} from "@/service/stock.service";

interface CreateBillInput {
  billName: string;
  createdByUserId: string;
  businessSessionId: string;
}


interface AddItemToBillInput {
  billId: string;
  productId: string;
  qty: number;
  mixerProductIds: string[];
  addedByUserId: string;
}

interface CancelBillInput {

  billId: string;

  cancelledByUserId: string;

}


function generateBillNumber(
  date: Date,
  runningNumber: number
) {

  const year = date.getFullYear();

  const month =
    String(date.getMonth() + 1)
      .padStart(2, "0");

  const day =
    String(date.getDate())
      .padStart(2, "0");

  const running =
    String(runningNumber)
      .padStart(3, "0");


  return `${year}${month}${day}-${running}`;
}



function generateMixerSignature(
  mixerProductIds: string[]
) {

  if(mixerProductIds.length === 0){
    return "";
  }


  return [...mixerProductIds]
    .sort()
    .join("|");

}

async function getNextBillNumber(
  businessSessionId: string
) {

  const lastBill =
    await prisma.bill.findFirst({

      where: {
        businessSessionId,
      },

      orderBy: {
        billNumber: "desc",
      },

      select: {
        billNumber: true,
      },

    });

  if (!lastBill) {
    return 1;
  }

  const runningNumber =
    Number(
      lastBill.billNumber.split("-")[1]
    );

  return runningNumber + 1;

}



async function updateBillTotal(
  tx: Prisma.TransactionClient,
  billId:string
){

  const result =
    await tx.billItem.aggregate({

      where:{
        billId,
      },

      _sum:{
        lineTotal:true,
      },

    });


  const total =
    result._sum.lineTotal ?? 0;


  await tx.bill.update({

    where:{
      id:billId,
    },

    data:{
      subtotal:total,
      totalAmount:total,
    },

  });

}




export async function createBill(
  input:CreateBillInput
){


  const session =
  await prisma.businessSession.findUnique({

    where:{
      id:input.businessSessionId,
    },

    select:{
      status:true,
      businessDate:true,
    },

  });



  if(!session){
    throw new Error(
      "Business session not found"
    );
  }



  if(session.status !== "OPEN"){
    throw new Error(
      "Business session is closed"
    );
  }




  const user =
    await prisma.user.findUnique({

      where:{
        id:input.createdByUserId,
      },

      select:{
        id:true,
        isActive:true,
        role:true,
      },

    });



  if(!user){
    throw new Error(
      "User not found"
    );
  }



  if(!user.isActive){
    throw new Error(
      "User is inactive"
    );
  }



  if(user.role === "STAFF"){
    throw new Error(
      "Staff cannot create bill"
    );
  }




  const runningNumber =
    await getNextBillNumber(
      input.businessSessionId
    );



    const billNumber =
    generateBillNumber(
        session.businessDate,
        runningNumber
    );



  return await prisma.bill.create({

    data:{

      billNumber,

      billName:
        input.billName,

      subtotal:0,

      totalAmount:0,

      status:"OPEN",

      createdByUserId:
        input.createdByUserId,

      businessSessionId:
        input.businessSessionId,

    },

  });

}





export async function addItemToBill(
  input:AddItemToBillInput
){


  if(input.qty <= 0){
    throw new Error(
      "Quantity must be greater than zero"
    );
  }



  return await prisma.$transaction(
    async(tx)=>{


      const bill =
  await tx.bill.findUnique({

    where: {
      id: input.billId,
    },

    select: {

      status: true,

      businessSession: {

        select: {
          status: true,
        },

      },

    },

  });



      if(!bill){
        throw new Error(
          "Bill not found"
        );
      }



      if(bill.status !== "OPEN"){
        throw new Error(
          "Bill is not open"
        );
      }

      if (bill.businessSession.status !== "OPEN") {

        throw new Error(
          "Business session is closed"
        );
      
      }

      const product =
        await tx.product.findUnique({

          where:{
            id:input.productId,
          },

          include:{

            availableMixers:{

              include:{

                mixerProduct:{
                  select:{
                    id:true,
                    name:true,
                  },
                },

              },

            },

          },

        });



      if(!product){
        throw new Error(
          "Product not found"
        );
      }



      if(!product.isActive){
        throw new Error(
          "Product is inactive"
        );
      }




      const mixerSignature =
        generateMixerSignature(
          input.mixerProductIds
        );



      if(input.mixerProductIds.length > 0){


        if(!product.allowMixer){

          throw new Error(
            "This product does not support mixer"
          );

        }



        const allowedMixerIds =
          product.availableMixers.map(
            (item)=>
              item.mixerProductId
          );



        const invalidMixers =
          input.mixerProductIds.filter(
            id =>
              !allowedMixerIds.includes(id)
          );



        if(invalidMixers.length > 0){

          throw new Error(
            "Invalid mixer selected"
          );

        }

      }





      const selectedMixers =
        product.availableMixers
          .filter(item =>
            input.mixerProductIds.includes(
              item.mixerProduct.id
            )
          )
          .map(item =>
            item.mixerProduct
          );





      const existingItem =
        await tx.billItem.findFirst({

          where:{

            billId:
              input.billId,

            productId:
              input.productId,

            mixerSignature,

          },

        });





      const lineTotal =
        product.normalPrice.mul(
          input.qty
        );




      if(existingItem){

        const updated =
          await tx.billItem.update({

            where:{
              id:existingItem.id,
            },

            data:{

              qty:{
                increment:input.qty,
              },

              lineTotal:{
                increment:lineTotal,
              },

            },

          });

          await decreaseStock(
            {
              productId: product.id,
              quantity: input.qty,
              reason: "SALE",
              userId: input.addedByUserId,
              referenceType: "Bill",
              referenceId: input.billId,
            },
            tx,
          );



        await updateBillTotal(
          tx,
          input.billId
        );



        return updated;

      }

      const billItem =
        await tx.billItem.create({

          data:{

            billId:
              input.billId,

            productId:
              product.id,

            productName:
              product.name,

            qty:
              input.qty,

            unitPrice:
              product.normalPrice,

            lineTotal,

            mixerSignature,

            addedByUserId:
              input.addedByUserId,

          },

        });

        await decreaseStock(
          {
            productId: product.id,
  
            quantity: input.qty,
  
            reason: "SALE",
  
            userId: input.addedByUserId,
  
            referenceType: "Bill",
  
            referenceId: input.billId,
  
          },
          tx,
        );

      if(selectedMixers.length > 0){


        await tx.billItemMixer.createMany({

          data:

            selectedMixers.map(mixer=>({

              billItemId:
                billItem.id,

              productId:
                product.id,

              mixerProductId:
                mixer.id,

              mixerName:
                mixer.name,

            })),

        });


      }

      await updateBillTotal(
        tx,
        input.billId
      );



      return billItem;


    }
  );

}

export async function getBills(){


  return await prisma.bill.findMany({

    orderBy:{
      createdAt:"desc",
    },


    include:{

      items:{

        include:{
          mixers:true,
        },

      },


      payments:true,

    },

  });

}

export async function cancelBill(
  input: CancelBillInput
) {

  return await prisma.$transaction(
    async (tx) => {

      const bill =
        await tx.bill.findUnique({

          where: {
            id: input.billId,
          },

          include: {
            items: true,
          },

        });

      if (!bill) {

        throw new Error(
          "Bill not found"
        );

      }

      if (bill.status !== "OPEN") {

        throw new Error(
          "Only open bill can be cancelled"
        );

      }

      for (const item of bill.items) {

        await increaseStock(
          {

            productId:
              item.productId,

            quantity:
              item.qty,

            reason:
              "RETURN",

            userId:
              input.cancelledByUserId,

            referenceType:
              "Bill",

            referenceId:
              bill.id,

          },
          tx,
        );

      }

      await tx.bill.update({

        where: {
          id: bill.id,
        },

        data: {

          status: "CANCELLED",

          closedAt:
            new Date(),

        },

      });

      await tx.auditLog.create({

        data: {

          userId:
            input.cancelledByUserId,

            action:
            "UPDATE",

          entityType:
            "Bill",

          entityId:
            bill.id,

          targetName:
            bill.billNumber,

          description:
            "Cancel bill",

        },

      });

      return {
        success: true,
      };

    },
  );

}