import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';
import { formatDateTimeForDB } from '../utils/dateTime';

interface VatDetail {
  moms_percentage: number;
  brutto: number;
  netto: number;
  moms_kr: number;
}

interface ShiftData {
  org_nr: string;
  regnr: string;
  forarid: string;
  start_time: string;
  end_time: string;
  taxitrafik_km: number;
  betalda_km: number;
  turer: number;
  drosknr: string;
  rapportnr: string;
  kontant: number;
  total_kredit: number;
  drikskredit: number;
  att_redovisa: number;
  lonegr_ex_moms: number;
  kontant_details?: {
    moms_details: VatDetail[];
  };
  kredit_details?: {
    moms_details: VatDetail[];
  };
  total_inkort_details?: {
    total_inkort: number;
    moms_details: VatDetail[];
  };
  varav_bom_avbest_details?: {
    moms_details: VatDetail[];
  };
}

// Helper function to filter valid VAT details
function filterValidVatDetails(details: VatDetail[]): VatDetail[] {
  return details.filter((detail) => detail.brutto > 0 || detail.netto > 0);
}

async function checkShiftExists(data: ShiftData, companyId: string): Promise<boolean> {
  try {
    // Find car and driver IDs
    const { data: car } = await supabase
      .from('Cars')
      .select('id')
      .eq('regnr', data.regnr)
      .eq('company_id', companyId)
      .single();

    const { data: driver } = await supabase
      .from('Drivers')
      .select('id')
      .eq('forarid', data.forarid)
      .eq('company_id', companyId)
      .single();

    if (!car || !driver) {
      return false;
    }

    // Check for existing shift with same details
    const { data: existingShift, error } = await supabase
      .from('Shifts')
      .select('id')
      .eq('car_id', car.id)
      .eq('driver_id', driver.id)
      .eq('start_time', formatDateTimeForDB(data.start_time))
      .eq('end_time', formatDateTimeForDB(data.end_time))
      .eq('report_nr', data.rapportnr);

    if (error) {
      console.error('Error checking for existing shift:', error);
      return false;
    }

    return existingShift && existingShift.length > 0;
  } catch (error) {
    console.error('Error in checkShiftExists:', error);
    return false;
  }
}

export async function saveShiftData(data: ShiftData) {
  try {
    console.log('Starting shift data save process:', data);

    // 1. Find company
    const { data: company, error: companyError } = await supabase
      .from('Companies')
      .select('id')
      .eq('org_nr', data.org_nr)
      .single();

    if (companyError || !company) {
      throw new Error(`Företag med org.nr ${data.org_nr} hittades inte`);
    }

    // 2. Check if shift already exists
    const shiftExists = await checkShiftExists(data, company.id);
    if (shiftExists) {
      throw new Error('Ett skift med samma information finns redan registrerat');
    }

    // 3. Find car
    const { data: car, error: carError } = await supabase
      .from('Cars')
      .select('id')
      .eq('regnr', data.regnr)
      .eq('company_id', company.id)
      .single();

    if (carError || !car) {
      throw new Error(`Bil med reg.nr ${data.regnr} hittades inte`);
    }

    // 4. Find driver
    const { data: driver, error: driverError } = await supabase
      .from('Drivers')
      .select('id')
      .eq('forarid', data.forarid)
      .eq('company_id', company.id)
      .single();

    if (driverError || !driver) {
      throw new Error(`Förare med ID ${data.forarid} hittades inte`);
    }

    // 5. Prepare shift data
    const shiftData = {
      car_id: car.id,
      driver_id: driver.id,
      start_time: formatDateTimeForDB(data.start_time),
      end_time: formatDateTimeForDB(data.end_time),
      taxi_km: Number(data.taxitrafik_km) || 0,
      paid_km: Number(data.betalda_km) || 0,
      trips: Number(data.turer) || 0,
      report_nr: data.rapportnr,
      cash: Number(data.kontant) || 0,
      to_report: Number(data.att_redovisa) || 0,
      total_credit: Number(data.total_kredit) || 0,
      drikskredit: Number(data.drikskredit) || 0,
      lonegr_ex_moms: Number(data.lonegr_ex_moms) || 0,
    };

    // 6. Insert shift
    const { data: shift, error: shiftError } = await supabase
      .from('Shifts')
      .insert(shiftData)
      .select()
      .single();

    if (shiftError) {
      throw shiftError;
    }

    // 7. Insert VAT details for each section
    const vatSections = [
      { details: data.kontant_details?.moms_details, type: 'kontant' },
      { details: data.kredit_details?.moms_details, type: 'kredit' },
    ];

    for (const section of vatSections) {
      if (section.details?.length > 0) {
        const validDetails = filterValidVatDetails(section.details);
        if (validDetails.length > 0) {
          console.log(`Inserting VAT details for ${section.type}:`, validDetails);
          const vatDetails = validDetails.map((detail) => ({
            shift_id: shift.id,
            vat_rate: Number(detail.moms_percentage),
            gross_income: Number(detail.brutto),
            net_income: Number(detail.netto),
            vat_amount: Number(detail.moms_kr),
            type: section.type,
          }));

          const { error: vatError } = await supabase.from('VAT_Details').insert(vatDetails);
          if (vatError) throw vatError;
        }
      }
    }

    // 8. Handle total inkört details
    if (data.total_inkort_details?.moms_details?.length > 0) {
      const validDetails = filterValidVatDetails(data.total_inkort_details.moms_details);
      if (validDetails.length > 0) {
        const totalInkortDetails = validDetails.map((detail) => ({
          shift_id: shift.id,
          total_inkort: Number(data.total_inkort_details?.total_inkort),
          moms_percentage: Number(detail.moms_percentage),
          brutto: Number(detail.brutto),
          netto: Number(detail.netto),
          moms_kr: Number(detail.moms_kr),
        }));

        const { error: totalInkortError } = await supabase
          .from('Total_Inkort_Details')
          .insert(totalInkortDetails);

        if (totalInkortError) throw totalInkortError;
      }
    }

    // 9. Handle BOM details
    if (data.varav_bom_avbest_details?.moms_details?.length > 0) {
      const validDetails = filterValidVatDetails(data.varav_bom_avbest_details.moms_details);
      if (validDetails.length > 0) {
        const bomDetails = validDetails.map((detail) => ({
          shift_id: shift.id,
          moms_percentage: Number(detail.moms_percentage),
          brutto: Number(detail.brutto),
          netto: Number(detail.netto),
          moms_kr: Number(detail.moms_kr),
        }));

        const { error: bomError } = await supabase.from('BOM_Details').insert(bomDetails);
        if (bomError) throw bomError;
      }
    }

    toast.success('Skiftet har sparats');
    return shift;
  } catch (error) {
    console.error('Error saving shift data:', error);
    if (error instanceof Error) {
      toast.error(error.message);
    } else {
      toast.error('Ett oväntat fel inträffade när skiftet skulle sparas');
    }
    throw error;
  }
}
