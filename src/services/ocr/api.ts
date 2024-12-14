import { OCR_CONFIG } from './config';
import { delay } from '../../utils/async';
import { normalizeOcrData } from './normalize';
import toast from 'react-hot-toast';

interface ApiResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

interface ApiError {
  error?: {
    message?: string;
    type?: string;
  };
  message?: string;
}

export async function makeApiRequest(base64Image: string, prompt: string, retryCount = 0): Promise<string> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), OCR_CONFIG.MAX_TIMEOUT);

  try {
    const headers = {
      ...OCR_CONFIG.HEADERS,
      'Authorization': `Bearer ${OCR_CONFIG.API_KEY}`
    };

    const response = await fetch(OCR_CONFIG.ENDPOINT, {
      method: 'POST',
      signal: controller.signal,
      headers,
      body: JSON.stringify({
        model: OCR_CONFIG.MODEL,
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              { type: 'image_url', image_url: base64Image }
            ]
          }
        ],
        stream: false,
        max_tokens: 4000,
        temperature: 0.1
      })
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData: ApiError = await response.json().catch(() => ({}));
      
      if (response.status === 403) {
        throw new Error('API-åtkomst nekad. Kontrollera API-nyckeln.');
      }

      if (response.status === 429 && retryCount < OCR_CONFIG.MAX_RETRIES) {
        const backoffDelay = OCR_CONFIG.RETRY_DELAY * Math.pow(2, retryCount);
        await delay(backoffDelay);
        return makeApiRequest(base64Image, prompt, retryCount + 1);
      }

      throw new Error(errorData.error?.message || 'Kunde inte ansluta till OCR-tjänsten');
    }

    const data: ApiResponse = await response.json();
    
    if (!data.choices?.[0]?.message?.content) {
      console.warn('No content in API response, using default data');
      return JSON.stringify(OCR_CONFIG.DEFAULT_DATA);
    }

    const content = data.choices[0].message.content.trim();
    
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.warn('No JSON found in response, using default data');
        return JSON.stringify(OCR_CONFIG.DEFAULT_DATA);
      }

      const parsedJson = JSON.parse(jsonMatch[0]);
      const normalizedData = normalizeOcrData(parsedJson);
      return JSON.stringify(normalizedData, null, 2);
    } catch (error) {
      console.error('Error parsing API response:', error);
      return JSON.stringify(OCR_CONFIG.DEFAULT_DATA);
    }
  } catch (error) {
    if (error.name === 'AbortError') {
      if (retryCount < OCR_CONFIG.MAX_RETRIES) {
        await delay(OCR_CONFIG.RETRY_DELAY);
        return makeApiRequest(base64Image, prompt, retryCount + 1);
      }
      throw new Error('Förfrågan tog för lång tid');
    }

    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}