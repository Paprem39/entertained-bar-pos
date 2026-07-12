import { NextRequest, NextResponse } from "next/server";
import { markBillAsCredit } from "@/service/credit-bill.service";


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      billId,
      markedByUserId,
    } = body;


    // Validate Request
    if (!billId || !markedByUserId) {
      return NextResponse.json(
        {
          success: false,
          message: "billId and markedByUserId are required",
        },
        {
          status: 400,
        }
      );
    }


    // Call Service
    const bill = await markBillAsCredit({
      billId,
      markedByUserId,
    });


    return NextResponse.json(
      {
        success: true,
        message: "Bill marked as credit successfully",
        bill,
      },
      {
        status: 200,
      }
    );


  } catch (error) {

    console.error("MARK CREDIT ERROR:", error);


    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong",
      },
      {
        status: 400,
      }
    );

  }
}