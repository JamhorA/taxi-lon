export interface VatDetail {
  moms_percentage: number;
  brutto: number;
  netto: number;
  moms_kr: number;
}

export interface VatSection {
  moms_details: VatDetail[];
}

export interface TotalInkortSection extends VatSection {
  total_inkort: number;
}

export interface ProcessedData {
  kontant_details?: VatSection;
  kredit_details?: VatSection;
  total_inkort_details?: TotalInkortSection;
  varav_bom_avbest_details?: VatSection;
  [key: string]: any;
}