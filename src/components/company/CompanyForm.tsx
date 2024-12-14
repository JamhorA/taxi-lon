import React, { useState } from 'react';
import { useCompany } from '../../hooks/useCompany';
import toast from 'react-hot-toast';
import { Database } from '../../types/supabase';

type Company = Database['public']['Tables']['Companies']['Row'];

interface CompanyFormProps {
  onCompanySelect: (company: Company) => void;
}

export default function CompanyForm({ onCompanySelect }: CompanyFormProps) {
  const [name, setName] = useState('');
  const [orgNr, setOrgNr] = useState('');
  const [address, setAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [city, setCity] = useState('');

  const { createCompany, companies, isLoading } = useCompany();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !orgNr.trim() || !address.trim() || !postalCode.trim() || !city.trim()) {
      toast.error('Alla fält måste fyllas i');
      return;
    }

    try {
      // Skapa företag och dess adress (logiken hanteras i createCompany-funktionen)
      const company = await createCompany({ 
        name: name.trim(), 
        org_nr: orgNr.trim(),
        address: address.trim(),
        postal_code: postalCode.trim(),
        city: city.trim()
      });

      if (company) {
        onCompanySelect(company);
      }

      // Rensa formuläret
      setName('');
      setOrgNr('');
      setAddress('');
      setPostalCode('');
      setCity('');

      toast.success('Företag har skapats!');
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error('Kunde inte skapa företag');
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Företagsnamn
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm 
            focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            required
          />
        </div>
        
        <div>
          <label htmlFor="orgNr" className="block text-sm font-medium text-gray-700">
            Organisationsnummer
          </label>
          <input
            type="text"
            id="orgNr"
            value={orgNr}
            onChange={(e) => setOrgNr(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm 
            focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm 
            focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm 
            focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm 
            focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Stockholm"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md 
          shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none 
          focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isLoading ? 'Skapar...' : 'Skapa Företag'}
        </button>
      </form>

      {companies.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Registrerade Företag</h3>
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {companies.map((company) => (
                <li key={company.id}>
                  <button
                    onClick={() => onCompanySelect(company)}
                    className="w-full px-4 py-4 hover:bg-gray-50 focus:outline-none 
                    focus:bg-gray-50 transition duration-150 ease-in-out"
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-left">
                        <p className="text-sm font-medium text-gray-900">{company.name}</p>
                        <p className="text-sm text-gray-500">Org.nr: {company.org_nr}</p>
                      </div>
                      <div className="ml-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 
                        rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Välj
                        </span>
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}



// import React, { useState } from 'react';
// import { useCompany } from '../../hooks/useCompany';
// import { useAuth } from '../../hooks/useAuth';
// import toast from 'react-hot-toast';
// import { Database } from '../../types/supabase';
// import { z } from 'zod';

// type Company = Database['public']['Tables']['Companies']['Row'];

// interface CompanyFormProps {
//   onCompanySelect: (company: Company) => void;
// }

// const passwordSchema = z.string()
//   .min(8, 'Lösenordet måste vara minst 8 tecken')
//   .regex(/[A-Z]/, 'Lösenordet måste innehålla minst en stor bokstav')
//   .regex(/[a-z]/, 'Lösenordet måste innehålla minst en liten bokstav')
//   .regex(/[0-9]/, 'Lösenordet måste innehålla minst en siffra')
//   .regex(/[^A-Za-z0-9]/, 'Lösenordet måste innehålla minst ett specialtecken');

// export default function CompanyForm({ onCompanySelect }: CompanyFormProps) {
//   const [name, setName] = useState('');
//   const [orgNr, setOrgNr] = useState('');
//   const [adminEmail, setAdminEmail] = useState('');
//   const [adminPassword, setAdminPassword] = useState('');
//   const { createCompany, companies, isLoading } = useCompany();
//   const { signUp } = useAuth();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!name.trim() || !orgNr.trim() || !adminEmail.trim() || !adminPassword.trim()) {
//       toast.error('Alla fält måste fyllas i');
//       return;
//     }

//     try {
//       // Validate password
//       passwordSchema.parse(adminPassword);

//       // Create admin user first
//       await signUp(adminEmail, adminPassword);

//       // Create company and link it to the admin user
//       const company = await createCompany({ 
//         name: name.trim(), 
//         org_nr: orgNr.trim(),
//         adminEmail: adminEmail.trim()
//       });

//       if (company) {
//         onCompanySelect(company);
//       }

//       // Clear form
//       setName('');
//       setOrgNr('');
//       setAdminEmail('');
//       setAdminPassword('');

//       toast.success('Företag och administratör har skapats!');
//     } catch (error) {
//       if (error instanceof z.ZodError) {
//         toast.error(error.errors[0].message);
//       } else {
//         console.error('Form submission error:', error);
//         toast.error('Kunde inte skapa företag och administratör');
//       }
//     }
//   };

//   return (
//     <div className="space-y-6">
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label htmlFor="name" className="block text-sm font-medium text-gray-700">
//             Företagsnamn
//           </label>
//           <input
//             type="text"
//             id="name"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
//             required
//           />
//         </div>
//         <div>
//           <label htmlFor="orgNr" className="block text-sm font-medium text-gray-700">
//             Organisationsnummer
//           </label>
//           <input
//             type="text"
//             id="orgNr"
//             value={orgNr}
//             onChange={(e) => setOrgNr(e.target.value)}
//             className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
//             required
//           />
//         </div>
//         <div>
//           <label htmlFor="adminEmail" className="block text-sm font-medium text-gray-700">
//             Administratörens E-post
//           </label>
//           <input
//             type="email"
//             id="adminEmail"
//             value={adminEmail}
//             onChange={(e) => setAdminEmail(e.target.value)}
//             className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
//             required
//           />
//         </div>
//         <div>
//           <label htmlFor="adminPassword" className="block text-sm font-medium text-gray-700">
//             Administratörens Lösenord
//           </label>
//           <input
//             type="password"
//             id="adminPassword"
//             value={adminPassword}
//             onChange={(e) => setAdminPassword(e.target.value)}
//             className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
//             required
//           />
//           <p className="mt-1 text-sm text-gray-500">
//             Lösenordet måste innehålla minst 8 tecken, en stor bokstav, en liten bokstav, en siffra och ett specialtecken.
//           </p>
//         </div>
//         <button
//           type="submit"
//           disabled={isLoading}
//           className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
//         >
//           {isLoading ? 'Skapar...' : 'Skapa Företag och Administratör'}
//         </button>
//       </form>

//       {companies.length > 0 && (
//         <div className="mt-6">
//           <h3 className="text-lg font-medium text-gray-900 mb-4">Registrerade Företag</h3>
//           <div className="bg-white shadow overflow-hidden sm:rounded-md">
//             <ul className="divide-y divide-gray-200">
//               {companies.map((company) => (
//                 <li key={company.id}>
//                   <button
//                     onClick={() => onCompanySelect(company)}
//                     className="w-full px-4 py-4 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition duration-150 ease-in-out"
//                   >
//                     <div className="flex items-center justify-between">
//                       <div className="text-left">
//                         <p className="text-sm font-medium text-gray-900">{company.name}</p>
//                         <p className="text-sm text-gray-500">Org.nr: {company.org_nr}</p>
//                       </div>
//                       <div className="ml-2">
//                         <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
//                           Välj
//                         </span>
//                       </div>
//                     </div>
//                   </button>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }