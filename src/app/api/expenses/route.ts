import { NextRequest, NextResponse } from "next/server";
import { createExpense } from "@/service/expense.service";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {

    const body = await request.json();

    const result = await createExpense({
      businessSessionId: body.businessSessionId,
      expenseCategoryId: body.expenseCategoryId,
      amount: body.amount,
      note: body.note,
      createdByUserId: body.createdByUserId,
    });

    return NextResponse.json(result, {
      status: 201,
    });

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

export async function GET() {

  try {

    const expenses =
      await prisma.expense.findMany({

        include: {

          expenseCategory: true,

        },

        orderBy: {

          createdAt: "desc",

        },

      });

    return NextResponse.json(expenses);

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