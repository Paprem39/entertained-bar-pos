// src/utils/order-request/build-mixer-signature.ts

export function buildMixerSignature(
  mixerProductIds: string[],
): string {

  if (mixerProductIds.length === 0) {
    return "";
  }


  return [...mixerProductIds]
    .map((id) => id.trim())
    .filter((id) => id.length > 0)
    .sort((a, b) => a.localeCompare(b))
    .join("|");

}