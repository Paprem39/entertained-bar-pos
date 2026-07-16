import { createOrderRequest } from "@/service/order-request.service";

async function main() {
  const result = await createOrderRequest({
    billId: "cmrmsa91u00000kvihfo9yr4y",

    requestedByUserId: "cmrcpmjfx000278vih39wb24c",

    note: "Test Order Request",

    items: [
      {
        productId: "cmrcpmkkt000l78viq7immtza",

        quantity: 2,

        mixers: [
          {
            mixerProductId: "cmrcpmlhq000y78viu7bwiit0",
          },
        ],
      },
    ],
  });

  console.dir(result, {
    depth: null,
  });
}

main()
  .catch(console.error)
  .finally(() => process.exit());