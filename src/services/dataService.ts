import { supabase } from '../lib/supabase';
import { ExtractedData } from '../types';

export async function saveShiftData(data: ExtractedData) {
  const { data: company } = await supabase
    .from('Companies')
    .select('id')
    .eq('org_nr', data.org_nr)
    .single();

  if (!company) {
    throw new Error('Company not found');
  }

  const { data: car } = await supabase
    .from('Cars')
    .select('id')
    .eq('reg_nr', data.reg_nr)
    .single();

  if (!car) {
    throw new Error('Car not found');
  }

  const { data: driver } = await supabase
    .from('Drivers')
    .select('id')
    .eq('driver_id', data.driver_id)
    .single();

  if (!driver) {
    throw new Error('Driver not found');
  }

  const { data: shift, error: shiftError } = await supabase
    .from('Shifts')
    .insert({
      car_id: car.id,
      driver_id: driver.id,
      start_time: data.start_time,
      end_time: data.end_time,
      taxi_km: data.taxi_km,
      paid_km: data.paid_km,
      trips: data.trips,
      report_nr: data.report_nr,
      bom_avbest: data.bom_avbest,
      total_income: data.total_income,
      cash: data.cash,
      to_report: data.to_report,
      total_credit: data.total_credit,
      lonegr_ex_moms: data.longegr_ex_moms
    })
    .select()
    .single();

  if (shiftError) {
    throw shiftError;
  }

  if (data.vat_details && data.vat_details.length > 0) {
    const vatDetailsToInsert = data.vat_details.map(detail => ({
      shift_id: shift.id,
      vat_rate: detail.vat_rate,
      gross_income: detail.gross_income,
      net_income: detail.net_income,
      vat_amount: detail.vat_amount
    }));

    const { error: vatError } = await supabase
      .from('VAT_Details')
      .insert(vatDetailsToInsert);

    if (vatError) {
      throw vatError;
    }
  }

  return shift;
}