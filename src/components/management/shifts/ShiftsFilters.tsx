import React from 'react';
import { Calendar, Search } from 'lucide-react';
import { Driver } from '../../../types/shift';

interface ShiftsFiltersProps {
  companies: Array<{ id: string; name: string; org_nr: string }>;
  drivers: Driver[];
  selectedCompany: string;
  selectedDriver: string;
  dateRange: { from: string; to: string };
  searchTerm: string;
  onCompanyChange: (value: string) => void;
  onDriverChange: (value: string) => void;
  onDateRangeChange: (field: 'from' | 'to', value: string) => void;
  onSearchChange: (value: string) => void;
}

export default function ShiftsFilters({
  companies,
  drivers,
  selectedCompany,
  selectedDriver,
  dateRange,
  searchTerm,
  onCompanyChange,
  onDriverChange,
  onDateRangeChange,
  onSearchChange,
}: ShiftsFiltersProps) {
  return (
    <div className="mb-6 space-y-4">
      {/* Företagsval */}
      <div>
        <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
          Välj företag
        </label>
        <select
          id="company"
          value={selectedCompany}
          onChange={(e) => onCompanyChange(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        >
          <option value="">Välj företag</option>
          {companies.map((company) => (
            <option key={company.id} value={company.id}>
              {company.name} ({company.org_nr})
            </option>
          ))}
        </select>
      </div>

      {/* Filtersektion */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Från datum */}
        <div>
          <label htmlFor="fromDate" className="block text-sm font-medium text-gray-700 mb-1">
            Från datum
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input
              type="date"
              id="fromDate"
              value={dateRange.from}
              onChange={(e) => onDateRangeChange('from', e.target.value)}
              className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Till datum */}
        <div>
          <label htmlFor="toDate" className="block text-sm font-medium text-gray-700 mb-1">
            Till datum
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input
              type="date"
              id="toDate"
              value={dateRange.to}
              onChange={(e) => onDateRangeChange('to', e.target.value)}
              className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Förare */}
        <div>
          <label htmlFor="driver" className="block text-sm font-medium text-gray-700 mb-1">
            Förare
          </label>
          <select
            id="driver"
            value={selectedDriver}
            onChange={(e) => onDriverChange(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200 focus:border-blue-500"
          >
            <option value="">Alla förare</option>
            {drivers.map((driver) => (
              <option key={driver.id} value={driver.id}>
                {driver.name} ({driver.forarid})
              </option>
            ))}
          </select>
        </div>

        {/* Sök */}
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            Sök
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              id="search"
              placeholder="Sök på reg.nr, förare eller rapport..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200 focus:border-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}



// import React from 'react';
// import { Calendar, Search } from 'lucide-react';
// import { Driver } from '../../../types/shift';

// interface ShiftsFiltersProps {
//   companies: Array<{ id: string; name: string; org_nr: string }>;
//   drivers: Driver[];
//   selectedCompany: string;
//   selectedDriver: string;
//   dateRange: { from: string; to: string };
//   searchTerm: string;
//   onCompanyChange: (value: string) => void;
//   onDriverChange: (value: string) => void;
//   onDateRangeChange: (field: 'from' | 'to', value: string) => void;
//   onSearchChange: (value: string) => void;
// }

// export default function ShiftsFilters({
//   companies,
//   drivers,
//   selectedCompany,
//   selectedDriver,
//   dateRange,
//   searchTerm,
//   onCompanyChange,
//   onDriverChange,
//   onDateRangeChange,
//   onSearchChange
// }: ShiftsFiltersProps) {
//   return (
//     <div className="mb-6">
//       <select
//         value={selectedCompany}
//         onChange={(e) => onCompanyChange(e.target.value)}
//         className="w-full p-2 border rounded-md mb-4"
//       >
//         <option value="">Välj företag</option>
//         {companies.map(company => (
//           <option key={company.id} value={company.id}>
//             {company.name} ({company.org_nr})
//           </option>
//         ))}
//       </select>

//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//         <div>
//           <label htmlFor="fromDate" className="block text-sm font-medium text-gray-700 mb-1">
//             Från datum
//           </label>
//           <div className="relative">
//             <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
//             <input
//               type="date"
//               id="fromDate"
//               value={dateRange.from}
//               onChange={(e) => onDateRangeChange('from', e.target.value)}
//               className="pl-10 w-full p-2 border rounded-md"
//             />
//           </div>
//         </div>
//         <div>
//           <label htmlFor="toDate" className="block text-sm font-medium text-gray-700 mb-1">
//             Till datum
//           </label>
//           <div className="relative">
//             <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
//             <input
//               type="date"
//               id="toDate"
//               value={dateRange.to}
//               onChange={(e) => onDateRangeChange('to', e.target.value)}
//               className="pl-10 w-full p-2 border rounded-md"
//             />
//           </div>
//         </div>
//         <div>
//           <label htmlFor="driver" className="block text-sm font-medium text-gray-700 mb-1">
//             Förare
//           </label>
//           <select
//             id="driver"
//             value={selectedDriver}
//             onChange={(e) => onDriverChange(e.target.value)}
//             className="w-full p-2 border rounded-md"
//           >
//             <option value="">Alla förare</option>
//             {drivers.map(driver => (
//               <option key={driver.id} value={driver.id}>
//                 {driver.name} ({driver.forarid})
//               </option>
//             ))}
//           </select>
//         </div>
//         <div>
//           <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
//             Sök
//           </label>
//           <div className="relative">
//             <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
//             <input
//               type="text"
//               id="search"
//               placeholder="Sök på reg.nr, förare eller rapport..."
//               value={searchTerm}
//               onChange={(e) => onSearchChange(e.target.value)}
//               className="pl-10 w-full p-2 border rounded-md"
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }