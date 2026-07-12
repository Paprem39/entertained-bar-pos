import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
      },

      select: {
        id: true,
        name: true,
        normalPrice: true,
        tournamentPrice: true,
        allowMixer: true,

        category: {
          select: {
            id: true,
            name: true,
            icon: true,
            color: true,
          },
        },
      },

      orderBy: [
        {
          category: {
            sortOrder: "asc",
          },
        },
        {
          name: "asc",
        },
      ],
    });

    return NextResponse.json(products);

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