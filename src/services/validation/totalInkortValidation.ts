import { z } from 'zod';

const momsDetailSchema = z.object({
  moms_percentage: z.number().nonnegative(),
  brutto: z.number().nonnegative(),
  netto: z.number().nonnegative(),
  moms_kr: z.number().nonnegative()
});

export const totalInkortDetailSchema = z.object({
  shift_id: z.string().uuid(),
  total_inkort: z.number().nonnegative(),
  moms_percentage: z.number().nonnegative(),
  brutto: z.number().nonnegative(),
  netto: z.number().nonnegative(),
  moms_kr: z.number().nonnegative()
});

export type TotalInkortDetailData = z.infer<typeof totalInkortDetailSchema>;
export type MomsDetailData = z.infer<typeof momsDetailSchema>;

export function validateTotalInkortDetails(data: unknown): TotalInkortDetailData[] {
  try {
    if (!data || !Array.isArray(data)) {
      throw new Error('Invalid total inkört details format');
    }

    return data.map(detail => {
      const validated = totalInkortDetailSchema.parse({
        ...detail,
        total_inkort: Number(detail.total_inkort) || 0,
        moms_percentage: Number(detail.moms_percentage) || 0,
        brutto: Number(detail.brutto) || 0,
        netto: Number(detail.netto) || 0,
        moms_kr: Number(detail.moms_kr) || 0
      });
      return validated;
    });
  } catch (error) {
    console.error('Total inkört validation error:', error);
    throw error;
  }
}

export function transformTotalInkortData(rawData: any, shiftId: string): TotalInkortDetailData[] {
  if (!rawData?.moms_details?.length) {
    return [];
  }

  return rawData.moms_details.map((detail: any) => ({
    shift_id: shiftId,
    total_inkort: Number(rawData.total_inkort) || 0,
    moms_percentage: Number(detail.moms_percentage) || 0,
    brutto: Number(detail.brutto) || 0,
    netto: Number(detail.netto) || 0,
    moms_kr: Number(detail.moms_kr) || 0
  }));
}