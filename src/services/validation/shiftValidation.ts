import { z } from 'zod';

const vatDetailSchema = z.object({
  moms_percentage: z.number().nonnegative(),
  brutto: z.number().nonnegative(),
  netto: z.number().nonnegative(),
  moms_kr: z.number().nonnegative()
});

const shiftSchema = z.object({
  org_nr: z.string().min(1),
  regnr: z.string().min(1),
  forarid: z.string().min(1),
  start_time: z.string().min(1),
  end_time: z.string().min(1),
  taxitrafik_km: z.number().nonnegative(),
  betalda_km: z.number().nonnegative(),
  turer: z.number().nonnegative(),
  drosknr: z.string().min(1),
  rapportnr: z.string().min(1),
  kontant: z.number().nonnegative(),
  total_kredit: z.number().nonnegative(),
  drikskredit: z.number().nonnegative(),
  att_redovisa: z.number().nonnegative(),
  lonegr_ex_moms: z.number().nonnegative(),
  kontant_details: z.object({
    moms_details: z.array(vatDetailSchema)
  }).optional(),
  kredit_details: z.object({
    moms_details: z.array(vatDetailSchema)
  }).optional(),
  total_inkort_details: z.object({
    total_inkort: z.number().nonnegative(),
    moms_details: z.array(vatDetailSchema)
  }).optional(),
  varav_bom_avbest_details: z.object({
    moms_details: z.array(vatDetailSchema)
  }).optional()
});

export type ShiftData = z.infer<typeof shiftSchema>;

export function validateShiftData(data: unknown): ShiftData {
  return shiftSchema.parse(data);
}