
import { OCR_CONFIG } from './config';
import { ExtractedData, VatDetail } from './types';
import { normalizeDateTime } from './utils';

export function normalizeOcrData(data: any): ExtractedData {
  try {
    if (!data || typeof data !== 'object') {
      console.warn('Invalid data structure, using default data');
      return { ...OCR_CONFIG.DEFAULT_DATA };
    }

    // Normalize basic fields with strict type checking and default values
    const normalized = {
      ...OCR_CONFIG.DEFAULT_DATA,
      org_nr: String(data.org_nr || OCR_CONFIG.DEFAULT_DATA.org_nr).trim(),
      regnr: String(data.regnr || OCR_CONFIG.DEFAULT_DATA.regnr).trim().toUpperCase(),
      forarid: String(data.forarid || OCR_CONFIG.DEFAULT_DATA.forarid).trim(),
      start_time: normalizeDateTime(data.starttid || data.start_time || OCR_CONFIG.DEFAULT_DATA.start_time),
      end_time: normalizeDateTime(data.sluttid || data.end_time || OCR_CONFIG.DEFAULT_DATA.end_time),
      taxitrafik_km: normalizeNumber(data.taxitrafik_km),
      betalda_km: normalizeNumber(data.betalda_km),
      turer: normalizeNumber(data.turer),
      drosknr: String(data.drosknr || OCR_CONFIG.DEFAULT_DATA.drosknr).trim(),
      rapportnr: String(data.rapportnr || OCR_CONFIG.DEFAULT_DATA.rapportnr).trim(),
      lonegr_ex_moms: normalizeNumber(data.lonegr_ex_moms),
      kontant: normalizeNumber(data.kontant),
      drikskredit: normalizeNumber(data.drikskredit),
      att_redovisa: normalizeNumber(data.att_redovisa),
      total_kredit: normalizeNumber(data.total_kredit)
    };

    // Handle VAT details with default values
    normalized.kontant_details = normalizeVatSection(
      data.kontant_details, 
      normalized.kontant,
      OCR_CONFIG.DEFAULT_DATA.kontant_details
    );

    normalized.kredit_details = normalizeVatSection(
      data.kredit_details, 
      normalized.total_kredit,
      OCR_CONFIG.DEFAULT_DATA.kredit_details
    );

    normalized.total_inkort_details = normalizeTotalInkort(
      data.total_inkort_details,
      OCR_CONFIG.DEFAULT_DATA.total_inkort_details
    );

    normalized.varav_bom_avbest_details = normalizeBomDetails(
      data.varav_bom_avbest_details,
      OCR_CONFIG.DEFAULT_DATA.varav_bom_avbest_details
    );

    // Log missing required fields
    const requiredFields = [
      'org_nr', 'regnr', 'forarid', 'start_time', 'end_time',
      'taxitrafik_km', 'betalda_km', 'turer', 'drosknr', 'rapportnr'
    ];

    const missingFields = requiredFields.filter(field => !data[field]);
    if (missingFields.length > 0) {
      console.warn('Missing required fields:', missingFields);
    }

    return normalized;
  } catch (error) {
    console.error('Error normalizing OCR data:', error);
    return { ...OCR_CONFIG.DEFAULT_DATA };
  }
}

function normalizeNumber(value: any): number {
  if (typeof value === 'number' && !isNaN(value)) {
    return value;
  }
  if (typeof value === 'string') {
    // Remove any non-numeric characters except decimal point and minus
    const cleanValue = value.replace(/[^\d.-]/g, '').replace(',', '.');
    const parsed = parseFloat(cleanValue);
    if (!isNaN(parsed)) {
      return parsed;
    }
  }
  return 0;
}

function normalizeVatSection(section: any, totalAmount: number, defaultValue: any) {
  if (!section || typeof section !== 'object') {
    return {
      amount: totalAmount,
      moms_details: defaultValue.moms_details
    };
  }

  return {
    amount: normalizeNumber(section.amount || totalAmount),
    moms_details: Array.isArray(section.moms_details) && section.moms_details.length > 0
      ? section.moms_details.map((detail: any) => normalizeVatDetail(detail))
      : defaultValue.moms_details
  };
}

function normalizeVatDetail(detail: any): VatDetail {
  if (!detail || typeof detail !== 'object') {
    return {
      moms_percentage: 25,
      brutto: 0,
      netto: 0,
      moms_kr: 0
    };
  }

  return {
    moms_percentage: normalizeNumber(detail.moms_percentage) || 25,
    brutto: normalizeNumber(detail.brutto),
    netto: normalizeNumber(detail.netto),
    moms_kr: normalizeNumber(detail.moms_kr)
  };
}

function normalizeTotalInkort(details: any, defaultValue: any) {
  if (!details || typeof details !== 'object') {
    return defaultValue;
  }

  return {
    total_inkort: normalizeNumber(details.total_inkort),
    moms_details: Array.isArray(details.moms_details) && details.moms_details.length > 0
      ? details.moms_details.map((detail: any) => normalizeVatDetail(detail))
      : defaultValue.moms_details
  };
}

function normalizeBomDetails(details: any, defaultValue: any) {
  if (!details || typeof details !== 'object') {
    return defaultValue;
  }

  return {
    moms_details: Array.isArray(details.moms_details) && details.moms_details.length > 0
      ? details.moms_details.map((detail: any) => normalizeVatDetail(detail))
      : defaultValue.moms_details
  };
}
