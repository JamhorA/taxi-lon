import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Shift } from '../types/shift';
import toast from 'react-hot-toast';

interface UseShiftsProps {
  companyId: string;
  driverId?: string;
  dateRange?: {
    from: string;
    to: string;
  };
}

function getDefaultDateRange() {
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 2);

  return {
    from: firstDayOfMonth.toISOString().split('T')[0], // YYYY-MM-DD format
    to: today.toISOString().split('T')[0], // YYYY-MM-DD format
  };
}

export function useShifts({ companyId, driverId, dateRange }: UseShiftsProps) {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(false);

  // Använd standarddatum om inget datumintervall anges
  const effectiveDateRange = dateRange || getDefaultDateRange();

  useEffect(() => {
    if (companyId) {
      fetchShifts();
    }
  }, [companyId, driverId, effectiveDateRange]);

  const fetchShifts = async () => {
    console.log('Fetching shifts with parameters:', {
      companyId,
      driverId,
      from: effectiveDateRange.from,
      to: effectiveDateRange.to,
    });

    setLoading(true);
    try {
      // Bygga SQL-förfrågan
      let query = supabase
        .from('Shifts')
        .select(`
          id,
          start_time,
          end_time,
          taxi_km,
          paid_km,
          trips,
          report_nr,
          car:Cars!inner(regnr, drosknr),
          driver:Drivers!inner(id, name, forarid),
          cash,
          to_report,
          total_credit,
          drikskredit,
          lonegr_ex_moms,
          vat_details:VAT_Details(vat_rate, gross_income, net_income, vat_amount, type),
          bom_details:BOM_Details(moms_percentage, brutto, netto, moms_kr),
          total_inkort_details:Total_Inkort_Details(total_inkort, moms_percentage, brutto, netto, moms_kr)
        `)
        .eq('Cars.company_id', companyId)
        .order('start_time', { ascending: false });

      // Lägg till datumintervall
      if (effectiveDateRange.from) {
        query = query.gte('start_time', effectiveDateRange.from);
      }
      if (effectiveDateRange.to) {
        const adjustedEndDate = new Date(effectiveDateRange.to);
        adjustedEndDate.setHours(23, 59, 59, 999); // Justerar till slutet av dagen
        query = query.lte('end_time', adjustedEndDate.toISOString());
      }

      // Filtrera efter förare om tillämpligt
      if (driverId) {
        query = query.eq('driver_id', driverId);
      }

      // Utför förfrågan
      const { data, error } = await query;

      if (error) throw error;
      console.log('Fetched shifts:', data);

      setShifts(data || []);
    } catch (error) {
      console.error('Error fetching shifts:', error);
      toast.error('Kunde inte hämta skift');
    } finally {
      setLoading(false);
    }
  };

  return { shifts, loading, fetchShifts };
}





// import { useState, useEffect } from 'react';
// import { supabase } from '../lib/supabase';
// import { Shift } from '../types/shift';
// import toast from 'react-hot-toast';

// interface UseShiftsProps {
//   companyId: string;
//   driverId?: string;
//   dateRange?: {
//     from: string;
//     to: string;
//   };
// }

// function getDefaultDateRange() {
//   const today = new Date();
//   const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

//   return {
//     from: firstDayOfMonth.toISOString().split('T')[0], // YYYY-MM-DD format
//     to: today.toISOString().split('T')[0], // YYYY-MM-DD format
//   };
// }

// export function useShifts({ companyId, driverId, dateRange }: UseShiftsProps) {
//   const [shifts, setShifts] = useState<Shift[]>([]);
//   const [loading, setLoading] = useState(false);

//   const effectiveDateRange = dateRange || getDefaultDateRange();

//   useEffect(() => {
//     if (companyId) {
//       fetchShifts();
//     }
//   }, [companyId, driverId, effectiveDateRange]);

//   const fetchShifts = async () => {
//     console.log('Fetching shifts with:', {
//   companyId,
//   driverId,
//   from: effectiveDateRange.from,
//   to: effectiveDateRange.to,
// });

//     setLoading(true);
//     try {
//       let query = supabase
//         .from('Shifts')
//         .select(`
//           id,
//           start_time,
//           end_time,
//           taxi_km,
//           paid_km,
//           trips,
//           report_nr,
//           car:Cars!inner(regnr, drosknr),
//           driver:Drivers!inner(id, name),
//           cash,
//           to_report,
//           total_credit,
//           drikskredit,
//           lonegr_ex_moms
//         `)
//         .eq('Cars.company_id', companyId)
//         .order('start_time', { ascending: false });

//       if (effectiveDateRange.from) {
//         query = query.gte('start_time', effectiveDateRange.from);
//       }
//       if (effectiveDateRange.to) {
//         const adjustedEndDate = new Date(effectiveDateRange.to);
//         adjustedEndDate.setHours(23, 59, 59, 999); // Slutet av dagen
//         query = query.lte('end_time', adjustedEndDate.toISOString());
//       }
//       if (driverId) {
//         query = query.eq('driver_id', driverId);
//       }

//       const { data, error } = await query;

//       if (error) throw error;
//       setShifts(data || []);
//     } catch (error) {
//       console.error('Error fetching shifts:', error);
//       toast.error('Kunde inte hämta skift');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return { shifts, loading, fetchShifts };
// }





// import { useState, useEffect } from 'react';
// import { supabase } from '../lib/supabase';
// import { Shift } from '../types/shift';
// import toast from 'react-hot-toast';

// interface UseShiftsProps {
//   companyId: string;
//   driverId?: string;
//   dateRange?: {
//     from: string;
//     to: string;
//   };
// }
// export function useShifts({ companyId, driverId, dateRange }: UseShiftsProps) {
//   const [shifts, setShifts] = useState<Shift[]>([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (companyId) {
//       fetchShifts();
//     }
//   }, [companyId, driverId, dateRange]);

//   const fetchShifts = async () => {
//     setLoading(true);
//     try {
//       let query = supabase
//         .from('Shifts')
//         .select(`
//           id,
//           start_time,
//           end_time,
//           taxi_km,
//           paid_km,
//           trips,
//           report_nr,
//           car:Cars!inner(regnr, drosknr),
//           driver:Drivers!inner(id, name),
//           cash,
//           to_report,
//           total_credit,
//           drikskredit,
//           lonegr_ex_moms
//         `)
//         .eq('Cars.company_id', companyId)
//         .order('start_time', { ascending: false });

//       if (dateRange?.from) {
//         query = query.gte('start_time', dateRange.from);
//       }
//       if (dateRange?.to) {
//         const adjustedEndDate = new Date(dateRange.to);
//         adjustedEndDate.setHours(23, 59, 59, 999); // Slutet av dagen
//         query = query.lte('end_time', adjustedEndDate.toISOString());
//       }
//       if (driverId) {
//         query = query.eq('driver_id', driverId);
//       }

//       const { data, error } = await query;

//       if (error) throw error;
//       setShifts(data || []);
//     } catch (error) {
//       console.error('Error fetching shifts:', error);
//       toast.error('Kunde inte hämta skift');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return { shifts, loading, fetchShifts };
// }
