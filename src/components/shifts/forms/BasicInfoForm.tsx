import React, { useEffect, useState } from 'react';
import { Clock, Car, User, FileText } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import toast from 'react-hot-toast';

interface BasicInfoFormProps {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
}

interface Company {
  id: string;
  org_nr: string;
  name: string;
}

interface Car {
  id: string;
  regnr: string;
  drosknr: string;
}

interface Driver {
  id: string;
  forarid: string;
  name: string;
}

export default function BasicInfoForm({ data, onUpdate, onNext }: BasicInfoFormProps) {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [cars, setCars] = useState<Car[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch companies
      const { data: companiesData, error: companiesError } = await supabase
        .from('Companies')
        .select('id, org_nr, name');
      
      if (companiesError) throw companiesError;
      setCompanies(companiesData || []);

      // Fetch cars
      const { data: carsData, error: carsError } = await supabase
        .from('Cars')
        .select('id, regnr, drosknr');
      
      if (carsError) throw carsError;
      setCars(carsData || []);

      // Fetch drivers
      const { data: driversData, error: driversError } = await supabase
        .from('Drivers')
        .select('id, forarid, name');
      
      if (driversError) throw driversError;
      setDrivers(driversData || []);

    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Kunde inte hämta data');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'regnr') {
      const selectedCar = cars.find(car => car.regnr === value);
      if (selectedCar) {
        onUpdate({
          regnr: value,
          drosknr: selectedCar.drosknr
        });
      }
    } else {
      onUpdate({ [name]: value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Organisationsnummer
          </label>
          <select
            name="org_nr"
            value={data.org_nr}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          >
            <option value="">Välj organisationsnummer</option>
            {companies.map((company) => (
              <option key={company.id} value={company.org_nr}>
                {company.org_nr} - {company.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Registreringsnummer
          </label>
          <select
            name="regnr"
            value={data.regnr}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          >
            <option value="">Välj registreringsnummer</option>
            {cars.map((car) => (
              <option key={car.id} value={car.regnr}>
                {car.regnr} (Drosk: {car.drosknr})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Förar-ID
          </label>
          <select
            name="forarid"
            value={data.forarid}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          >
            <option value="">Välj förare</option>
            {drivers.map((driver) => (
              <option key={driver.id} value={driver.forarid}>
                {driver.forarid} - {driver.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Drosknummer
          </label>
          <input
            type="text"
            name="drosknr"
            value={data.drosknr}
            readOnly
            className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Starttid (YYYY-MM-DD HH:mm)
          </label>
          <input
            type="text"
            name="starttid"
            value={data.starttid}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="2024-03-28 14:30"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Sluttid (YYYY-MM-DD HH:mm)
          </label>
          <input
            type="text"
            name="sluttid"
            value={data.sluttid}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="2024-03-28 15:45"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Rapportnummer
          </label>
          <input
            type="text"
            name="rapportnr"
            value={data.rapportnr}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSubmit}
          className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Nästa
        </button>
      </div>
    </div>
  );
}