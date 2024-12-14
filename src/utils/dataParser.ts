import { z } from 'zod';
import { ExtractedData, VATDetail } from '../types';

const vatDetailSchema = z.object({
  vat_rate: z.number(),
  gross_income: z.number(),
  net_income: z.number(),
  vat_amount: z.number()
});

const extractedDataSchema = z.object({
  org_nr: z.string(),
  reg_nr: z.string(),
  driver_id: z.string(),
  start_time: z.string(),
  end_time: z.string(),
  taxi_km: z.number(),
  paid_km: z.number(),
  trips: z.number(),
  report_nr: z.string(),
  bom_avbest: z.number(),
  total_income: z.number(),
  lonegr_ex_moms: z.number(),
  cash: z.number(),
  to_report: z.number(),
  total_credit: z.number(),
  vat_details: z.array(vatDetailSchema)
});

export function parseExtractedText(text: string): ExtractedData {
  // Extract values using regex or string manipulation
  // This is a simplified example - you'll need to adapt this based on your actual text format
  const lines = text.split('\n');
  const data: Record<string, any> = {};
  
  lines.forEach(line => {
    const [key, value] = line.split(':').map(s => s.trim());
    if (key && value) {
      // Convert numeric values
      if (/^-?\d+(\.\d+)?$/.test(value)) {
        data[key.toLowerCase().replace(/\s/g, '_')] = parseFloat(value);
      } else {
        data[key.toLowerCase().replace(/\s/g, '_')] = value;
      }
    }
  });

  // Parse VAT details
  const vatDetails: VATDetail[] = [];
  // Add logic to parse VAT details from the text

  return extractedDataSchema.parse({
    ...data,
    vat_details: vatDetails
  });
}