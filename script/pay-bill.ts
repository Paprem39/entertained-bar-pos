import { receivePayment } from "@/service/payment.service";

async function main() {
  const result = await receivePayment({
    billId: "cmrmsa91u00000kvihfo9yr4y",
    paymentMethod: "CASH",
    receivedAmount: 500,
    receivedByUserId: "cmrcpmjaa000178viat9qd51j",
  });

  console.dir(result, { depth: null });
}

main()
  .catch(console.error)
  .finally(() => process.exit());