import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


export async function GET() {

  try {

    const session = await prisma.businessSession.findFirst({

      where: {
        status: "OPEN",
      },

      select: {

        id: true,

        businessDate: true,

        status: true,

        openedAt: true,

        openedBy: {

          select: {

            id: true,
            displayName: true,

          },

        },

      },

      orderBy: {

        openedAt: "desc",

      },

    });


    if (!session) {

      return NextResponse.json(
        {
          message: "No active business session",
        },
        {
          status: 404,
        }
      );

    }


    return NextResponse.json(session);


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