import toast from 'react-hot-toast';

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_CLAUDE_SONNET_API_KEY;

if (!OPENROUTER_API_KEY) {
  throw new Error('OpenRouter API-nyckeln saknas. Kontrollera att VITE_OPENROUTER_CLAUDE_SONNET_API_KEY är korrekt inställd i .env-filen.');
}

export async function extractTextWithClaude(file: File): Promise<string> {
  try {
    const base64Image = await fileToBase64(file);

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': window.location.href,
        'X-Title': 'OCR Web Application'
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3.5-sonnet',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Extract and return only the following information from this receipt in a structured format:
            
                - ORG NR
                - REGNR
                - FÖRARID
                - STARTTID
                - SLUTTID
                - TAXITRAFIK KM
                - BETALDA KM
                - TURER
                - DROSKNR
                - RAPPORTNR
                - BOM/AVBEST
                - TOTALT INKÖRT
                - MOMS KR (include variations such as 6%, 25%, or BOM/AVBEST if they exist)
                - MOMS%   BRUTTO   NETTO   MOMS KR (include all variations such as 6%, 25%, or BOM/AVBEST if they exist)
                - LÖNEGR. EX.MOMS
                - KONTANT
                - ATT REDOVISA
                - TOTAL KREDIT.

                Please maintain the exact formatting and structure of the receipt.`
              },
              {
                type: 'image_url',
                image_url: base64Image
              }
            ]
          }
        ]
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Fel vid anrop till Claude API');
    }

    const data = await response.json();
    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Ingen text kunde extraheras från bilden.');
    }

    return data.choices[0].message.content.trim();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Ett okänt fel uppstod';
    console.error('Claude OCR error:', errorMessage);
    toast.error(`Claude: ${errorMessage}`);
    throw error;
  }
}

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      try {
        const base64String = reader.result as string;
        if (!base64String) {
          throw new Error('Kunde inte läsa filen.');
        }
        resolve(base64String);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = (error) => reject(new Error('Kunde inte läsa filen: ' + error));
  });
}