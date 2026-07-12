import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ billId: string }> }
) {
  try {
    const { billId } = await params;

    const bill = await prisma.bill.findUnique({
      where: {
        id: billId,
      },
      include: {
        items: {
          include: {
            mixers: true,
          },
        },
        payments: true,
      },
    });

    if (!bill) {
      return NextResponse.json(
        { message: "Bill not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(bill);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}