import { cancelOrderRequest } from "@/service/order-request.service";

async function main() {
  const result = await cancelOrderRequest({
    orderRequestId: "cmrmsy8g90000dgvij2fyuvpo",

    requestedByUserId: "cmrcpmjfx000278vih39wb24c",
  });

  console.dir(result, {
    depth: null,
  });
}

main()
  .catch(console.error)
  .finally(() => process.exit());