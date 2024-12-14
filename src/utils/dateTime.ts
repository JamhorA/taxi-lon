import { format, parse } from 'date-fns';
import { sv } from 'date-fns/locale';

export function validateDateRange(startTime: string, endTime: string): boolean {
  if (!startTime || !endTime) {
    return false;
  }

  try {
    return startTime <= endTime;
  } catch (error) {
    console.error('Error validating date range:', error);
    return false;
  }
}

export function formatDateTime(dateString: string): string {
  if (!dateString) return '';
  
  // If already in correct format, return as is
  if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(dateString)) {
    return dateString;
  }

  try {
    // Parse and format the date string
    const [datePart, timePart] = dateString.split(' ');
    const [year, month, day] = datePart.split('-');
    const [hour, minute] = timePart.split(':');
    
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')} ${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`;
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
}

export function formatDateTimeForDB(dateString: string): string {
  if (!dateString) {
    throw new Error('Date string is required');
  }

  // If already in YYYY-MM-DD HH:mm format, return as is
  if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(dateString)) {
    return dateString;
  }

  try {
    // Parse and format the date string
    const [datePart, timePart] = dateString.split(' ');
    const [year, month, day] = datePart.split('-');
    const [hour, minute] = timePart.split(':');
    
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')} ${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`;
  } catch (error) {
    console.error('Error formatting date for DB:', error);
    throw error;
  }
}

export function parseDateTime(dateString: string): Date {
  try {
    const [datePart, timePart] = dateString.split(' ');
    const [year, month, day] = datePart.split('-');
    const [hour, minute] = timePart.split(':');
    
    return new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
      parseInt(hour),
      parseInt(minute)
    );
  } catch (error) {
    throw new Error(`Invalid date format: ${dateString}`);
  }
}

export function formatISOString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hour}:${minute}`;
}