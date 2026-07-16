import { NextRequest, NextResponse } from "next/server";

import { getMyPendingOrderRequests } from "@/service/order-request-query.service";

export async function GET(request: NextRequest) {
  try {
    const requestedByUserId =
      request.nextUrl.searchParams.get("requestedByUserId");

    if (!requestedByUserId) {
      return NextResponse.json(
        {
          success: false,
          message: "requestedByUserId is required.",
        },
        {
          status: 400,
        },
      );
    }

    const orderRequests =
      await getMyPendingOrderRequests(requestedByUserId);

    return NextResponse.json(
      {
        success: true,
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