
export interface VatDetail {
  moms_percentage: number;
  brutto: number;
  netto: number;
  moms_kr: number;
}

export interface MomsDetails {
  moms_details: VatDetail[];
}

export interface KontantDetails extends MomsDetails {
  kontant: number;
}

export interface KreditDetails extends MomsDetails {
  kredit: number;
}

export interface TotalInkortDetails extends MomsDetails {
  total_inkort: number;
}

export interface ExtractedData {
  org_nr: string;
  regnr: string;
  forarid: string;
  start_time: string;
  end_time: string;
  taxitrafik_km: number;
  betalda_km: number;
  turer: number;
  drosknr: string;
  rapportnr: string;
  lonegr_ex_moms: number;
  kontant: number;
  drikskredit: number;
  att_redovisa: number;
  total_kredit: number;
  kontant_details?: KontantDetails;
  kredit_details?: KreditDetails;
  total_inkort_details?: TotalInkortDetails;
  varav_bom_avbest_details?: MomsDetails;
}

export interface ApiResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export interface ApiError {
  error?: {
    message?: string;
    type?: string;
  };
  message?: string;
}

export interface ValidationResult {
  isValid: boolean;
  message: string;
  missingFields?: string[];
}