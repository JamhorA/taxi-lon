import { makeApiRequest } from './ocr/api';
import { getOcrPrompt } from './ocr/prompt';
import { normalizeOcrData } from './ocr/normalize';
import toast from 'react-hot-toast';

export async function extractFullImageText(file: File): Promise<string> {
  const toastId = toast.loading('Bearbetar bild...');

  try {
    // Validate file size
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new Error('Filen är för stor. Maximal storlek är 10MB.');
    }

    // Validate file type
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      throw new Error('Ogiltigt filformat. Endast JPEG, PNG och WebP stöds.');
    }

    const base64Image = await fileToBase64(file);
    
    toast.loading('Analyserar bild...', { id: toastId });
    
    let response: string;
    try {
      response = await makeApiRequest(base64Image, getOcrPrompt());
    } catch (apiError) {
      if (apiError.message.includes('API-åtkomst nekad')) {
        toast.error('API-åtkomst nekad. Kontrollera API-nyckeln och försök igen.', { id: toastId });
      } else {
        toast.error(`OCR-fel: ${apiError.message}`, { id: toastId });
      }
      throw apiError;
    }

    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Inget giltigt JSON-svar hittades');
      }

      const parsedJson = JSON.parse(jsonMatch[0]);
      const normalizedData = normalizeOcrData(parsedJson);

      // Validate required fields
      const requiredFields = [
        'org_nr', 'regnr', 'forarid', 'start_time', 'end_time',
        'taxitrafik_km', 'betalda_km', 'turer', 'drosknr', 'rapportnr'
      ];

      const missingFields = requiredFields.filter(field => !normalizedData[field]);
      if (missingFields.length > 0) {
        throw new Error(`Saknade fält: ${missingFields.join(', ')}`);
      }

      toast.success('Text extraherad framgångsrikt', { id: toastId });
      return JSON.stringify(normalizedData, null, 2);
    } catch (parseError) {
      console.error('Error parsing JSON response:', parseError);
      toast.error('Kunde inte tolka svaret som JSON', { id: toastId });
      throw new Error('Kunde inte tolka svaret som JSON');
    }
  } catch (error) {
    handleError(error, toastId);
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

function handleError(error: unknown, toastId?: string): void {
  const errorMessage = error instanceof Error ? error.message : 'Ett okänt fel uppstod';
  console.error('OCR error:', errorMessage);
  
  if (toastId) {
    toast.error(`OCR: ${errorMessage}. Försök igen.`, { id: toastId });
  } else {
    toast.error(`OCR: ${errorMessage}. Försök igen.`);
  }
}