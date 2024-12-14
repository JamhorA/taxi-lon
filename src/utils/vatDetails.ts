export const DEFAULT_VAT_DETAILS = [
  {
    moms_percentage: 6,
    brutto: 0,
    netto: 0,
    moms_kr: 0
  },
  {
    moms_percentage: 25,
    brutto: 0,
    netto: 0,
    moms_kr: 0
  }
];

export function parseNumber(value: any): number {
  if (typeof value === 'number') return value;
  if (!value) return 0;
  const parsed = parseFloat(String(value).replace(/[^\d.-]/g, '').replace(',', '.'));
  return isNaN(parsed) ? 0 : parsed;
}

function isRelevantVatDetail(detail: any): boolean {
  if (!detail || typeof detail !== 'object') return false;

  const brutto = parseNumber(detail.brutto);
  const netto = parseNumber(detail.netto);
  const momsPercentage = parseNumber(detail.moms_percentage);

  return (momsPercentage === 6 || momsPercentage === 25) && (brutto > 0 || netto > 0);
}

function filterRelevantVatDetails(details: any[]): any[] {
  if (!details || !Array.isArray(details)) return [];
  return details.filter(isRelevantVatDetail);
}

export function ensureVatRates(details: any[] | undefined): any[] {
  const filteredDetails = filterRelevantVatDetails(details || []);
  const rates = new Set(filteredDetails.map(d => d.moms_percentage));
  
  const result = [...filteredDetails];

  if (!rates.has(6)) {
    result.push({
      moms_percentage: 6,
      brutto: 0,
      netto: 0,
      moms_kr: 0
    });
  }

  if (!rates.has(25)) {
    result.push({
      moms_percentage: 25,
      brutto: 0,
      netto: 0,
      moms_kr: 0
    });
  }

  return result.sort((a, b) => a.moms_percentage - b.moms_percentage);
}

function processVatSection(section: any) {
  if (!section || !section.moms_details) return null;

  const relevantDetails = filterRelevantVatDetails(section.moms_details);

  if (relevantDetails.length === 0) return null;

  return {
    ...section,
    moms_details: relevantDetails.map(detail => ({
      moms_percentage: parseNumber(detail.moms_percentage),
      brutto: parseNumber(detail.brutto),
      netto: parseNumber(detail.netto),
      moms_kr: parseNumber(detail.moms_kr)
    }))
  };
}

export function prepareVatDetailsForSave(data: any) {
  const preparedData = { ...data };
  const sections = [
    'kontant_details',
    'kredit_details',
    'total_inkort_details',
    'varav_bom_avbest_details'
  ];

  sections.forEach(sectionKey => {
    const processedSection = processVatSection(preparedData[sectionKey]);
    
    if (processedSection && processedSection.moms_details.length > 0) {
      if (sectionKey === 'total_inkort_details') {
        const totalInkort = parseNumber(preparedData[sectionKey]?.total_inkort);
        if (totalInkort > 0) {
          preparedData[sectionKey] = {
            ...processedSection,
            total_inkort: totalInkort
          };
        } else {
          delete preparedData[sectionKey];
        }
      } else {
        preparedData[sectionKey] = processedSection;
      }
    } else {
      delete preparedData[sectionKey];
    }
  });

  return preparedData;
}