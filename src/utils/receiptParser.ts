import { z } from 'zod';

// Define the schema for receipt data
const receiptSchema = z.object({
  org_nr: z.string(),
  reg_nr: z.string(),
  driver_id: z.string(),
  start_time: z.string(),
  end_time: z.string(),
  taxi_km: z.number(),
  paid_km: z.number(),
  trips: z.number(),
  drosk_nr: z.number(),
  report_nr: z.string(),
  bom_avbest: z.number(),
  total_income: z.number(),
  vat_details: z.array(z.object({
    rate: z.number(),
    gross: z.number(),
    net: z.number(),
    vat: z.number()
  })),
  lonegr_ex_moms: z.number(),
  cash: z.number(),
  to_report: z.number(),
  total_credit: z.number()
});

export type ReceiptData = z.infer<typeof receiptSchema>;

export function parseReceipt(text: string): ReceiptData {
  const lines = text.split('\n');
  const data: Record<string, any> = {};
  const vatDetails: Array<{ rate: number; gross: number; net: number; vat: number }> = [];

  lines.forEach(line => {
    const trimmedLine = line.trim();
    if (!trimmedLine) return;

    // Handle VAT line (6.00: 1916.00 1807.55 108.45)
    if (trimmedLine.match(/^\d+\.\d+:/)) {
      const [rateStr, values] = trimmedLine.split(':').map(s => s.trim());
      const [gross, net, vat] = values.split(' ').map(v => parseFloat(v));
      vatDetails.push({
        rate: parseFloat(rateStr),
        gross,
        net,
        vat
      });
      return;
    }

    // Extract key-value pairs
    const [key, ...valueParts] = trimmedLine.split(':');
    if (!key || valueParts.length === 0) return;

    const value = valueParts.join(':').trim();
    
    // Normalize keys
    const normalizedKey = key.trim()
      .toLowerCase()
      .replace(/\./g, '')
      .replace(/\s+/g, '_')
      .replace('org_nr', 'org_nr')
      .replace('regnr', 'reg_nr')
      .replace('förarid', 'driver_id')
      .replace('starttid', 'start_time')
      .replace('sluttid', 'end_time')
      .replace('taxitrafik_km', 'taxi_km')
      .replace('betalda_km', 'paid_km')
      .replace('turer', 'trips')
      .replace('drosknr', 'drosk_nr')
      .replace('rapportnr', 'report_nr')
      .replace('bom/aubest', 'bom_avbest')
      .replace('totalt_inkört', 'total_income')
      .replace('lönegr_ex_moms', 'lonegr_ex_moms')
      .replace('kontant', 'cash')
      .replace('att_redovisa', 'to_report')
      .replace('total_kredit', 'total_credit');

    // Convert numeric values
    if (value.match(/^-?\d+([.,]\d+)?\s*(?:kr)?$/i)) {
      data[normalizedKey] = parseFloat(value.replace(/[^\d,-]/g, '').replace(',', '.'));
    } else {
      data[normalizedKey] = value;
    }
  });

  data.vat_details = vatDetails;

  try {
    // Ensure lonegr_ex_moms is properly handled
    if (typeof data.lonegr_ex_moms === 'undefined') {
      data.lonegr_ex_moms = 0;
    } else {
      data.lonegr_ex_moms = Number(data.lonegr_ex_moms);
    }

    // Validate and return the parsed data
    return receiptSchema.parse({
      org_nr: data.org_nr,
      reg_nr: data.reg_nr,
      driver_id: data.driver_id,
      start_time: data.start_time,
      end_time: data.end_time,
      taxi_km: data.taxi_km,
      paid_km: data.paid_km,
      trips: data.trips,
      drosk_nr: data.drosk_nr,
      report_nr: data.report_nr,
      bom_avbest: data.bom_avbest,
      total_income: data.total_income,
      vat_details: data.vat_details,
      lonegr_ex_moms: data.lonegr_ex_moms,
      cash: data.cash || 0,
      to_report: data.to_report || 0,
      total_credit: data.total_credit
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Validation errors:', error.errors);
      const missingFields = error.errors.map(err => err.path.join('.'));
      throw new Error(`Missing or invalid fields: ${missingFields.join(', ')}`);
    }
    throw new Error('Invalid receipt data');
  }
}
