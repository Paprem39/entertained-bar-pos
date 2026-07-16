import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";


interface CreateExpenseInput {

  businessSessionId: string;

  expenseCategoryId: string;

  amount: Prisma.Decimal | number;

  note?: string;

  createdByUserId: string;

}



export async function createExpense(
  input: CreateExpenseInput
) {


  return await prisma.$transaction(
    async (tx) => {


      const session =
        await tx.businessSession.findUnique({

          where: {
            id: input.businessSessionId,
          },

        });



      if (!session) {

        throw new Error(
          "Business session not found"
        );

      }



      if (session.status !== "OPEN") {

        throw new Error(
          "Business session is closed"
        );

      }



      const category =
        await tx.expenseCategory.findUnique({

          where: {
            id: input.expenseCategoryId,
          },

        });

        const user =
  await tx.user.findUnique({

    where:{
      id: input.createdByUserId,
    },

    select:{
      id:true,
      role:true,
      isActive:true,
    },

  });



if(!user){

  throw new Error(
    "User not found"
  );

}



if(!user.isActive){

  throw new Error(
    "User is inactive"
  );

}



if(
  user.role === "STAFF"
){

  throw new Error(
    "Staff cannot create expense"
  );

}



      if (!category) {

        throw new Error(
          "Expense category not found"
        );

      }

      const amount =
  new Prisma.Decimal(
    input.amount
  );


if(
  amount.lessThanOrEqualTo(0)
){

  throw new Error(
    "Expense amount must be greater than zero"
  );

}



      const expense =
        await tx.expense.create({

          data: {

            businessSessionId:
              input.businessSessionId,


            expenseCategoryId:
              input.expenseCategoryId,


              amount:
              amount,


            note:
              input.note,

            expenseDate:
                new Date(),


            createdByUserId:
              input.createdByUserId,

          },

        });



      await tx.auditLog.create({

        data: {

          userId:
            input.createdByUserId,


          action:
            "CREATE",


          entityType:
            "Expense",


          entityId:
            expense.id,


          targetName:
            category.name,


          description:
            `Create expense ${category.name}`,

        },

      });



      return expense;


    }
  );


}