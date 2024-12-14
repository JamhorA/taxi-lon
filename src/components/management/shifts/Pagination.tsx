// import React from 'react';

// interface PaginationProps {
//   currentPage: number;
//   totalPages: number;
//   onPageChange: (page: number) => void;
// }

// export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
//   return (
//     <div className="flex justify-between items-center mt-4">
//       <button
//         onClick={() => onPageChange(currentPage - 1)}
//         disabled={currentPage === 1}
//         className="px-3 py-1 text-sm text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
//       >
//         Föregående
//       </button>
//       <span className="text-sm text-gray-600">
//         Sida {currentPage} av {totalPages}
//       </span>
//       <button
//         onClick={() => onPageChange(currentPage + 1)}
//         disabled={currentPage === totalPages}
//         className="px-3 py-1 text-sm text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
//       >
//         Nästa
//       </button>
//     </div>
//   );
// }
