import OpenAI from 'openai';
import toast from 'react-hot-toast';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  throw new Error('OpenAI API-nyckeln saknas. Kontrollera att VITE_OPENAI_API_KEY är korrekt inställd i .env-filen.');
}

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export async function extractTextWithOpenAI(file: File): Promise<string> {
  try {
    // Konvertera filen till Base64 Data URL
    const base64Image = await fileToBase64(file);

    // Förfrågan till OpenAI med modellen gpt-4o
    const response = await openai.chat.completions.create({
      model: "gpt-4o-2024-11-20",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Extract and return the following information from this receipt image in strict JSON format. Ensure no additional text or formatting:
              
              {
                "ORG_NR": "value or null",
                "REGNR": "value or null",
                "FÖRARID": "value or null",
                "STARTTID": "value or null",
                "SLUTTID": "value or null",
                "TAXITRAFIK_KM": "value or null",
                "BETALDA_KM": "value or null",
                "TURER": "value or null",
                "DROSKNR": "value or null",
                "RAPPORTNR": "value or null",
                "BOM_AVBEST": "value or null",
                "TOTALT_INKÖRT": "value or null",
                "MOMS": {
                  "6%": {
                    "BRUTTO": "value or null",
                    "NETTO": "value or null",
                    "MOMS_KR": "value or null"
                  },
                  "25%": {
                    "BRUTTO": "value or null",
                    "NETTO": "value or null",
                    "MOMS_KR": "value or null"
                  },
                  "BOM_AVBEST": {
                    "BRUTTO": "value or null",
                    "NETTO": "value or null",
                    "MOMS_KR": "value or null"
                  }
                },
                "LÖNEGR_EX_MOMS": "value or null",
                "KONTANT": "value or null",
                "ATT_REDOVISA": "value or null",
                "TOTAL_KREDIT": "value or null"
              }`,
            },
            {
              type: "image_url",
              image_url: { url: base64Image },
            },
          ],
        },
      ],
      max_tokens: 2000,
    });

    // Kontrollera om svaret innehåller text
    if (!response.choices[0]?.message?.content) {
      throw new Error('Ingen text kunde extraheras från bilden.');
    }

    // Extrahera och validera JSON
    const rawData = response.choices[0].message.content.trim();
    const validatedData = validateAndCorrectData(extractJSON(rawData));
    return JSON.stringify(validatedData, null, 2);
  } catch (error) {
    const errorMessage = error.response?.data || error.message || 'Ett okänt fel uppstod';
    console.error('OpenAI OCR error:', errorMessage);
    toast.error(`OpenAI: ${errorMessage}`);
    throw new Error(`OpenAI: ${errorMessage}`);
  }
}

// Funktion för att extrahera JSON från rå text
function extractJSON(rawText: string): any {
  try {
    const jsonMatch = rawText.match(/{[\s\S]*}/); // Matchar allt inom {}
    if (!jsonMatch) {
      throw new Error('Inget giltigt JSON hittades i svaret.');
    }
    return JSON.parse(jsonMatch[0]); // Returnera parsad JSON
  } catch (error) {
    console.error('JSON-extraktion misslyckades:', error);
    throw new Error('Fel vid JSON-extraktion från modellen.');
  }
}

// Valideringsfunktion för att hantera saknade data
function validateAndCorrectData(data: any): any {
  const fields = [
    "ORG_NR", "REGNR", "FÖRARID", "STARTTID", "SLUTTID",
    "TAXITRAFIK_KM", "BETALDA_KM", "TURER", "DROSKNR",
    "RAPPORTNR", "BOM_AVBEST", "TOTALT_INKÖRT", "LÖNEGR_EX_MOMS",
    "KONTANT", "ATT_REDOVISA", "TOTAL_KREDIT"
  ];

  const momFields = ["6%", "25%", "BOM_AVBEST"];

  // Kontrollera och rätta saknade data för vanliga fält
  fields.forEach((field) => {
    if (!data[field]) {
      data[field] = null;
    }
  });

  // Kontrollera och rätta MOMS-fält
  data["MOMS"] = data["MOMS"] || {};
  momFields.forEach((rate) => {
    data["MOMS"][rate] = data["MOMS"][rate] || { BRUTTO: null, NETTO: null, MOMS_KR: null };
  });

  return data;
}

// Konvertera fil till Base64 Data URL
async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const base64String = reader.result as string;
        if (!base64String) {
          throw new Error('Kunde inte läsa filen.');
        }
        resolve(base64String); // Returnera hela Base64-strängen med "data:image/jpeg;base64,"
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(new Error('Kunde inte läsa filen.'));
    reader.readAsDataURL(file);
  });
}
