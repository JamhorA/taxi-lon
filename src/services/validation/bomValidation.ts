import { z } from 'zod';

export const bomDetailSchema = z.object({
  shift_id: z.string().uuid(),
  moms_percentage: z.number().nonnegative(),
  brutto: z.number().nonnegative(),
  netto: z.number().nonnegative(),
  moms_kr: z.number().nonnegative()
});

export type BomDetailData = z.infer<typeof bomDetailSchema>;

export function validateBomDetails(data: unknown): BomDetailData[] | null {
  // If data is null, undefined, or empty array, return null
  if (!data || (Array.isArray(data) && data.length === 0)) {
    return null;
  }

  try {
    return z.array(bomDetailSchema).parse(data);
  } catch (error) {
    console.error('BOM details validation error:', error);
    throw error;
  }
}

export function hasBomDetails(data: unknown): boolean {
  if (!data || typeof data !== 'object') return false;
  
  const bomData = data as Record<string, unknown>;
  return !!(
    bomData.varav_bom_avbest_details?.moms_details &&
    Array.isArray(bomData.varav_bom_avbest_details.moms_details) &&
    bomData.varav_bom_avbest_details.moms_details.length > 0
  );
}