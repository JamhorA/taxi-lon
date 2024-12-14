import React, { useState } from 'react';
import { createCar } from '../../services/carService';
import toast from 'react-hot-toast';

interface CarFormProps {
  companyId: string;
}

export default function CarForm({ companyId }: CarFormProps) {
  const [regNr, setRegNr] = useState('');
  const [droskNr, setDroskNr] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!regNr.trim() || !droskNr.trim()) {
        throw new Error('Registreringsnummer och drosknummer krävs');
      }

      await createCar({
        company_id: companyId,
        regnr: regNr.trim(),
        drosknr: droskNr.trim()
      });

      // Clear form
      setRegNr('');
      setDroskNr('');
    } catch (error) {
      console.error('Error adding car:', error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Kunde inte lägga till bilen');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="regNr" className="block text-sm font-medium text-gray-700">
          Registreringsnummer
        </label>
        <input
          type="text"
          id="regNr"
          value={regNr}
          onChange={(e) => setRegNr(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="ABC123"
          required
        />
      </div>

      <div>
        <label htmlFor="droskNr" className="block text-sm font-medium text-gray-700">
          Drosknummer
        </label>
        <input
          type="text"
          id="droskNr"
          value={droskNr}
          onChange={(e) => setDroskNr(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="1234"
          required
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
      >
        {isLoading ? 'Lägger till...' : 'Lägg till Bil'}
      </button>
    </form>
  );
}