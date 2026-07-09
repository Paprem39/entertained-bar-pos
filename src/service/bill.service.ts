import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";


interface CreateBillInput {

  billName: string;

  createdByUserId: string;

  businessSessionId: string;

}


interface AddItemToBillInput {

  billId: string;

  productId: string;

  mixerProductIds: string[];

  addedByUserId: string;

}



function generateBillNumber(
  date: Date,
  runningNumber: number
) {

  const year =
    date.getFullYear();


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

  return [...mixerProductIds]
    .sort()
    .join("|");

}





async function getNextBillNumber(
  businessSessionId: string
) {

  const count =
    await prisma.bill.count({

      where: {
        businessSessionId,
      },

    });


  return count + 1;

}





async function updateBillTotal(
  tx: Prisma.TransactionClient,
  billId: string
) {


  const result =
    await tx.billItem.aggregate({

      where: {
        billId,
      },

      _sum: {
        lineTotal: true,
      },

    });



  const total =
    result._sum.lineTotal ?? 0;



  await tx.bill.update({

    where: {
      id: billId,
    },

    data: {

      subtotal: total,

      totalAmount: total,

    },

  });

}





export async function createBill(
  input: CreateBillInput
) {


  const now =
    new Date();



  const runningNumber =
    await getNextBillNumber(
      input.businessSessionId
    );



  const billNumber =
    generateBillNumber(
      now,
      runningNumber
    );



  return await prisma.bill.create({

    data: {

      billNumber,


      billName:
        input.billName,


      subtotal: 0,


      totalAmount: 0,


      status: "OPEN",


      createdByUserId:
        input.createdByUserId,


      businessSessionId:
        input.businessSessionId,

    },

  });

}





export async function addItemToBill(
  input: AddItemToBillInput
) {


  return await prisma.$transaction(
    async (tx) => {



      const product =
        await tx.product.findUnique({

          where: {
            id: input.productId,
          },

        });




      if (!product) {

        throw new Error(
          "Product not found"
        );

      }






      /*
        สำคัญ:
        Mixer ทุกชุดต้องมี Signature เดียวกัน

        Soda + Water

        Water + Soda

        ต้องได้ค่าเดียวกัน
      */


      const mixerSignature =
        generateMixerSignature(
          input.mixerProductIds
        );






      const mixers =
        mixerSignature

          ? await tx.product.findMany({

              where: {

                id: {
                  in:
                    mixerSignature.split("|"),
                },

              },

              orderBy: {

                id: "asc",

              },

            })

          : [];







      const existingItem =
        await tx.billItem.findFirst({

          where: {

            billId:
              input.billId,


            productId:
              input.productId,


            mixerSignature,

          },

        });








      if (existingItem) {



        const updatedItem =
          await tx.billItem.update({

            where: {

              id:
                existingItem.id,

            },


            data: {

              qty: {

                increment: 1,

              },


              lineTotal: {

                increment:
                  product.normalPrice,

              },

            },

          });





        await updateBillTotal(
          tx,
          input.billId
        );



        return updatedItem;

      }









      const billItem =
        await tx.billItem.create({

          data: {


            billId:
              input.billId,


            productId:
              product.id,


            productName:
              product.name,


            qty: 1,


            unitPrice:
              product.normalPrice,


            lineTotal:
              product.normalPrice,



            mixerSignature,



            addedByUserId:
              input.addedByUserId,


          },

        });










      if (mixers.length > 0) {


        await tx.billItemMixer.createMany({

          data:

            mixers.map((mixer) => ({


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