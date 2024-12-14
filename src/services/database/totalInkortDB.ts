import { supabase } from '../../lib/supabase';
import { TotalInkortDetailData } from '../validation/totalInkortValidation';

export async function insertTotalInkortDetails(details: TotalInkortDetailData[]) {
  const { error } = await supabase
    .from('Total_Inkort_Details')
    .insert(details);

  if (error) {
    console.error('Database error inserting total inkört details:', error);
    throw new Error(`Failed to insert total inkört details: ${error.message}`);
  }
}

export async function getTotalInkortDetails(shiftId: string) {
  const { data, error } = await supabase
    .from('Total_Inkort_Details')
    .select('*')
    .eq('shift_id', shiftId);

  if (error) {
    console.error('Database error fetching total inkört details:', error);
    throw new Error(`Failed to fetch total inkört details: ${error.message}`);
  }

  return data;
}