import { NextRequest, NextResponse } from "next/server";
import { addItemToBill } from "@/service/bill.service";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ billId: string }> }
) {
  try {

    const { billId } = await params;

    const body = await request.json();

    const result = await addItemToBill({
      billId,
      productId: body.productId,
      qty: body.qty,
      mixerProductIds: body.mixerProductIds,
      addedByUserId: body.addedByUserId,
    });

    return NextResponse.json(result);

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        message: "Internal Server Error",
      },
      {
        status: 500,
      }
    );

  }
}