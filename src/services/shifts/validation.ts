import { z } from 'zod';
import { validateTrips } from '../../utils/validation/tripsValidation';

const shiftInputSchema = z.object({
  car_id: z.string().uuid(),
  driver_id: z.string().uuid(),
  start_time: z.string(),
  end_time: z.string(),
  taxi_km: z.number().nonnegative(),
  paid_km: z.number().nonnegative(),
  trips: z.number().refine(
    (val) => validateTrips(val),
    { message: "Antal turer måste vara mellan 1 och 35" }
  ),
  report_nr: z.string().min(1),
  cash: z.number().nonnegative(),
  to_report: z.number().nonnegative(),
  total_credit: z.number().nonnegative(),
  drikskredit: z.number().nonnegative(),
  lonegr_ex_moms: z.number().nonnegative()
});

export function validateShiftInput(data: unknown): ShiftInput {
  try {
    const processedData = {
      ...data,
      taxi_km: Number(data.taxi_km) || 0,
      paid_km: Number(data.paid_km) || 0,
      trips: Number(data.trips) || 0,
      cash: Number(data.cash) || 0,
      to_report: Number(data.to_report) || 0,
      total_credit: Number(data.total_credit) || 0,
      drikskredit: Number(data.drikskredit) || 0,
      lonegr_ex_moms: Number(data.lonegr_ex_moms) || 0,
    };

    console.log('Validating shift data:', processedData);
    const validated = shiftInputSchema.parse(processedData);
    console.log('Validated shift data:', validated);
    return validated;
  } catch (error) {
    console.error('Shift validation error:', error);
    throw error;
  }
}

export function validatePaymentDetails(data: unknown): { 
  amount: number; 
  moms_details: Array<{
    moms_percentage: number;
    brutto: number;
    netto: number;
    moms_kr: number;
  }>;
} | null {
  if (!data || typeof data !== 'object') return null;

  const paymentData = data as any;
  if (!paymentData.amount || !Array.isArray(paymentData.moms_details)) {
    return null;
  }

  return {
    amount: Number(paymentData.amount),
    moms_details: paymentData.moms_details.map(detail => ({
      moms_percentage: Number(detail.moms_percentage),
      brutto: Number(detail.brutto),
      netto: Number(detail.netto),
      moms_kr: Number(detail.moms_kr)
    }))
  };
}

export function hasPaymentDetails(data: unknown): boolean {
  if (!data || typeof data !== 'object') return false;
  
  const paymentData = data as any;
  return !!(
    paymentData.moms_details &&
    Array.isArray(paymentData.moms_details) &&
    paymentData.moms_details.length > 0
  );
}