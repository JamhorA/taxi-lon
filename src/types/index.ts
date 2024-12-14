export interface ImageState {
  file: File | null;
  preview: string;
  extractedText: string;
  isProcessing: boolean;
}

export interface VATDetail {
  vat_rate: number;
  gross_income: number;
  net_income: number;
  vat_amount: number;
}

export interface ExtractedData {
  org_nr: string;
  reg_nr: string;
  driver_id: string;
  start_time: string;
  end_time: string;
  taxi_km: number;
  paid_km: number;
  trips: number;
  report_nr: string;
  bom_avbest: number;
  total_income: number;
  lonegr_ex_moms: number;
  cash: number;
  to_report: number;
  total_credit: number;
  vat_details: VATDetail[];
}