import { z } from 'zod';

export interface MomsDetail {
  moms_percentage: number;
  brutto: number;
  netto: number;
  moms_kr: number;
}

export interface PaymentDetails {
  amount: number;
  moms_details: MomsDetail[];
}

export interface ShiftInput {
  car_id: string;
  driver_id: string;
  start_time: string; // Format: "YYYY-MM-DD HH:mm"
  end_time: string; // Format: "YYYY-MM-DD HH:mm"
  taxi_km: number;
  paid_km: number;
  trips: number;
  report_nr: string;
  cash: number;
  to_report: number;
  total_credit: number;
  drikskredit: number;
  lonegr_ex_moms: number;
}

export interface RawShiftData {
  car_id: string;
  driver_id: string;
  start_time: string;
  end_time: string;
  taxitrafik_km: number;
  betalda_km: number;
  turer: number;
  rapportnr: string;
  kontant_details?: PaymentDetails;
  kredit_details?: PaymentDetails;
  total_inkort_details?: {
    total_inkort: number;
    moms_details: MomsDetail[];
  };
  varav_bom_avbest_details?: {
    moms_details: MomsDetail[];
  };
  att_redovisa: number;
  drikskredit: number;
  lonegr_ex_moms: number;
}