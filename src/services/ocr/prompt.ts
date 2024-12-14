
export function getOcrPrompt(): string {
  return `
Extract and return the following information from this receipt in JSON format.
Pay special attention to these critical fields:
- TAXITRAFIK KM
- BETALDA KM
- ANTAL TURER

Return the data in this exact structure:
{
  "org_nr": "string",
  "regnr": "string",
  "forarid": "string",
  "start_time": "YYYY-MM-DD HH:mm",
  "end_time": "YYYY-MM-DD HH:mm",
  "taxitrafik_km": number,
  "betalda_km": number,
  "turer": number,
  "drosknr": "string",
  "rapportnr": "string",
  "lonegr_ex_moms": number,
  "kontant": number,
  "drikskredit": number,
  "att_redovisa": number,
  "total_kredit": number,
  "kontant_details": {
    "kontant": number,
    "moms_details": [
      {
        "moms_percentage": number,
        "brutto": number,
        "netto": number,
        "moms_kr": number
      }
    ]
  },
  "kredit_details": {
    "kredit": number,
    "moms_details": [
      {
        "moms_percentage": number,
        "brutto": number,
        "netto": number,
        "moms_kr": number
      }
    ]
  },
  "total_inkort_details": {
    "total_inkort": number,
    "moms_details": [
      {
        "moms_percentage": number,
        "brutto": number,
        "netto": number,
        "moms_kr": number
      }
    ]
  },
  "varav_bom_avbest_details": {
    "moms_details": [
      {
        "moms_percentage": number,
        "brutto": number,
        "netto": number,
        "moms_kr": number
      }
    ]
  }
}

Important instructions:
1. Look carefully for kilometer and trip information in the receipt
2. Convert any comma-separated numbers to decimal points
3. Remove any currency symbols or units before returning numbers
4. Ensure taxitrafik_km, betalda_km, and turer are always included
5. Use 0 for any missing numeric values
6. Look for variations in field names (e.g., "Taxi KM", "Taxitrafik Kilometer")
7. Return ONLY the JSON object, no additional text
8. All dates must be in YYYY-MM-DD HH:mm format
9. All monetary values should be numbers (not strings)
10. Include all VAT details found in the receipt`.trim();
}
