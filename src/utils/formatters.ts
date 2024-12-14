export function formatCurrency(value: number | null | undefined): string {
  if (value === null || value === undefined) return '0,00 kr';
  return new Intl.NumberFormat('sv-SE', {
    style: 'currency',
    currency: 'SEK',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}

export function formatNumber(value: number | null | undefined): string {
  if (value === null || value === undefined) return '0,00';
  return new Intl.NumberFormat('sv-SE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}

export function formatDateTime(dateString: string): string {
  if (!dateString) return '';
  
  try {
    const [date, time] = dateString.split(' ');
    if (!date || !time) return dateString;
    
    const [year, month, day] = date.split('-');
    const [hour, minute] = time.split(':');
    
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')} ${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`;
  } catch (error) {
    console.warn('Error formatting date:', error);
    return dateString;
  }
}