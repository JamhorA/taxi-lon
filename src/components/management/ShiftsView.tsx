import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useCompany } from '../../hooks/useCompany';
import { useShifts } from '../../hooks/useShifts';
import ShiftsFilters from './shifts/ShiftsFilters';
import ShiftsTable from './shifts/ShiftsTable';
import ShiftDetailModal from './ShiftDetailModal';
import ShiftsSummary from './ShiftsSummary';
import SalarySpecView from './SalarySpecView';
import toast from 'react-hot-toast';
import { Driver, Shift } from '../../types/shift';
import { format } from 'date-fns';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

function getDefaultDateRange() {
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 2);
  return {
    from: firstDayOfMonth.toISOString().split('T')[0],
    to: today.toISOString().split('T')[0],
  };
}

export default function ShiftsView() {
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
  const { companies } = useCompany();
  const [selectedCompany, setSelectedCompany] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState(getDefaultDateRange());
  const [selectedDriver, setSelectedDriver] = useState<string>('');
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [companyAddress, setCompanyAddress] = useState({
    address: '',
    postalCode: '',
    city: '',
  });
  const [showStaticSpec, setShowStaticSpec] = useState(false);
  const [showSalarySpec, setShowSalarySpec] = useState(false);
  const [showShiftsTable, setShowShiftsTable] = useState(true);
  const [selectedDriverDetails, setSelectedDriverDetails] = useState<{
    name: string;
    forarid: string;
    efternamn: string;
    address: string;
    postalCode: string;
    city: string;
  } | null>(null);
  const [selectedTaxTable, setSelectedTaxTable] = useState<number | undefined>(undefined);

  const { shifts, loading } = useShifts({
    companyId: selectedCompany,
    driverId: selectedDriver,
    dateRange,
  });

  useEffect(() => {
    if (selectedCompany) {
      fetchDrivers();
      fetchCompanyAddress();
    }
    if(showShiftsTable){
        setShowSalarySpec(false);
        setShowShiftsTable(true);
        setShowStaticSpec(false);
    }
    if(showSalarySpec){
        setShowSalarySpec(true);
        setShowShiftsTable(false);
        setShowStaticSpec(true);
    }
  }, [selectedCompany, showSalarySpec, showShiftsTable, showStaticSpec]);

  const fetchDrivers = async () => {
    try {
      const { data, error } = await supabase
        .from('Drivers')
        .select(`
          id, 
          name, 
          efternamn, 
          forarid, 
          Driver_Addresses (
            Addresses (
              address, 
              postal_code, 
              city
            )
          )
        `)
        .eq('company_id', selectedCompany);

      if (error) throw error;

      const mappedDrivers = data.map((driver) => {
        const addressInfo = driver.Driver_Addresses?.[0]?.Addresses || {};
        return {
          id: driver.id,
          name: driver.name,
          efternamn: driver.efternamn,
          forarid: driver.forarid,
          address: addressInfo.address || '',
          postalCode: addressInfo.postal_code || '',
          city: addressInfo.city || '',
        };
      });

      setDrivers(mappedDrivers);
    } catch (error) {
      console.error('Error fetching drivers:', error);
      toast.error('Kunde inte hämta förare och adresser');
    }
  };

  const fetchCompanyAddress = async () => {
    try {
      const { data, error } = await supabase
        .from('Company_Addresses')
        .select(`
          Addresses (
            address,
            postal_code,
            city
          )
        `)
        .eq('company_id', selectedCompany);

      if (error) throw error;

      const addressInfo = data[0]?.Addresses || {};
      setCompanyAddress({
        address: addressInfo.address || '',
        postalCode: addressInfo.postal_code || '',
        city: addressInfo.city || '',
      });
    } catch (error) {
      console.error('Error fetching company address:', error);
      toast.error('Kunde inte hämta företagsadress');
    }
  };

  const validateDateRange = (from: string, to: string) => {
    if (new Date(from) > new Date(to)) {
      toast.error('Från datum kan inte vara senare än Till datum');
      return false;
    }
    return true;
  };

  const handleDateRangeChange = (field: string, value: string) => {
    setDateRange((prev) => {
      const updatedRange = { ...prev, [field]: value };
      if (validateDateRange(updatedRange.from, updatedRange.to)) {
        return updatedRange;
      }
      return prev;
    });
  };

  const filteredShifts = shifts.filter((shift) => {
    const searchString = searchTerm.toLowerCase();
    return (
      shift.car?.regnr?.toLowerCase().includes(searchString) ||
      shift.driver?.name?.toLowerCase().includes(searchString) ||
      shift.report_nr?.toLowerCase().includes(searchString)
    );
  });

  const summaryData = filteredShifts.reduce(
    (acc, shift) => ({
      totalIncome: acc.totalIncome + (shift.total_credit || 0),
      totalTrips: acc.totalTrips + (shift.trips || 0),
      totalTaxiKm: acc.totalTaxiKm + (shift.taxi_km || 0),
      totalPaidKm: acc.totalPaidKm + (shift.paid_km || 0),
      totalSalaryBase: acc.totalSalaryBase + (shift.lonegr_ex_moms || 0),
    }),
    { totalIncome: 0, totalTrips: 0, totalTaxiKm: 0, totalPaidKm: 0, totalSalaryBase: 0 }
  );

  const handleViewSalarySpec = () => {
    if (!selectedDriver || !dateRange.from || !dateRange.to) {
      toast.error('Välj förare och datumintervall för att visa lönespecifikationen');
      return;
    }

    const driver = drivers.find((d) => d.id === selectedDriver);
    if (!driver) {
      toast.error('Förare kunde inte hittas');
      return;
    }

    setSelectedDriverDetails({
      name: driver.name,
      efternamn: driver.efternamn,
      forarid: driver.forarid,
      address: driver.address,
      postalCode: driver.postalCode,
      city: driver.city,
    });

    setShowStaticSpec(true);
  };
  const salarySpecData = {
    driverId: selectedDriverDetails?.forarid || '',
    driverName: selectedDriverDetails?.name || '',
    driverLastname: selectedDriverDetails?.efternamn || '',
    driverAddress: selectedDriverDetails?.address || '',
    driverPostalCode: selectedDriverDetails?.postalCode || '',
    driverCity: selectedDriverDetails?.city || '',
    paymentDate: new Date().toISOString().split('T')[0],
    salaryPeriod: { from: dateRange.from, to: dateRange.to },
    companyName: companies.find((c) => c.id === selectedCompany)?.name || '',
    companyAddress: companyAddress,
    taxTable: selectedTaxTable || 0,
    salaryBase: summaryData.totalSalaryBase,
    percentSalary: summaryData.totalSalaryBase * 0.37,
    
    vacationSalary: summaryData.totalSalaryBase * 0.37 * 0.13,
  
    tax:
      (summaryData.totalSalaryBase * 0.37 + summaryData.totalSalaryBase * 0.37 * 0.13) *
      ((selectedTaxTable || 0) / 100),
  
    grossSalary:
      summaryData.totalSalaryBase * 0.37 + summaryData.totalSalaryBase * 0.37 * 0.13,
  
    netSalary:
      summaryData.totalSalaryBase * 0.37 +
      summaryData.totalSalaryBase * 0.37 * 0.13 -
      (summaryData.totalSalaryBase * 0.37 + summaryData.totalSalaryBase * 0.37 * 0.13) *
        ((selectedTaxTable || 0) / 100),
  };
  

  const downloadSalarySpecPDF = async () => {
  const element = document.getElementById('salary-spec');
  if (!element) {
    toast.error('Inga data att ladda ner');
    return;
  }

  const canvas = await html2canvas(element, { scale: 2 }); // Öka skalan för bättre kvalitet
  const pdf = new jsPDF('p', 'mm', 'a4');
  const imgData = canvas.toDataURL('image/png');

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

  pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
  pdf.save('salary-specification.pdf');
};

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <ShiftsFilters
          companies={companies}
          drivers={drivers}
          selectedCompany={selectedCompany}
          selectedDriver={selectedDriver}
          dateRange={dateRange}
          searchTerm={searchTerm}
          onCompanyChange={setSelectedCompany}
          onDriverChange={setSelectedDriver}
          onDateRangeChange={handleDateRangeChange}
          onSearchChange={setSearchTerm}
        />

        <ShiftsSummary {...summaryData} />
        <div className="flex justify-between">
                          <button
            onClick={() => setShowShiftsTable((prev) => !prev)}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Visa körpassrapporter
          </button>
          <div></div>
                  <button
            onClick={() => setShowSalarySpec((prev) => !prev)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Visa lönespecifikation
          </button></div>
        {selectedDriver && dateRange.from && dateRange.to && showSalarySpec &&(
          <div className="flex justify-end mt-4 mb-4 space-x-4">

            <select
              value={selectedTaxTable || ''}
              onChange={(e) => setSelectedTaxTable(Number(e.target.value))}
              className="px-4 py-2 border rounded bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <option value="" disabled>
                Välj skattprocent
              </option>
              {Array.from({ length: 16 }, (_, i) => i + 20).map((number) => (
                <option key={number} value={number}>
                  {number}
                </option>
              ))}
            </select>
            <button
              onClick={handleViewSalarySpec}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Updatera lönespec
            </button>
                        <button
              onClick={downloadSalarySpecPDF}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Ladda ner lönespecifikation
            </button>
          </div>
        )}

        {showStaticSpec && selectedTaxTable >= 20 && (
          <div id="salary-spec" className=""
            >
            <SalarySpecView salaryData={salarySpecData} />
          </div>
        )}


                {showShiftsTable && (
          <ShiftsTable shifts={filteredShifts} onShiftClick={setSelectedShift} loading={loading} />
        )}
      </div>

      {selectedShift && (
        <ShiftDetailModal
          shift={selectedShift}
          onClose={() => setSelectedShift(null)}
        />
      )}
    </div>
  );
}

