import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const snapshots =
      await prisma.dailyClosingSnapshot.findMany({
        include: {
          businessSession: {
            select: {
              id: true,
              businessDate: true,
              openedAt: true,
              closedAt: true,
              openedBy: {
                select: {
                  id: true,
                  displayName: true,
                },
              },
              closedBy: {
                select: {
                  id: true,
                  displayName: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

    return NextResponse.json(snapshots);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Internal Server Error",
      },
      {
        status: 500,
      },
    );
  }
}