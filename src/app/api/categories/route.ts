import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {

    const categories = await prisma.category.findMany({

      where: {
        isActive: true,
      },

      select: {
        id: true,
        name: true,
        icon: true,
        color: true,
      },

      orderBy: {
        sortOrder: "asc",
      },

    });


    return NextResponse.json(categories);


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