import React, { useState } from 'react';
import { createDriver } from '../../services/driverService';
import toast from 'react-hot-toast';

interface DriverFormProps {
  companyId: string;
}

export default function DriverForm({ companyId }: DriverFormProps) {
  const [name, setName] = useState('');
  const [efternamn, setEfternamn] = useState('');
  const [personnummer, setPersonnummer] = useState('');
  const [forarId, setForarId] = useState('');
  const [address, setAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [city, setCity] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!name.trim() || !forarId.trim() || !efternamn.trim() || !personnummer.trim() || !address.trim() || !postalCode.trim() || !city.trim()) {
        throw new Error('Alla fält måste vara ifyllda.');
      }

      // Skicka med de nya fälten till createDriver
      await createDriver({
        company_id: companyId,
        forarid: forarId.trim(),
        name: name.trim(),
        efternamn: efternamn.trim(),
        personnummer: personnummer.trim(),
        address: address.trim(),
        postal_code: postalCode.trim(),
        city: city.trim()
      });

      // Töm formuläret efter lyckad skapning
      setName('');
      setEfternamn('');
      setPersonnummer('');
      setForarId('');
      setAddress('');
      setPostalCode('');
      setCity('');
    } catch (error) {
      console.error('Error adding driver:', error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Kunde inte lägga till föraren');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Förnamn
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="John"
          required
        />
      </div>

      <div>
        <label htmlFor="efternamn" className="block text-sm font-medium text-gray-700">
          Efternamn
        </label>
        <input
          type="text"
          id="efternamn"
          value={efternamn}
          onChange={(e) => setEfternamn(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Doe"
          required
        />
      </div>

      <div>
        <label htmlFor="personnummer" className="block text-sm font-medium text-gray-700">
          Personnummer
        </label>
        <input
          type="text"
          id="personnummer"
          value={personnummer}
          onChange={(e) => setPersonnummer(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="YYYYMMDDXXXX"
          required
        />
      </div>

      <div>
        <label htmlFor="forarId" className="block text-sm font-medium text-gray-700">
          Förar-ID
        </label>
        <input
          type="text"
          id="forarId"
          value={forarId}
          onChange={(e) => setForarId(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="12345"
          required
        />
      </div>

      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
          Adress
        </label>
        <input
          type="text"
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Storgatan 1"
          required
        />
      </div>

      <div>
        <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
          Postnummer
        </label>
        <input
          type="text"
          id="postalCode"
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="12345"
          required
        />
      </div>

      <div>
        <label htmlFor="city" className="block text-sm font-medium text-gray-700">
          Stad
        </label>
        <input
          type="text"
          id="city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Stockholm"
          required
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
      >
        {isLoading ? 'Lägger till...' : 'Lägg till Förare'}
      </button>
    </form>
  );
}




// import React, { useState } from 'react';
// import { createDriver } from '../../services/driverService';
// import toast from 'react-hot-toast';

// interface DriverFormProps {
//   companyId: string;
// }

// export default function DriverForm({ companyId }: DriverFormProps) {
//   const [name, setName] = useState('');
//   const [forarId, setForarId] = useState('');
//   const [isLoading, setIsLoading] = useState(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);

//     try {
//       if (!name.trim() || !forarId.trim()) {
//         throw new Error('Namn och förar-ID krävs');
//       }

//       await createDriver({
//         company_id: companyId,
//         forarid: forarId.trim(),
//         name: name.trim()
//       });

//       // Clear form
//       setName('');
//       setForarId('');
//     } catch (error) {
//       console.error('Error adding driver:', error);
//       if (error instanceof Error) {
//         toast.error(error.message);
//       } else {
//         toast.error('Kunde inte lägga till föraren');
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4">
//       <div>
//         <label htmlFor="name" className="block text-sm font-medium text-gray-700">
//           Namn
//         </label>
//         <input
//           type="text"
//           id="name"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//           placeholder="John Doe"
//           required
//         />
//       </div>

//       <div>
//         <label htmlFor="forarId" className="block text-sm font-medium text-gray-700">
//           Förar-ID
//         </label>
//         <input
//           type="text"
//           id="forarId"
//           value={forarId}
//           onChange={(e) => setForarId(e.target.value)}
//           className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//           placeholder="12345"
//           required
//         />
//       </div>

//       <button
//         type="submit"
//         disabled={isLoading}
//         className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
//       >
//         {isLoading ? 'Lägger till...' : 'Lägg till Förare'}
//       </button>
//     </form>
//   );
// }