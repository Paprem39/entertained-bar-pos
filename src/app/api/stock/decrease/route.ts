import { NextRequest, NextResponse } from "next/server";
import { decreaseStock } from "@/service/stock.service";


export async function POST(
  request: NextRequest
) {

  try {

    const body =
      await request.json();


    const result =
      await decreaseStock({

        productId:
          body.productId,

        quantity:
          body.quantity,

        reason:
          body.reason,

        userId:
          body.userId,

      });


    return NextResponse.json(
      result,
      {
        status: 201,
      }
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
        status:400,
      }
    );

  }

}