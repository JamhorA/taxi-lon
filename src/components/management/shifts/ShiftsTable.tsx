// import React from 'react';
// import Pagination from './Pagination';
// import ShiftsTableSkeleton from './ShiftsTableSkeleton';
// import { Clock, Car, User, FileText } from 'lucide-react';
// import { formatDateTime } from '../../../utils/dateTime';
// import { Shift } from '../../../types/shift';

// interface ShiftsTableProps {
//   shifts: Shift[];
//   onShiftClick: (shift: Shift) => void;
//   loading: boolean;
//   currentPage: number;
//   totalPages: number;
//   onPageChange: (page: number) => void;
// }

// export default function ShiftsTable({
//   shifts,
//   onShiftClick,
//   loading,
//   currentPage,
//   totalPages,
//   onPageChange
// }: ShiftsTableProps) {
//   if (loading) {
//     return <ShiftsTableSkeleton />;
//   }

//   if (shifts.length === 0) {
//     return (
//       <div className="text-center py-8">
//         <p className="text-gray-600">Inga skift att visa</p>
//       </div>
//     );
//   }

//   return (
//     <div className="overflow-x-auto">
//       <table className="min-w-full divide-y divide-gray-200">
//         <thead className="bg-gray-50">
//           <tr>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//               Datum
//             </th>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//               Bil
//             </th>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//               Förare
//             </th>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//               Rapport
//             </th>
//             <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//               Total Kredit
//             </th>
//           </tr>
//         </thead>
//         <tbody className="bg-white divide-y divide-gray-200">
//           {shifts.map(shift => (
//             <tr
//               key={shift.id}
//               onClick={() => onShiftClick(shift)}
//               className="hover:bg-gray-50 cursor-pointer"
//             >
//               <td className="px-6 py-4 whitespace-nowrap">
//                 <div className="flex items-center text-sm text-gray-900">
//                   <Clock className="h-4 w-4 text-gray-400 mr-2" />
//                   {formatDateTime(shift.start_time)}
//                 </div>
//               </td>
//               <td className="px-6 py-4 whitespace-nowrap">
//                 <div className="flex items-center text-sm text-gray-900">
//                   <Car className="h-4 w-4 text-gray-400 mr-2" />
//                   {shift.car.regnr} ({shift.car.drosknr})
//                 </div>
//               </td>
//               <td className="px-6 py-4 whitespace-nowrap">
//                 <div className="flex items-center text-sm text-gray-900">
//                   <User className="h-4 w-4 text-gray-400 mr-2" />
//                   {shift.driver.name}
//                 </div>
//               </td>
//               <td className="px-6 py-4 whitespace-nowrap">
//                 <div className="flex items-center text-sm text-gray-900">
//                   <FileText className="h-4 w-4 text-gray-400 mr-2" />
//                   {shift.report_nr}
//                 </div>
//               </td>
//               <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
//                 {new Intl.NumberFormat('sv-SE', {
//                   style: 'currency',
//                   currency: 'SEK'
//                 }).format(shift.total_credit || 0)}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       <Pagination
//         currentPage={currentPage}
//         totalPages={totalPages}
//         onPageChange={onPageChange}
//       />
//     </div>
//   );
// }





// import React from 'react';
// import Pagination from './Pagination';
// import ShiftsTableSkeleton from './ShiftsTableSkeleton';
// import { Clock, Car, User, FileText } from 'lucide-react';
// import { formatDateTime } from '../../../utils/dateTime';
// import { Shift } from '../../../types/shift';

// interface ShiftsTableProps {
//   shifts: Shift[];
//   onShiftClick: (shift: Shift) => void;
//   loading: boolean;
//   currentPage: number;
//   totalPages: number;
//   onPageChange: (page: number) => void;
// }

// export default function ShiftsTable({
//   shifts,
//   onShiftClick,
//   loading,
//   currentPage,
//   totalPages,
//   onPageChange
// }: ShiftsTableProps) {
//   if (loading) {
//     return <ShiftsTableSkeleton />;
//   }

//   return (
//     <div className="overflow-x-auto">
//       <table className="min-w-full divide-y divide-gray-200">
//         <thead className="bg-gray-50">
//           <tr>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//               Datum
//             </th>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//               Bil
//             </th>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//               Förare
//             </th>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//               Rapport
//             </th>
//             <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//               Total Kredit
//             </th>
//           </tr>
//         </thead>
//         <tbody className="bg-white divide-y divide-gray-200">
//           {shifts.map(shift => (
//             <tr
//               key={shift.id}
//               onClick={() => onShiftClick(shift)}
//               className="hover:bg-gray-50 cursor-pointer"
//             >
//               <td className="px-6 py-4 whitespace-nowrap">
//                 <div className="flex items-center text-sm text-gray-900">
//                   <Clock className="h-4 w-4 text-gray-400 mr-2" />
//                   {formatDateTime(shift.start_time)}
//                 </div>
//               </td>
//               <td className="px-6 py-4 whitespace-nowrap">
//                 <div className="flex items-center text-sm text-gray-900">
//                   <Car className="h-4 w-4 text-gray-400 mr-2" />
//                   {shift.car.regnr} ({shift.car.drosknr})
//                 </div>
//               </td>
//               <td className="px-6 py-4 whitespace-nowrap">
//                 <div className="flex items-center text-sm text-gray-900">
//                   <User className="h-4 w-4 text-gray-400 mr-2" />
//                   {shift.driver.name}
//                 </div>
//               </td>
//               <td className="px-6 py-4 whitespace-nowrap">
//                 <div className="flex items-center text-sm text-gray-900">
//                   <FileText className="h-4 w-4 text-gray-400 mr-2" />
//                   {shift.report_nr}
//                 </div>
//               </td>
//               <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
//                 {new Intl.NumberFormat('sv-SE', {
//                   style: 'currency',
//                   currency: 'SEK'
//                 }).format(shift.total_credit || 0)}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       <Pagination
//         currentPage={currentPage}
//         totalPages={totalPages}
//         onPageChange={onPageChange}
//       />
//     </div>
//   );
// }





// import React from 'react';
// import { Clock, Car, User, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
// import { formatDateTime } from '../../../utils/dateTime';
// import { Shift } from '../../../types/shift';

// interface ShiftsTableProps {
//   shifts: Shift[];
//   onShiftClick: (shift: Shift) => void;
//   loading: boolean;
//   currentPage: number;
//   totalPages: number;
//   onPageChange: (newPage: number) => void;
// }

// export default function ShiftsTable({
//   shifts,
//   onShiftClick,
//   loading,
//   currentPage,
//   totalPages,
//   onPageChange
// }: ShiftsTableProps) {
//   if (loading) {
//     return (
//       <div className="text-center py-8">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
//         <p className="mt-2 text-gray-600">Laddar skift...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-4">
//       <div className="overflow-x-auto">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Datum
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Bil
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Förare
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Rapport
//               </th>
//               <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Total Kredit
//               </th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {shifts.length > 0 ? (
//               shifts.map((shift) => (
//                 <tr
//                   key={shift.id}
//                   onClick={() => onShiftClick(shift)}
//                   className="hover:bg-gray-50 cursor-pointer"
//                 >
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="flex items-center text-sm text-gray-900">
//                       <Clock className="h-4 w-4 text-gray-400 mr-2" />
//                       {formatDateTime(shift.start_time)}
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="flex items-center text-sm text-gray-900">
//                       <Car className="h-4 w-4 text-gray-400 mr-2" />
//                       {shift.car.regnr} ({shift.car.drosknr})
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="flex items-center text-sm text-gray-900">
//                       <User className="h-4 w-4 text-gray-400 mr-2" />
//                       {shift.driver.name}
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="flex items-center text-sm text-gray-900">
//                       <FileText className="h-4 w-4 text-gray-400 mr-2" />
//                       {shift.report_nr}
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
//                     {new Intl.NumberFormat('sv-SE', {
//                       style: 'currency',
//                       currency: 'SEK'
//                     }).format(shift.total_credit || 0)}
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
//                   Inga skift hittades
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       <div className="flex justify-between items-center px-6">
//         <button
//           onClick={() => onPageChange(currentPage - 1)}
//           disabled={currentPage <= 1}
//           className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
//             currentPage <= 1
//               ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
//               : 'bg-blue-600 text-white hover:bg-blue-700'
//           }`}
//         >
//           <ChevronLeft className="w-4 h-4 mr-2" />
//           Föregående
//         </button>
//         <p className="text-sm text-gray-600">
//           Sida {currentPage} av {totalPages}
//         </p>
//         <button
//           onClick={() => onPageChange(currentPage + 1)}
//           disabled={currentPage >= totalPages}
//           className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
//             currentPage >= totalPages
//               ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
//               : 'bg-blue-600 text-white hover:bg-blue-700'
//           }`}
//         >
//           Nästa
//           <ChevronRight className="w-4 h-4 ml-2" />
//         </button>
//       </div>
//     </div>
//   );
// }





import React from 'react';
import { Clock, Car, User, FileText } from 'lucide-react';
import { formatDateTime } from '../../../utils/dateTime';
import { Shift } from '../../../types/shift';

interface ShiftsTableProps {
  shifts: Shift[];
  onShiftClick: (shift: Shift) => void;
  loading: boolean;
}

export default function ShiftsTable({ shifts, onShiftClick, loading }: ShiftsTableProps) {
  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Laddar skift...</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Datum
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Bil
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Förare
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Rapport
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total Kredit
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {shifts.map((shift) => (
            <tr
              key={shift.id}
              onClick={() => onShiftClick(shift)}
              className="hover:bg-gray-50 cursor-pointer"
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center text-sm text-gray-900">
                  <Clock className="h-4 w-4 text-gray-400 mr-2" />
                  {formatDateTime(shift.start_time)}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center text-sm text-gray-900">
                  <Car className="h-4 w-4 text-gray-400 mr-2" />
                  {shift.car.regnr} ({shift.car.drosknr})
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center text-sm text-gray-900">
                  <User className="h-4 w-4 text-gray-400 mr-2" />
                  {shift.driver.name}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center text-sm text-gray-900">
                  <FileText className="h-4 w-4 text-gray-400 mr-2" />
                  {shift.report_nr}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                {new Intl.NumberFormat('sv-SE', {
                  style: 'currency',
                  currency: 'SEK'
                }).format(shift.total_credit || 0)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}