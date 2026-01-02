// src/lib/generatePropertyCode.ts

export async function generatePropertyCode(purpose: string) {
  const prefix = purpose
    .trim()
    .charAt(0)
    .toUpperCase();

  // Example: S-1704279123456
  return `${prefix}-${Date.now()}`;
}
