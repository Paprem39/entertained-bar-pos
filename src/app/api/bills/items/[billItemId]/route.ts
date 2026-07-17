import { NextRequest, NextResponse } from "next/server";

import {
  updateBillItemQuantity,
  deleteBillItem,
  changeBillItemProduct,
} from "@/service/bill-item.service";



interface Params {

  params: Promise<{
    billItemId: string;
  }>;

}



// =====================================================
// PATCH
// Update Quantity / Change Product
// =====================================================

export async function PATCH(
  request: NextRequest,
  { params }: Params,
) {

  try {

    const { billItemId } =
      await params;


    const body =
      await request.json();



    // =============================
    // Change Product
    // =============================

    if (body.newProductId) {


      const result =
        await changeBillItemProduct({

          billItemId,

          newProductId:
            body.newProductId,

          userId:
            body.userId,

        });



      return NextResponse.json(
        result,
        {
          status: 200,
        },
      );

    }



    // =============================
    // Update Quantity
    // =============================

    if (body.newQuantity == null) {


      return NextResponse.json(
        {
          message:
            "newQuantity or newProductId is required",
        },
        {
          status:400,
        },
      );

    }



    const result =
      await updateBillItemQuantity({

        billItemId,

        newQuantity:
          body.newQuantity,

        userId:
          body.userId,

      });



    return NextResponse.json(
      result,
      {
        status:200,
      },
    );



  } catch(error) {


    console.error(error);


    return NextResponse.json(

      {
        message:
          error instanceof Error
            ? error.message
            : "Internal Server Error",
      },

      {
        status:500,
      },

    );

  }

}






// =====================================================
// DELETE
// Delete Bill Item
// =====================================================

export async function DELETE(
  request: NextRequest,
  { params }: Params,
) {

  try {


    const { billItemId } =
      await params;


    const body =
      await request.json();



    const result =
      await deleteBillItem({

        billItemId,

        userId:
          body.userId,

      });



    return NextResponse.json(
      result,
      {
        status:200,
      },
    );



  } catch(error) {


    console.error(error);


    return NextResponse.json(

      {
        message:
          error instanceof Error
            ? error.message
            : "Internal Server Error",
      },

      {
        status:500,
      },

    );

  }

}