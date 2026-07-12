import { NextRequest, NextResponse } from "next/server";
import { receivePayment } from "@/service/payment.service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const paymentMethods = [
      "CASH",
      "TRANSFER",
    ];
    
    if (
      !paymentMethods.includes(
        body.paymentMethod
      )
    ) {
    
      return NextResponse.json(
        {
          message:
            "Invalid payment method",
        },
        {
          status: 400,
        }
      );
    
    }

    if (
      !body.billId ||
      !body.paymentMethod ||
      !body.receivedByUserId
    ) {
    
      return NextResponse.json(
        {
          message:
            "billId, paymentMethod and receivedByUserId are required",
        },
        {
          status: 400,
        }
      );
    
    }

    if (
      body.paymentMethod === "CASH" &&
      body.receivedAmount == null
    ) {
    
      return NextResponse.json(
        {
          message:
            "receivedAmount is required for cash payment",
        },
        {
          status: 400,
        }
      );
    
    }

    const result = await receivePayment({
      billId: body.billId,
      paymentMethod: body.paymentMethod,
      receivedAmount: body.receivedAmount,
      paymentNote: body.paymentNote,
      receivedByUserId: body.receivedByUserId,
    });

    return NextResponse.json(result, {
      status: 201,
    });

  } catch (error) {

    console.error(error);
  
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