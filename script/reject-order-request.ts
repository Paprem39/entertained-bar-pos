import { rejectOrderRequest } from "@/service/order-request.service";

async function main() {
  const result = await rejectOrderRequest({
    orderRequestId: "cmrmss76h00008sviduygrdz4",

    approvedByUserId: "cmrcpmjaa000178viat9qd51j",

    reason: "Out of stock",
  });

  console.dir(result, {
    depth: null,
  });
}

main()
  .catch(console.error)
  .finally(() => process.exit());