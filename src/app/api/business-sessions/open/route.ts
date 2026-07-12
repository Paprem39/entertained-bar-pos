import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


function getThailandDate() {

  const now = new Date();

  const thailandTime = new Intl.DateTimeFormat(
    "en-CA",
    {
      timeZone: "Asia/Bangkok",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }
  ).format(now);


  return new Date(`${thailandTime}T00:00:00+07:00`);

}



export async function POST(request: Request) {

  try {

    const body = await request.json();

    const { userId } = body;


    if (!userId) {

      return NextResponse.json(
        {
          message: "userId is required",
        },
        {
          status: 400,
        }
      );

    }


    const existingSession =
      await prisma.businessSession.findFirst({

        where: {
          status: "OPEN",
        },

      });


    if (existingSession) {

      return NextResponse.json(
        {
          message: "Business session already open",
          sessionId: existingSession.id,
        },
        {
          status: 400,
        }
      );

    }



    const businessDate = getThailandDate();



    const session =
      await prisma.businessSession.create({

        data: {

            businessDate,
          
            openedAt: new Date(),
          
            status: "OPEN",
          
            openedByUserId: userId,
          
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

      });



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