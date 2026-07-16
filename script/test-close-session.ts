import { closeBusinessSession } from "@/service/close-session.service";

async function main() {
  const result = await closeBusinessSession({
    businessSessionId: "cmrngm6s500003wviw9x0y5by",
    closedByUserId: "cmrcpmjaa000178viat9qd51j",
  });

  console.dir(result, {
    depth: null,
  });
}

main()
  .catch(console.error)
  .finally(() => process.exit());