import { NextResponse } from "next/server";

import {
  getPendingOrderRequests,
  getPendingOrderRequestCount,
} from "@/service/order-request-query.service";

export async function GET() {
  try {
    const [count, orderRequests] = await Promise.all([
      getPendingOrderRequestCount(),
      getPendingOrderRequests(),
    ]);

    return NextResponse.json(
      {
        success: true,
        count,
        data: orderRequests,
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