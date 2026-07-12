import { NextRequest, NextResponse } from "next/server";
import { addItemToBill } from "@/service/bill.service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (
      !body.billId ||
      !body.productId ||
      !body.qty ||
      !body.addedByUserId
    ) {
      return NextResponse.json(
        {
          message:
            "Missing required fields: billId, productId, qty, addedByUserId",
        },
        {
          status: 400,
        }
      );
    }

    const item = await addItemToBill({
      billId: body.billId,
      productId: body.productId,
      qty: body.qty,
      mixerProductIds: body.mixerProductIds ?? [],
      addedByUserId: body.addedByUserId,
    });

    return NextResponse.json(item, {
      status: 201,
    });
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