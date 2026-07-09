import { prisma } from "@/lib/prisma";


export async function getProductWithMixers(
  productName: string
) {

  const product = await prisma.product.findUnique({

    where: {
      name: productName,
    },

    include: {

      availableMixers: {

        include: {

          mixerProduct: true,

        },

      },

    },

  });


  if (!product) {

    throw new Error(
      `Product ${productName} not found`
    );

  }


  return {

    id: product.id,

    name: product.name,

    price: Number(product.normalPrice),

    mixers: product.availableMixers.map(
      (item) =>
        ({
          id: item.mixerProduct.id,
          name: item.mixerProduct.name,
        })
    ),

  };

}