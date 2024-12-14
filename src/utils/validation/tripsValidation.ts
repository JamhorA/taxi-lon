import { toast } from 'react-hot-toast';

export function validateTrips(trips: number): boolean {
  if (trips <= 0 || trips > 35) {
    return false;
  }
  return true;
}

export function normalizeTrips(trips: number): number {
  if (trips > 35) {
    console.log('Trips value exceeds maximum (35), setting to 0:', trips);
    toast.error('Antal turer kan inte vara större än 35');
    return 0;
  }
  if (trips <= 0) {
    console.log('Invalid trips value, setting to 0:', trips);
    return 0;
  }
  return trips;
}