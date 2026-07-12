import { NextResponse } from "next/server";
import { getDailyReport } from "@/service/report.service";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ businessSessionId: string }> }
) {
  try {
    const { businessSessionId } = await params;

    const report = await getDailyReport({
      businessSessionId,
    });

    return NextResponse.json(report);

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