import { NextRequest, NextResponse } from "next/server";
import { cancelBill } from "@/service/bill.service";

interface Params {
  params: Promise<{
    id: string;
  }>;
}

export async function POST(
  request: NextRequest,
  { params }: Params,
) {
  try {

    const body = await request.json();

    const { id } = await params;

    if (!body.cancelledByUserId) {

      return NextResponse.json(
        {
          message:
            "cancelledByUserId is required",
        },
        {
          status: 400,
        },
      );

    }

    const result =
      await cancelBill({

        billId: id,

        cancelledByUserId:
          body.cancelledByUserId,

      });

    return NextResponse.json(
      result,
      {
        status: 200,
      },
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
      },
    );

  }
}