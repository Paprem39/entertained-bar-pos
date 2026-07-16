import { approveOrderRequest } from "@/service/order-request.service";

async function main() {
  const result = await approveOrderRequest({
    orderRequestId: "cmrmsg37x0000q4vizu9t32ra",

    approvedByUserId: "cmrcpmjaa000178viat9qd51j",
  });

  console.dir(result, {
    depth: null,
  });
}

main()
  .catch(console.error)
  .finally(() => process.exit());