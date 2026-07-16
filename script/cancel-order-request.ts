import { cancelOrderRequest } from "@/service/order-request.service";

async function main() {
  const result = await cancelOrderRequest({
    orderRequestId: "cmrmsnba40000twvi8mf1xdbb",
    requestedByUserId: "cmrcpmjfx000278vih39wb24c",
  });

  console.dir(result, {
    depth: null,
  });
}

main()
  .catch(console.error)
  .finally(() => process.exit());