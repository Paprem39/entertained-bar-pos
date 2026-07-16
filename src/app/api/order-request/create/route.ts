import { NextRequest, NextResponse } from "next/server";

import { createOrderRequest } from "@/service/order-request.service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const orderRequest = await createOrderRequest(body);

    return NextResponse.json(
      {
        success: true,
        message: "Order request created successfully.",
        data: orderRequest,
      },
      {
        status: 201,
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