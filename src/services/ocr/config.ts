
export const OCR_CONFIG = {
  MAX_RETRIES: 2,
  RETRY_DELAY: 1000,
  MAX_TIMEOUT: 30000,
  API_KEY: import.meta.env.VITE_OPENROUTER_GEMINI_PRO_1_5_API_KEY,
  MODEL: 'google/gemini-pro-1.5',
  ENDPOINT: 'https://openrouter.ai/api/v1/chat/completions',
  HEADERS: {
    'Content-Type': 'application/json',
    'HTTP-Referer': window.location.origin,
    'X-Title': 'OCR Web Application'
  },
  DEFAULT_DATA: {
    org_nr: '000000-0000',
    regnr: 'ABC123',
    forarid: '00000',
    start_time: new Date().toISOString().slice(0, 16).replace('T', ' '),
    end_time: new Date().toISOString().slice(0, 16).replace('T', ' '),
    taxitrafik_km: 0,
    betalda_km: 0,
    turer: 0,
    drosknr: '0000',
    rapportnr: '00000',
    lonegr_ex_moms: 0,
    kontant: 0,
    drikskredit: 0,
    att_redovisa: 0,
    total_kredit: 0,
    kontant_details: {
      kontant: 0,
      moms_details: [
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
      ]
    },
    kredit_details: {
      kredit: 0,
      moms_details: [
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
      ]
    },
    total_inkort_details: {
      total_inkort: 0,
      moms_details: [
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
      ]
    },
    varav_bom_avbest_details: {
      moms_details: [
        {
          moms_percentage: 25,
          brutto: 0,
          netto: 0,
          moms_kr: 0
        }
      ]
    }
  }
} as const;

if (!OCR_CONFIG.API_KEY) {
  console.error('OpenRouter API key is missing. Please check your environment variables.');
}

export type OcrConfig = typeof OCR_CONFIG;
