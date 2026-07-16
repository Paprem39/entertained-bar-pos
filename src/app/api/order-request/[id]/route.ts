import { NextRequest, NextResponse } from "next/server";

import { getOrderRequestById } from "@/service/order-request-query.service";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  request: NextRequest,
  { params }: RouteContext,
) {
  try {
    const { id } = await params;

    const orderRequest =
      await getOrderRequestById(id);

    if (!orderRequest) {
      return NextResponse.json(
        {
          success: false,
          message: "Order request not found.",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: orderRequest,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Internal server error.",
      },
      {
        status: 500,
      },
    );
  }
}