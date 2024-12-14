import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';

interface ShiftData {
  car_id: string;
  driver_id: string;
  start_time: string;
  end_time: string;
  taxi_km: number;
  paid_km: number;
  trips: number;
  report_nr: string;
  cash: number;
  to_report: number;
  total_credit: number;
  drikskredit: number;
  lonegr_ex_moms: number;
}

export async function saveShift(rawData: any) {
  try {
    console.log('Starting shift save process with raw data:', rawData);

    // 1. Find company
    const { data: company } = await supabase
      .from('Companies')
      .select('id')
      .eq('org_nr', rawData.org_nr)
      .single();

    if (!company) {
      throw new Error(`Company with org number ${rawData.org_nr} not found`);
    }

    // 2. Find car
    const { data: car } = await supabase
      .from('Cars')
      .select('id')
      .eq('regnr', rawData.regnr)
      .eq('drosknr', rawData.drosknr)
      .single();

    if (!car) {
      throw new Error(`Car with registration ${rawData.regnr} and drosk number ${rawData.drosknr} not found`);
    }

    // 3. Find driver
    const { data: driver } = await supabase
      .from('Drivers')
      .select('id')
      .eq('forarid', rawData.forarid)
      .single();

    if (!driver) {
      throw new Error(`Driver with ID ${rawData.forarid} not found`);
    }

    // 4. Create shift with explicit lonegr_ex_moms handling
    const shiftData: ShiftData = {
      car_id: car.id,
      driver_id: driver.id,
      start_time: rawData.starttid,
      end_time: rawData.sluttid,
      taxi_km: Number(rawData.taxitrafik_km) || 0,
      paid_km: Number(rawData.betalda_km) || 0,
      trips: Number(rawData.turer) || 0,
      report_nr: rawData.rapportnr,
      cash: Number(rawData.kontant) || 0,
      to_report: Number(rawData.att_redovisa) || 0,
      total_credit: Number(rawData.total_kredit) || 0,
      drikskredit: Number(rawData.drikskredit) || 0,
      lonegr_ex_moms: Number(rawData.lonegr_ex_moms) || 0
    };
    console.log('Raw lonegr_ex_moms:', rawData.lonegr_ex_moms);
    console.log('Converted lonegr_ex_moms:', shiftData.lonegr_ex_moms);
    
    console.log('Prepared shift data for insert:', shiftData);

    const { data: shift, error: shiftError } = await supabase
      .from('Shifts')
      .insert(shiftData)
      .select()
      .single();

    if (shiftError) throw shiftError;

    // 5. Save VAT details for kontant if they exist
    if (rawData.kontant_details?.moms_details?.length > 0) {
      const vatDetails = rawData.kontant_details.moms_details.map((detail: any) => ({
        shift_id: shift.id,
        vat_rate: Number(detail.moms_percentage),
        gross_income: Number(detail.brutto),
        net_income: Number(detail.netto),
        vat_amount: Number(detail.moms_kr),
        type: 'kontant'
      }));

      const { error: vatError } = await supabase
        .from('VAT_Details')
        .insert(vatDetails);

      if (vatError) throw vatError;
    }

    // 6. Save VAT details for kredit if they exist
    if (rawData.kredit_details?.moms_details?.length > 0) {
      const vatDetails = rawData.kredit_details.moms_details.map((detail: any) => ({
        shift_id: shift.id,
        vat_rate: Number(detail.moms_percentage),
        gross_income: Number(detail.brutto),
        net_income: Number(detail.netto),
        vat_amount: Number(detail.moms_kr),
        type: 'kredit'
      }));

      const { error: vatError } = await supabase
        .from('VAT_Details')
        .insert(vatDetails);

      if (vatError) throw vatError;
    }

    // 7. Save total inkört details if they exist
    if (rawData.total_inkort_details?.moms_details?.length > 0) {
      const totalInkortDetails = rawData.total_inkort_details.moms_details.map((detail: any) => ({
        shift_id: shift.id,
        total_inkort: Number(rawData.total_inkort_details.total_inkort),
        moms_percentage: Number(detail.moms_percentage),
        brutto: Number(detail.brutto),
        netto: Number(detail.netto),
        moms_kr: Number(detail.moms_kr)
      }));

      const { error: totalInkortError } = await supabase
        .from('Total_Inkort_Details')
        .insert(totalInkortDetails);

      if (totalInkortError) throw totalInkortError;
    }

    // 8. Save BOM details if they exist
    if (rawData.varav_bom_avbest_details?.moms_details?.length > 0) {
      const bomDetails = rawData.varav_bom_avbest_details.moms_details.map((detail: any) => ({
        shift_id: shift.id,
        moms_percentage: Number(detail.moms_percentage),
        brutto: Number(detail.brutto),
        netto: Number(detail.netto),
        moms_kr: Number(detail.moms_kr)
      }));

      const { error: bomError } = await supabase
        .from('BOM_Details')
        .insert(bomDetails);

      if (bomError) throw bomError;
    }

    console.log('Successfully saved shift with all details:', shift);
    toast.success('Shift data saved successfully');
    return shift;
  } catch (error) {
    console.error('Error saving shift:', error);
    if (error instanceof Error) {
      toast.error(error.message);
    } else {
      toast.error('An unexpected error occurred while saving the shift');
    }
    throw error;
  }
}