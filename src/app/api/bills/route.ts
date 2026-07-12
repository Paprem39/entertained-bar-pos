import { NextRequest, NextResponse } from "next/server";
import {
  createBill,
  getBills,
} from "@/service/bill.service";


export async function GET() {
  try {

    const bills = await getBills();

    return NextResponse.json(
      bills,
      {
        status: 200,
      }
    );

  } catch (error) {

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Internal Server Error",
      },
      {
        status: 500,
      }
    );

  }
}


export async function POST(
  request: NextRequest
) {

  try {

    const body = await request.json();


    if (
      !body.billName ||
      !body.createdByUserId ||
      !body.businessSessionId
    ) {

      return NextResponse.json(
        {
          message:
            "Missing required fields: billName, createdByUserId, businessSessionId",
        },
        {
          status: 400,
        }
      );

    }


    const bill = await createBill({

      billName:
        body.billName,

      createdByUserId:
        body.createdByUserId,

      businessSessionId:
        body.businessSessionId,

    });


    return NextResponse.json(
      bill,
      {
        status: 201,
      }
    );


  } catch (error) {


    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Internal Server Error",
      },
      {
        status: 500,
      }
    );


  }

}