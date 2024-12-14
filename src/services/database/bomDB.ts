import { supabase } from '../../lib/supabase';
import type { BomDetailData } from '../validation/bomValidation';

export async function insertBomDetails(details: BomDetailData[]) {
  if (!details || details.length === 0) return;

  const { error } = await supabase
    .from('BOM_Details')
    .insert(details);

  if (error) {
    console.error('Database error inserting BOM details:', error);
    throw new Error(`Failed to insert BOM details: ${error.message}`);
  }
}

export async function getBomDetails(shiftId: string) {
  const { data, error } = await supabase
    .from('BOM_Details')
    .select('*')
    .eq('shift_id', shiftId);

  if (error) {
    console.error('Database error fetching BOM details:', error);
    throw new Error(`Failed to fetch BOM details: ${error.message}`);
  }

  return data;
}