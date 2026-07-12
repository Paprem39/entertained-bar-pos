import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
  ) {

  try {
    
    const { id } = await params;

    const product = await prisma.product.findUnique({

      where: {
        id: id,
      },

      select: {

        id: true,
        name: true,
        allowMixer: true,

        availableMixers: {

          select: {

            mixerProduct: {

              select: {

                id: true,
                name: true,

              },

            },

          },

        },

      },

    });


    if (!product) {

      return NextResponse.json(
        {
          message: "Product not found",
        },
        {
          status: 404,
        }
      );

    }


    if (!product.allowMixer) {

      return NextResponse.json(
        {
          message: "This product does not support mixer",
        },
        {
          status: 400,
        }
      );

    }


    const response = {

      product: {

        id: product.id,
        name: product.name,

      },

      mixers: product.availableMixers.map(
        (item) => item.mixerProduct
      ),

    };


    return NextResponse.json(response);


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