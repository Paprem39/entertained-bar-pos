// src/utils/order-request/build-mixer-signature.ts

export function buildMixerSignature(
    mixerNames: string[],
  ): string {
  
    if (mixerNames.length === 0) {
      return "";
    }
  
    return [...mixerNames]
      .map((name) => name.trim())
      .filter((name) => name.length > 0)
      .sort((a, b) => a.localeCompare(b))
      .join("|");
  }