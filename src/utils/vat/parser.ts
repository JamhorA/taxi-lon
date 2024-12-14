import { VatDetail } from './types';

export function parseNumber(value: any): number {
  if (typeof value === 'number') return value;
  if (!value) return 0;
  
  const cleanValue = String(value)
    .replace(/\s/g, '')
    .replace('kr', '')
    .replace(',', '.')
    .replace(/[^\d.-]/g, '');
    
  const parsed = parseFloat(cleanValue);
  return isNaN(parsed) ? 0 : parsed;
}

export function isValidVatRate(rate: number): boolean {
  const valid = rate === 6 || rate === 25;
  console.log('Validating VAT rate:', rate, 'Valid:', valid);
  return valid;
}

export function isNonZeroVatDetail(detail: VatDetail): boolean {
  const brutto = parseNumber(detail.brutto);
  const netto = parseNumber(detail.netto);
  const nonZero = brutto > 0 && netto > 0;
  console.log('Checking non-zero VAT detail:', { brutto, netto }, 'Non-zero:', nonZero);
  return nonZero;
}

export function validateVatDetail(detail: any): detail is VatDetail {
  if (!detail || typeof detail !== 'object') {
    console.log('Invalid VAT detail structure:', detail);
    return false;
  }

  const momsPercentage = parseNumber(detail.moms_percentage);
  const valid = isValidVatRate(momsPercentage) && isNonZeroVatDetail(detail);
  console.log('Validating VAT detail:', detail, 'Valid:', valid);
  return valid;
}

export function filterValidVatDetails(details: any[]): VatDetail[] {
  if (!details || !Array.isArray(details)) {
    console.log('Invalid VAT details array:', details);
    return [];
  }
  
  console.log('Filtering VAT details, input:', details);
  const filtered = details
    .filter(validateVatDetail)
    .map(detail => ({
      moms_percentage: parseNumber(detail.moms_percentage),
      brutto: parseNumber(detail.brutto),
      netto: parseNumber(detail.netto),
      moms_kr: parseNumber(detail.moms_kr)
    }));
  
  console.log('Filtered VAT details:', filtered);
  return filtered;
}