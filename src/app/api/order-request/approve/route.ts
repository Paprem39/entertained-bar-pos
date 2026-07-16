import { NextRequest, NextResponse } from "next/server";

import { approveOrderRequest } from "@/service/order-request.service";

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();

    const orderRequest = await approveOrderRequest(body);

    return NextResponse.json(
      {
        success: true,
        message: "Order request approved successfully.",
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
        status: 400,
      },
    );
  }
}