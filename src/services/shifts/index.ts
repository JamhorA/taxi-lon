import { toast } from 'react-hot-toast';
import { formatDateTimeForDB } from '../../utils/dateTime';
import { RawShiftData } from './types';
import { validateShiftInput } from './validation';
import { prepareVatDetailsForSave, parseNumber } from '../../utils/vat';
import {
  insertShift,
  insertVatDetails,
  insertTotalInkortDetails,
  insertBomDetails,
  checkShiftExists
} from './database';

export async function saveShiftData(rawData: RawShiftData) {
  try {
    console.log('Starting shift data save process with raw data:', rawData);

    // Filter and prepare VAT details
    const processedData = prepareVatDetailsForSave(rawData);
    console.log('Processed data after VAT filtering:', processedData);

    // Prepare base shift data
    const shiftData = {
      car_id: processedData.car_id,
      driver_id: processedData.driver_id,
      start_time: formatDateTimeForDB(processedData.start_time),
      end_time: formatDateTimeForDB(processedData.end_time),
      taxi_km: parseNumber(processedData.taxitrafik_km),
      paid_km: parseNumber(processedData.betalda_km),
      trips: parseNumber(processedData.turer),
      report_nr: processedData.rapportnr,
      drosknr: processedData.drosknr,
      cash: parseNumber(processedData.kontant_details?.kontant),
      to_report: parseNumber(processedData.att_redovisa),
      total_credit: parseNumber(processedData.kredit_details?.kredit),
      drikskredit: parseNumber(processedData.drikskredit),
      lonegr_ex_moms: parseNumber(processedData.lonegr_ex_moms)
    };

    console.log('Prepared shift data:', shiftData);

    // Check if shift already exists
    const shiftExists = await checkShiftExists(shiftData);
    if (shiftExists) {
      throw new Error('Ett skift med samma information finns redan registrerat');
    }

    // Insert shift
    const shift = await insertShift(shiftData);
    console.log('Shift inserted:', shift);

    // Handle kontant VAT details
    if (processedData.kontant_details?.moms_details?.length > 0) {
      console.log('Processing kontant VAT details:', processedData.kontant_details.moms_details);
      const kontantVatDetails = processedData.kontant_details.moms_details.map(detail => ({
        shift_id: shift.id,
        vat_rate: parseNumber(detail.moms_percentage),
        gross_income: parseNumber(detail.brutto),
        net_income: parseNumber(detail.netto),
        vat_amount: parseNumber(detail.moms_kr),
        type: 'kontant' as const
      }));
      await insertVatDetails(kontantVatDetails);
    }

    // Handle kredit VAT details
    if (processedData.kredit_details?.moms_details?.length > 0) {
      console.log('Processing kredit VAT details:', processedData.kredit_details.moms_details);
      const kreditVatDetails = processedData.kredit_details.moms_details.map(detail => ({
        shift_id: shift.id,
        vat_rate: parseNumber(detail.moms_percentage),
        gross_income: parseNumber(detail.brutto),
        net_income: parseNumber(detail.netto),
        vat_amount: parseNumber(detail.moms_kr),
        type: 'kredit' as const
      }));
      await insertVatDetails(kreditVatDetails);
    }

    // Handle total inkört details
    if (processedData.total_inkort_details?.moms_details?.length > 0) {
      console.log('Processing total inkört details:', processedData.total_inkort_details);
      const totalInkortDetails = processedData.total_inkort_details.moms_details.map(detail => ({
        shift_id: shift.id,
        total_inkort: parseNumber(processedData.total_inkort_details?.total_inkort),
        moms_percentage: parseNumber(detail.moms_percentage),
        brutto: parseNumber(detail.brutto),
        netto: parseNumber(detail.netto),
        moms_kr: parseNumber(detail.moms_kr)
      }));
      await insertTotalInkortDetails(totalInkortDetails);
    }

    // Handle BOM details
    if (processedData.varav_bom_avbest_details?.moms_details?.length > 0) {
      console.log('Processing BOM details:', processedData.varav_bom_avbest_details);
      const bomDetails = processedData.varav_bom_avbest_details.moms_details.map(detail => ({
        shift_id: shift.id,
        moms_percentage: parseNumber(detail.moms_percentage),
        brutto: parseNumber(detail.brutto),
        netto: parseNumber(detail.netto),
        moms_kr: parseNumber(detail.moms_kr)
      }));
      await insertBomDetails(bomDetails);
    }

    toast.success('Skiftet har sparats');
    return shift;
  } catch (error) {
    console.error('Error in saveShiftData:', error);
    if (error instanceof Error) {
      toast.error(error.message);
    } else {
      toast.error('Ett oväntat fel inträffade när skiftet skulle sparas');
    }
    throw error;
  }
}

export * from './types';