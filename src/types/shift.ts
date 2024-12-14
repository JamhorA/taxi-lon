export interface TotalInkortDetail {
  shift_id: string;
  total_inkort: number;
  moms_percentage: number;
  brutto: number;
  netto: number;
  moms_kr: number;
}

export interface VATDetail {
  shift_id: string;
  vat_rate: number;
  gross_income: number;
  net_income: number;
  vat_amount: number;
  type: 'kontant' | 'kredit';
}

export interface BOMDetail {
  shift_id: string;
  moms_percentage: number;
  brutto: number;
  netto: number;
  moms_kr: number;
}

export interface Shift {
  car_id: string;
  driver_id: string;
  start_time: string;
  end_time: string;
  taxi_km?: number;
  paid_km?: number;
  trips?: number;
  report_nr: string;
  bom_avbest?: number;
  total_income?: number;
  cash?: number;
  to_report?: number;
  total_credit?: number;
  drikskredit?: number;
  lonegr_ex_moms: number;
}

export interface ShiftWithDetails extends Shift {
  vat_details?: VATDetail[];
  bom_details?: BOMDetail[];
  total_inkort_details?: TotalInkortDetail[];
}