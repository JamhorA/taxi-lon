import { z } from 'zod';

const momsDetailSchema = z.object({
  moms_percentage: z.number().nonnegative(),
  brutto: z.number().nonnegative(),
  netto: z.number().nonnegative(),
  moms_kr: z.number().nonnegative()
});

const paymentDetailSchema = z.object({
  amount: z.number().nonnegative(),
  moms_details: z.array(momsDetailSchema)
});

export type PaymentDetail = z.infer<typeof paymentDetailSchema>;
export type MomsDetail = z.infer<typeof momsDetailSchema>;

export function validatePaymentDetails(data: unknown): PaymentDetail | null {
  if (!data || typeof data !== 'object') return null;

  try {
    return paymentDetailSchema.parse(data);
  } catch (error) {
    console.error('Payment details validation error:', error);
    return null;
  }
}

export function hasPaymentDetails(data: unknown): boolean {
  if (!data || typeof data !== 'object') return false;
  
  const paymentData = data as Record<string, unknown>;
  return !!(
    paymentData.moms_details &&
    Array.isArray(paymentData.moms_details) &&
    paymentData.moms_details.length > 0
  );
}