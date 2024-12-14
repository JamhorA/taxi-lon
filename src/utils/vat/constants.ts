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

export const VAT_SECTIONS = [
  'kontant_details',
  'kredit_details',
  'total_inkort_details',
  'varav_bom_avbest_details'
] as const;