import { supabase } from '../lib/supabase';
import { validateKilometers } from '../utils/receiptValidation';
import { validateTrips, normalizeTrips } from '../utils/validation/tripsValidation';
import toast from 'react-hot-toast';

interface ValidationResult {
  isValid: boolean;
  carExists: boolean;
  driverExists: boolean;
  companyExists: boolean;
  kmValid: boolean;
  tripsValid: boolean;
  details: {
    car?: {
      id: string;
      regnr: string;
      drosknr: string;
    };
    driver?: {
      id: string;
      forarid: string;
    };
    company?: {
      id: string;
      org_nr: string;
    };
  };
}

export async function validateReceiptData(jsonData: string): Promise<ValidationResult> {
  try {
    const data = JSON.parse(jsonData);
    console.log('Validating receipt data:', data);

    const result: ValidationResult = {
      isValid: false,
      carExists: false,
      driverExists: false,
      companyExists: false,
      kmValid: false,
      tripsValid: false,
      details: {}
    };

    // Validate kilometers
    const kmValidation = validateKilometers(data.taxitrafik_km, data.betalda_km);
    result.kmValid = kmValidation.isValid;
    if (!kmValidation.isValid) {
      toast.error(kmValidation.message);
    }

    // Validate trips
    const trips = Number(data.turer) || 0;
    result.tripsValid = validateTrips(trips);
    if (!result.tripsValid) {
      toast.error('Antal turer måste vara mellan 1 och 35');
      data.turer = normalizeTrips(trips);
    }

    // Check if company exists
    console.log('Checking company with org_nr:', data.org_nr);
    const { data: companies, error: companyError } = await supabase
      .from('Companies')
      .select('id, org_nr')
      .eq('org_nr', data.org_nr);

    if (companyError) {
      console.error('Error checking company:', companyError);
      throw companyError;
    }

    result.companyExists = companies && companies.length > 0;
    if (result.companyExists && companies) {
      result.details.company = companies[0];
      console.log('Found company:', companies[0]);
    }

    // Check if car exists
    console.log('Checking car with regnr:', data.regnr, 'and drosknr:', data.drosknr);
    const { data: cars, error: carError } = await supabase
      .from('Cars')
      .select('id, regnr, drosknr')
      .eq('regnr', data.regnr)
      .eq('drosknr', data.drosknr);

    if (carError) {
      console.error('Error checking car:', carError);
      throw carError;
    }

    result.carExists = cars && cars.length > 0;
    if (result.carExists && cars) {
      result.details.car = cars[0];
      console.log('Found car:', cars[0]);
    }

    // Check if driver exists
    console.log('Checking driver with forarid:', data.forarid);
    const { data: drivers, error: driverError } = await supabase
      .from('Drivers')
      .select('id, forarid')
      .eq('forarid', data.forarid);

    if (driverError) {
      console.error('Error checking driver:', driverError);
      throw driverError;
    }

    result.driverExists = drivers && drivers.length > 0;
    if (result.driverExists && drivers) {
      result.details.driver = drivers[0];
      console.log('Found driver:', drivers[0]);
    }

    // Set overall validity
    result.isValid = result.companyExists && result.carExists && result.driverExists && 
                    result.kmValid && result.tripsValid;

    // Show appropriate notifications
    if (!result.companyExists) {
      toast.error(`Företag med org.nr ${data.org_nr} hittades inte`);
    }
    if (!result.carExists) {
      toast.error(`Bil med reg.nr ${data.regnr} och drosknr ${data.drosknr} hittades inte`);
    }
    if (!result.driverExists) {
      toast.error(`Förare med ID ${data.forarid} hittades inte`);
    }
    if (result.isValid) {
      toast.success('All data validerad');
    }

    console.log('Validation result:', result);
    return result;
  } catch (error) {
    console.error('Error validating receipt data:', error);
    toast.error('Kunde inte validera kvittodata');
    throw error;
  }
}