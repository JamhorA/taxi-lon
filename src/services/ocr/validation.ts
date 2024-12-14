
import { ExtractedData, ValidationResult } from './types';

const REQUIRED_FIELDS = [
  'org_nr',
  'regnr',
  'forarid',
  'start_time',
  'end_time',
  'taxitrafik_km',
  'betalda_km',
  'turer',
  'drosknr',
  'rapportnr'
] as const;

export function validateExtractedData(data: Partial<ExtractedData>): ValidationResult {
  try {
    const missingFields = REQUIRED_FIELDS.filter(field => !data[field]);

    if (missingFields.length > 0) {
      return {
        isValid: false,
        message: `Saknade obligatoriska fält: ${missingFields.join(', ')}`,
        missingFields
      };
    }

    // Validate numeric fields
    const numericFields = ['taxitrafik_km', 'betalda_km', 'turer', 'lonegr_ex_moms'];
    for (const field of numericFields) {
      if (typeof data[field] !== 'number' || isNaN(data[field])) {
        return {
          isValid: false,
          message: `Ogiltigt värde för ${field}: måste vara ett nummer`,
          missingFields: [field]
        };
      }
    }

    // Validate date fields
    const dateFields = ['start_time', 'end_time'];
    const dateRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/;
    for (const field of dateFields) {
      if (!dateRegex.test(data[field])) {
        return {
          isValid: false,
          message: `Ogiltigt datumformat för ${field}`,
          missingFields: [field]
        };
      }
    }

    // Validate VAT details if present
    if (data.kontant_details?.moms_details) {
      for (const detail of data.kontant_details.moms_details) {
        if (!validateVatDetail(detail)) {
          return {
            isValid: false,
            message: 'Ogiltiga momsdetaljer för kontant',
            missingFields: ['kontant_details']
          };
        }
      }
    }

    if (data.kredit_details?.moms_details) {
      for (const detail of data.kredit_details.moms_details) {
        if (!validateVatDetail(detail)) {
          return {
            isValid: false,
            message: 'Ogiltiga momsdetaljer för kredit',
            missingFields: ['kredit_details']
          };
        }
      }
    }

    return {
      isValid: true,
      message: 'All data är giltig'
    };
  } catch (error) {
    console.error('Validation error:', error);
    return {
      isValid: false,
      message: error instanceof Error ? error.message : 'Valideringsfel'
    };
  }
}

function validateVatDetail(detail: any): boolean {
  return (
    typeof detail.moms_percentage === 'number' &&
    typeof detail.brutto === 'number' &&
    typeof detail.netto === 'number' &&
    typeof detail.moms_kr === 'number' &&
    !isNaN(detail.moms_percentage) &&
    !isNaN(detail.brutto) &&
    !isNaN(detail.netto) &&
    !isNaN(detail.moms_kr)
  );
}

export function validateJsonResponse(response: string): boolean {
  try {
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return false;
    }
    JSON.parse(jsonMatch[0]);
    return true;
  } catch {
    return false;
  }
}