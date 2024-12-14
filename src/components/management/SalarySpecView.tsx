// import React from 'react';

// export default function SalarySpecView({ salaryData }) {
//   console.log(salaryData);
//   return (
//     <div
//       className="mx-auto my-8 p-6 bg-white shadow-md rounded-md"
//       style={{
//         width: '210mm',
//         minHeight: '297mm',
//         padding: '20mm',
//         boxSizing: 'border-box',
//       }}
//     >
//       <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
//         <h1 className="text-2xl font-bold">Lönespecifikation</h1>
//         <div className="text-right mt-4 sm:mt-0">
//           <p className="text-sm">
//             <span className="font-semibold">Anst.nr:</span> {salaryData.driverId}
//           </p>
//           <p className="text-sm">
//             <span className="font-semibold">Utbetalningsdatum:</span> {salaryData.paymentDate}
//           </p>
//           <p className="text-sm">
//             <span className="font-semibold">Löneperiod:</span> {salaryData.salaryPeriod.from} -{' '}
//             {salaryData.salaryPeriod.to}
//           </p>
//         </div>
//       </header>

//       <section
//         className="flex flex-col sm:flex-row justify-between items-start sm:items-start space-y-4 sm:space-y-0 sm:space-x-8 mb-8"
//         style={{ marginBottom: '15mm' }}
//       >
//         <div>
//           <p className="font-semibold">{salaryData.companyName}</p>
//           <p>{salaryData.companyAddress.address}</p>
//           <p>
//             {salaryData.companyAddress.postalCode} {salaryData.companyAddress.city}
//           </p>
//           <div className="mt-4 text-sm">
//             <p>
//               <span className="font-semibold">Sidoinkomst:</span> {salaryData.taxTable} %
//             </p>
//             <p>
//               <span className="font-semibold">Engångsskatt:</span> 0 %
//             </p>
//             <p>
//               <span className="font-semibold">Skattetabell:</span> 34
//             </p>
//             <p>
//               <span className="font-semibold">Bankkonto:</span> SEB **** **** ****
//             </p>
//           </div>
//         </div>
//         <div>
//           <p className="font-semibold">
//             {salaryData.driverName} {salaryData.driverLastname}
//           </p>
//           <p>{salaryData.driverAddress}</p>
//           <p>
//             {salaryData.driverPostalCode} {salaryData.driverCity}
//           </p>
//           <p className="text-sm mt-4">
//             <span className="font-semibold">Övrig info:</span> Här kan du lägga till annan info om
//             anställningen.
//           </p>
//         </div>
//       </section>

//       <section>
//         <table className="w-full border-collapse mb-8 text-sm" style={{ marginBottom: '15mm' }}>
//           <thead className="bg-gray-200">
//             <tr>
//               <th className="border px-2 py-1 text-left">Löneart</th>
//               <th className="border px-2 py-1 text-left">Antal</th>
//               <th className="border px-2 py-1 text-left">Å-pris</th>
//               <th className="border px-2 py-1 text-left">Belopp</th>
//             </tr>
//           </thead>
//           <tbody>
//             <tr>
//               <td className="border px-2 py-1">020 Procentlön</td>
//               <td className="border px-2 py-1">0,37</td>
//               <td className="border px-2 py-1">{salaryData.salaryBase.toFixed(2)}</td>
//               <td className="border px-2 py-1 font-semibold">
//                 {salaryData.percentSalary.toFixed(2)}
//               </td>
//             </tr>
//             <tr>
//               <td className="border px-2 py-1">420 Semesterlön</td>
//               <td className="border px-2 py-1">1,00</td>
//               <td className="border px-2 py-1">{salaryData.vacationSalary.toFixed(2)}</td>
//               <td className="border px-2 py-1 font-semibold">
//                 {salaryData.vacationSalary.toFixed(2)}
//               </td>
//             </tr>
//             <tr>
//               <td className="border px-2 py-1">913 Procentskatt (21741)</td>
//               <td className="border px-2 py-1">1,00</td>
//               <td className="border px-2 py-1">-{salaryData.tax.toFixed(2)}</td>
//               <td className="border px-2 py-1">-{salaryData.tax.toFixed(2)}</td>
//             </tr>
//             <tr>
//               <td className="border px-2 py-1">992 Avrunding</td>
//               <td className="border px-2 py-1">1,00</td>
//               <td className="border px-2 py-1">-0,20</td>
//               <td className="border px-2 py-1 font-semibold">-0,20</td>
//             </tr>
//           </tbody>
//         </table>
//       </section>

//       <footer className="border-t pt-4 text-sm space-y-1">
//         <div className="flex justify-between">
//           <span className="font-semibold">Bruttolön:</span>
//           <span>{salaryData.grossSalary.toFixed(2)}</span>
//         </div>
//         <div className="flex justify-between">
//           <span className="font-semibold">Skatt:</span>
//           <span className="text-red-600">-{salaryData.tax.toFixed(2)}</span>
//         </div>
//         <div className="flex justify-between">
//           <span className="font-semibold">Avdrag/tillägg:</span>
//           <span>0,00</span>
//         </div>
//         <div className="flex justify-between font-bold">
//           <span>Nettolön:</span>
//           <span>{salaryData.netSalary.toFixed(2)}</span>
//         </div>
//       </footer>
//     </div>
//   );
// }





// SalarySpecView.tsx
import React from 'react';

export default function SalarySpecView({ salaryData }) {
  console.log(salaryData);
  return (
    <div className="max-w-4xl mx-auto my-2 p-10 bg-white shadow-md rounded-md">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <h1 className="text-2xl font-bold">Lönespecifikation</h1>
        <div className="text-right mt-4 sm:mt-0">
          <p className="text-sm"><span className="font-semibold">Anst.nr:</span> {salaryData.driverId}</p>
          <p className="text-sm"><span className="font-semibold">Utbetalningsdatum:</span> {salaryData.paymentDate}</p>
          <p className="text-sm"><span className="font-semibold">Löneperiod:</span> {salaryData.salaryPeriod.from} - {salaryData.salaryPeriod.to}</p>
        </div>
      </header>

      <section className="flex flex-col sm:flex-row justify-between items-start sm:items-start space-y-4 sm:space-y-0 sm:space-x-8 mb-8">
        <div>
          <p className="font-semibold">{salaryData.companyName}</p>
          <p>{salaryData.companyAddress.address}</p>
          <p>{salaryData.companyAddress.postalCode} {salaryData.companyAddress.city}</p>
          <div className="mt-4 text-sm">
            <p><span className="font-semibold">Sidoinkomst:</span> {salaryData.taxTable} %</p>
            <p><span className="font-semibold">Engångsskatt:</span> 0 %</p>
            <p><span className="font-semibold">Skattetabell:</span> 34</p>
            <p><span className="font-semibold">Bankkonto:</span> SEB **** **** ****</p>
          </div>
        </div>
        <div>
          <p className="font-semibold">{salaryData.driverName} {salaryData.driverLastname}</p>
          <p>{salaryData.driverAddress}</p>
          <p>{salaryData.driverPostalCode} {salaryData.driverCity}</p>
          <p className="text-sm mt-4"><span className="font-semibold">Övrig info:</span> Här kan du lägga till annan info om anställningen.</p>
        </div>
      </section>

      <section className="mt-36">
        <table className="w-full border-collapse mb-8 text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="border px-2 py-1 text-left">Löneart</th>
              <th className="border px-2 py-1 text-left">Antal</th>
              <th className="border px-2 py-1 text-left">Å-pris</th>
              <th className="border px-2 py-1 text-left">Belopp</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border px-2 py-1">020 Procentlön</td>
              <td className="border px-2 py-1">0,37</td>
              <td className="border px-2 py-1">{salaryData.salaryBase.toFixed(2)}</td>
              <td className="border px-2 py-1 font-semibold">{salaryData.percentSalary.toFixed(2)}</td>
            </tr>
            <tr>
              <td className="border px-2 py-1">420 Semesterlön</td>
              <td className="border px-2 py-1">1,00</td>
              <td className="border px-2 py-1">{salaryData.vacationSalary.toFixed(2)}</td>
              <td className="border px-2 py-1 font-semibold">{salaryData.vacationSalary.toFixed(2)}</td>
            </tr>
            <tr>
              <td className="border px-2 py-1">913 Procentskatt (21741)</td>
              <td className="border px-2 py-1">1,00</td>
              <td className="border px-2 py-1">-{salaryData.tax.toFixed(2)}</td>
              <td className="border px-2 py-1">-{salaryData.tax.toFixed(2)}</td>
            </tr>
            <tr>
              <td className="border px-2 py-1">992 Avrunding</td>
              <td className="border px-2 py-1">1,00</td>
              <td className="border px-2 py-1">-0,20</td>
              <td className="border px-2 py-1 font-semibold">-0,20</td>
            </tr>
          </tbody>
        </table>
      </section>

      <footer className="border-t pt-4 text-sm space-y-1">
        <div className="flex justify-between">
          <span className="font-semibold">Bruttolön:</span>
          <span>{salaryData.grossSalary.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold">Skatt:</span>
          <span className="text-red-600">-{salaryData.tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold">Avdrag/tillägg:</span>
          <span>0,00</span>
        </div>
        <div className="flex justify-between font-bold">
          <span>Nettolön:</span>
          <span>{salaryData.netSalary.toFixed(2)}</span>
        </div>
      </footer>
    </div>
  );
}






// import React from 'react';

// export default function SalarySpecView({ salaryData }) {
//   return (
//     <div className="max-w-4xl mx-auto my-8 p-6 bg-white shadow-md rounded-md">
//       <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
//         <h1 className="text-2xl font-bold">Lönespecifikation</h1>
//         <div className="text-right mt-4 sm:mt-0">
//           <p className="text-sm"><span className="font-semibold">Anst.nr:</span> {salaryData.driverId}</p>
//           <p className="text-sm"><span className="font-semibold">Utbetalningsdatum:</span> {salaryData.paymentDate}</p>
//           <p className="text-sm"><span className="font-semibold">Löneperiod:</span> {salaryData.salaryPeriod.from} - {salaryData.salaryPeriod.to}</p>
//         </div>
//       </header>

//       <section className="flex flex-col sm:flex-row justify-between items-start sm:items-start space-y-4 sm:space-y-0 sm:space-x-8 mb-8">
//         <div>
//           <p className="font-semibold">{salaryData.companyName}</p>
//           <p>{salaryData.companyAddress.address}</p>
//           <p>{salaryData.companyAddress.postalCode} {salaryData.companyAddress.city}</p>
//           <div className="mt-4 text-sm">
//             <p><span className="font-semibold">Sidoinkomst:</span> {salaryData.taxTable} %</p>
//           </div>
//         </div>
//       </section>

//       <section>
//         <table className="w-full border-collapse mb-8 text-sm">
//           <tbody>
//             <tr>
//               <td className="border px-2 py-1">020 Procentlön</td>
//               <td className="border px-2 py-1">0,37</td>
//               <td className="border px-2 py-1">{salaryData.salaryBase.toFixed(2)}</td>
//               <td className="border px-2 py-1 font-semibold">{salaryData.percentSalary.toFixed(2)}</td>
//             </tr>
//             <tr>
//               <td className="border px-2 py-1">420 Semesterlön</td>
//               <td className="border px-2 py-1">1,00</td>
//               <td className="border px-2 py-1">{salaryData.vacationSalary.toFixed(2)}</td>
//               <td className="border px-2 py-1 font-semibold">{salaryData.vacationSalary.toFixed(2)}</td>
//             </tr>
//           </tbody>
//         </table>
//       </section>

//       <footer className="border-t pt-4 text-sm space-y-1">
//         <div className="flex justify-between">
//           <span className="font-semibold">Bruttolön:</span>
//           <span>{salaryData.grossSalary.toFixed(2)}</span>
//         </div>
//         <div className="flex justify-between">
//           <span className="font-semibold">Skatt:</span>
//           <span className="text-red-600">{salaryData.tax.toFixed(2)}</span>
//         </div>
//         <div className="flex justify-between font-bold">
//           <span>Nettolön:</span>
//           <span>{salaryData.netSalary.toFixed(2)}</span>
//         </div>
//       </footer>
//     </div>
//   );
// }
