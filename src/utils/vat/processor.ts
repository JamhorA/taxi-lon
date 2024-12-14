import { VatDetail, VatSection, TotalInkortSection, ProcessedData } from './types';
import { parseNumber, filterValidVatDetails } from './parser';
import { DEFAULT_VAT_DETAILS, VAT_SECTIONS } from './constants';

function processVatSection(section: any): VatSection | null {
  console.log('Processing VAT section:', section);
  
  if (!section?.moms_details) {
    console.log('No moms_details found in section');
    return null;
  }

  const validDetails = filterValidVatDetails(section.moms_details);
  console.log('Valid VAT details after filtering:', validDetails);
  
  if (validDetails.length === 0) {
    console.log('No valid VAT details found');
    return null;
  }

  return {
    moms_details: validDetails
  };
}

function processTotalInkort(section: any): TotalInkortSection | null {
  console.log('Processing total inkört section:', section);
  
  const vatSection = processVatSection(section);
  if (!vatSection) {
    console.log('No valid VAT section for total inkört');
    return null;
  }

  const totalInkort = parseNumber(section.total_inkort);
  console.log('Total inkört value:', totalInkort);
  
  if (totalInkort <= 0) {
    console.log('Total inkört is zero or negative');
    return null;
  }

  return {
    ...vatSection,
    total_inkort: totalInkort
  };
}

export function prepareVatDetailsForSave(data: any): ProcessedData {
  console.log('Preparing VAT details for save, input data:', data);
  const preparedData: ProcessedData = { ...data };

  // Process each VAT section
  VAT_SECTIONS.forEach(sectionKey => {
    console.log(`Processing section: ${sectionKey}`);
    const section = preparedData[sectionKey];
    
    if (!section) {
      console.log(`No ${sectionKey} found`);
      delete preparedData[sectionKey];
      return;
    }

    if (sectionKey === 'total_inkort_details') {
      const processed = processTotalInkort(section);
      console.log(`Processed total inkört details:`, processed);
      
      if (processed) {
        preparedData[sectionKey] = processed;
      } else {
        console.log('Removing empty total inkört details');
        delete preparedData[sectionKey];
      }
    } else {
      const processed = processVatSection(section);
      console.log(`Processed ${sectionKey}:`, processed);
      
      if (processed) {
        preparedData[sectionKey] = processed;
      } else {
        console.log(`Removing empty ${sectionKey}`);
        delete preparedData[sectionKey];
      }
    }
  });

  console.log('Final prepared data:', preparedData);
  return preparedData;
}

export function ensureDefaultVatRates(details: VatDetail[] = []): VatDetail[] {
  const filteredDetails = details.filter(detail => detail.brutto > 0 || detail.netto > 0);
  const existingRates = new Set(filteredDetails.map(d => d.moms_percentage));

  const result = [...filteredDetails];

  if (!existingRates.has(6)) {
    result.push({ moms_percentage: 6, brutto: 0, netto: 0, moms_kr: 0 });
  }
  if (!existingRates.has(25)) {
    result.push({ moms_percentage: 25, brutto: 0, netto: 0, moms_kr: 0 });
  }

  return result.sort((a, b) => a.moms_percentage - b.moms_percentage);
}
