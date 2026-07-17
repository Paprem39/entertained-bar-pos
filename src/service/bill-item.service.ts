import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { updateBillTotal } from "@/utils/order-request/update-bill-total";

import {
  increaseStock,
  decreaseStock,
} from "@/service/stock.service";



interface UpdateQuantityInput {

  billItemId: string;

  newQuantity: number;

  userId?: string;

}

interface DeleteBillItemInput {

  billItemId: string;

  userId?: string;

}

interface ChangeProductInput {

  billItemId: string;

  newProductId: string;

  userId?: string;

}


// =====================================================
// UPDATE QUANTITY
// =====================================================

export async function updateBillItemQuantity(
  input: UpdateQuantityInput
) {

  return await prisma.$transaction(
    async (tx) => {


      const billItem =
        await tx.billItem.findUnique({

          where:{
            id: input.billItemId,
          },

        });



      if(!billItem){

        throw new Error(
          "Bill item not found"
        );

      }



      if(input.newQuantity <= 0){

        throw new Error(
          "Quantity must be greater than zero"
        );

      }



      const oldQuantity =
        billItem.qty;



      const diff =
        input.newQuantity - oldQuantity;



      // เพิ่มจำนวน
      // ต้องตัด stock เพิ่ม

      if(diff > 0){

        await decreaseStock(
          {
            productId:
              billItem.productId,

            quantity:
              diff,

            reason:
              "SALE",

            userId:
              input.userId,
          },
          tx,
        );

      }



      // ลดจำนวน
      // ต้องคืน stock

      if(diff < 0){

        await increaseStock(
          {
            productId:
              billItem.productId,

            quantity:
              Math.abs(diff),

            reason:
              "RETURN",

            userId:
              input.userId,
          },
          tx,
        );

      }

      const unitPrice =
        billItem.unitPrice;

        const updated =
        await tx.billItem.update({
      
          where:{
            id: billItem.id,
          },
      
          data:{
      
            qty: input.newQuantity,
      
            lineTotal:
              unitPrice.mul(input.newQuantity),
      
          },
      
        });
      
      await updateBillTotal({
        prisma: tx,
        billId: billItem.billId,
      });
      
      return updated;

    }
  );

}



// =====================================================
// DELETE BILL ITEM
// =====================================================

export async function deleteBillItem(
  input: DeleteBillItemInput
){

  return await prisma.$transaction(
    async(tx)=>{


      const billItem =
        await tx.billItem.findUnique({

          where:{
            id:
              input.billItemId,
          },

        });



      if(!billItem){

        throw new Error(
          "Bill item not found"
        );

      }



      // คืน Stock ก่อนลบ

      await increaseStock(
        {
          productId:
            billItem.productId,

          quantity:
            billItem.qty,

          reason:
            "RETURN",

          userId:
            input.userId,
        },
        tx,
      );



      await tx.billItem.delete({

        where:{
          id: billItem.id,
        },
      
      });
      
      await updateBillTotal({
        prisma: tx,
        billId: billItem.billId,
      });
      
      return {
        success:true,
      };


    }
  );

}




// =====================================================
// CHANGE PRODUCT
// =====================================================


export async function changeBillItemProduct(
  input: ChangeProductInput
){

  return await prisma.$transaction(
    async(tx)=>{


      const billItem =
        await tx.billItem.findUnique({

          where:{
            id:
              input.billItemId,
          },

        });



      if(!billItem){

        throw new Error(
          "Bill item not found"
        );

      }



      const newProduct =
        await tx.product.findUnique({

          where:{
            id:
              input.newProductId,
          },

        });



      if(!newProduct){

        throw new Error(
          "New product not found"
        );

      }



      // คืนสินค้าเก่า

      await increaseStock(
        {
          productId:
            billItem.productId,

          quantity:
            billItem.qty,

          reason:
            "RETURN",

          userId:
            input.userId,
        },
        tx,
      );



      // ตัดสินค้าใหม่

      await decreaseStock(
        {
          productId:
            input.newProductId,

          quantity:
            billItem.qty,

          reason:
            "SALE",

          userId:
            input.userId,
        },
        tx,
      );




      const updated =
  await tx.billItem.update({

    where:{
      id: billItem.id,
    },

    data:{

      productId:
        newProduct.id,

      productName:
        newProduct.name,

      unitPrice:
        newProduct.normalPrice,

      lineTotal:
        newProduct.normalPrice.mul(
          billItem.qty
        ),

    },

  });

await updateBillTotal({
  prisma: tx,
  billId: billItem.billId,
});

return updated;

    }
  );

}