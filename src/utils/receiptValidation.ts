import { toast } from 'react-hot-toast';

export interface KilometerValidation {
  isValid: boolean;
  message: string;
}

export function validateKilometers(taxiKm: number, paidKm: number): KilometerValidation {
  if (taxiKm < paidKm) {
    return {
      isValid: false,
      message: `Ogiltig data: Taxitrafik KM (${taxiKm}) måste vara större än Betalda KM (${paidKm})`
    };
  }
  return {
    isValid: true,
    message: 'Kilometer data är giltig'
  };
}