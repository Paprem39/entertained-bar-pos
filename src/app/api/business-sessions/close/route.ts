import { NextRequest, NextResponse } from "next/server";
import { closeBusinessSession } from "@/service/business-session.service";


export async function POST(
  request: NextRequest
) {

  try {

    const body =
      await request.json();


    const {
      businessSessionId,
      closedByUserId,
    } = body;


    if (
      !businessSessionId ||
      !closedByUserId
    ) {

      return NextResponse.json(
        {
          message:
            "businessSessionId and closedByUserId are required",
        },
        {
          status: 400,
        }
      );

    }


    await closeBusinessSession({

      businessSessionId,

      closedByUserId,

    });


    return NextResponse.json({

      message:
        "Business session closed successfully",

    });


  } catch(error) {


    console.error(error);


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