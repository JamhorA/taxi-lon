export interface Database {
  public: {
    Tables: {
      Companies: {
        Row: {
          id: string;
          name: string;
          org_nr: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          org_nr: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          org_nr?: string;
          created_at?: string;
        };
      };
      Cars: {
        Row: {
          id: string;
          company_id: string;
          reg_nr: string;
          drosknr: number;
          model?: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          reg_nr: string;
          drosknr: number;
          model?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string;
          reg_nr?: string;
          drosknr?: number;
          model?: string;
          created_at?: string;
        };
      };
      Drivers: {
        Row: {
          id: string;
          company_id: string;
          name: string;
          driver_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          name: string;
          driver_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string;
          name?: string;
          driver_id?: string;
          created_at?: string;
        };
      };
      Shifts: {
        Row: {
          id: string;
          car_id: string;
          driver_id: string;
          start_time: string;
          end_time: string;
          taxi_km: number | null;
          paid_km: number | null;
          trips: number | null;
          report_nr: string;
          bom_avbest: number | null;
          total_income: number | null;
          cash: number | null;
          to_report: number | null;
          total_credit: number | null;
          drikskredit: number | null;
          lonegr_ex_moms: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          car_id: string;
          driver_id: string;
          start_time: string;
          end_time: string;
          taxi_km?: number | null;
          paid_km?: number | null;
          trips?: number | null;
          report_nr: string;
          bom_avbest?: number | null;
          total_income?: number | null;
          cash?: number | null;
          to_report?: number | null;
          total_credit?: number | null;
          drikskredit?: number | null;
          lonegr_ex_moms?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          car_id?: string;
          driver_id?: string;
          start_time?: string;
          end_time?: string;
          taxi_km?: number | null;
          paid_km?: number | null;
          trips?: number | null;
          report_nr?: string;
          bom_avbest?: number | null;
          total_income?: number | null;
          cash?: number | null;
          to_report?: number | null;
          total_credit?: number | null;
          drikskredit?: number | null;
          lonegr_ex_moms?: number;
          created_at?: string;
        };
      };
      Total_Inkort_Details: {
        Row: {
          id: string;
          shift_id: string;
          total_inkort: number;
          moms_percentage: number;
          brutto: number;
          netto: number;
          moms_kr: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          shift_id: string;
          total_inkort: number;
          moms_percentage: number;
          brutto: number;
          netto: number;
          moms_kr: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          shift_id?: string;
          total_inkort?: number;
          moms_percentage?: number;
          brutto?: number;
          netto?: number;
          moms_kr?: number;
          created_at?: string;
        };
      };
      VAT_Details: {
        Row: {
          id: string;
          shift_id: string;
          vat_rate: number;
          gross_income: number | null;
          net_income: number | null;
          vat_amount: number | null;
          type: 'kontant' | 'kredit';
        };
        Insert: {
          id?: string;
          shift_id: string;
          vat_rate: number;
          gross_income?: number | null;
          net_income?: number | null;
          vat_amount?: number | null;
          type: 'kontant' | 'kredit';
        };
        Update: {
          id?: string;
          shift_id?: string;
          vat_rate?: number;
          gross_income?: number | null;
          net_income?: number | null;
          vat_amount?: number | null;
          type?: 'kontant' | 'kredit';
        };
      };
      BOM_Details: {
        Row: {
          id: string;
          shift_id: string;
          moms_percentage: number;
          brutto: number;
          netto: number;
          moms_kr: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          shift_id: string;
          moms_percentage: number;
          brutto: number;
          netto: number;
          moms_kr: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          shift_id?: string;
          moms_percentage?: number;
          brutto?: number;
          netto?: number;
          moms_kr?: number;
          created_at?: string;
        };
      };
    };
  };
}