
import { OCR_CONFIG } from './config';

export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function normalizeDateTime(dateStr: string): string {
  if (!dateStr) return '';
  
  try {
    dateStr = dateStr.trim();
    
    if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(dateStr)) {
      return dateStr;
    }
    
    const formats = [
      /^(\d{4})-(\d{1,2})-(\d{1,2})\s+(\d{1,2}):(\d{1,2})$/,
      /^(\d{2})\/(\d{2})\/(\d{4})\s+(\d{1,2}):(\d{1,2})$/,
      /^(\d{2})-(\d{2})-(\d{4})\s+(\d{1,2}):(\d{1,2})$/,
      /^(\d{4})(\d{2})(\d{2})\s+(\d{2})(\d{2})$/
    ];

    for (const format of formats) {
      const match = dateStr.match(format);
      if (match) {
        const [_, year, month, day, hour, minute] = match;
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')} ${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`;
      }
    }
    
    return '';
  } catch (error) {
    console.warn('Date normalization failed:', error);
    return '';
  }
}

export async function withRetry<T>(
  operation: () => Promise<T>,
  retries = OCR_CONFIG.MAX_RETRIES,
  baseDelay = OCR_CONFIG.RETRY_DELAY
): Promise<T> {
  let lastError: Error;

  for (let i = 0; i < retries; i++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');
      
      if (i < retries - 1) {
        const delayTime = baseDelay * Math.pow(2, i);
        await delay(delayTime);
      }
    }
  }

  throw lastError;
}

export function validateFile(file: File): void {
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    throw new Error('Filen är för stor. Maximal storlek är 10MB.');
  }

  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Ogiltigt filformat. Endast JPEG, PNG och WebP stöds.');
  }
}

export async function fileToBase64(file: File): Promise<string> {
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
    reader.onerror = () => reject(new Error('Kunde inte läsa filen'));
  });
}