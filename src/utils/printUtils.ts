import toast from 'react-hot-toast';

interface PrintOptions {
  title?: string;
  orientation?: 'portrait' | 'landscape';
}

export function printElement(elementId: string, options: PrintOptions = {}) {
  const printContent = document.getElementById(elementId);
  if (!printContent) {
    toast.error('Kunde inte hitta innehållet för utskrift');
    return;
  }

  const printWindow = window.open('', '_blank');
  
  if (!printWindow) {
    toast.error('Tillåt popupfönster för att skriva ut rapporten', {
      duration: 5000,
      icon: '⚠️'
    });
    return;
  }

  const { title = 'Utskrift', orientation = 'portrait' } = options;

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        <meta charset="utf-8">
        <style>
          @page {
            size: ${orientation};
            margin: 2cm;
          }
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
            color: #333;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 1rem;
          }
          th, td {
            padding: 8px;
            text-align: left;
            border-bottom: 1px solid #ddd;
          }
          th {
            background-color: #f8f9fa;
            font-weight: bold;
          }
          .text-right {
            text-align: right;
          }
          @media print {
            body { margin: 0; }
            table { page-break-inside: avoid; }
            thead { display: table-header-group; }
          }
        </style>
      </head>
      <body>
        ${printContent.innerHTML}
      </body>
    </html>
  `);

  printWindow.document.close();

  // Wait for content to load before printing
  printWindow.onload = () => {
    try {
      printWindow.focus();
      printWindow.print();
      
      // Close window after print dialog is closed
      const checkPrintDialogClosed = setInterval(() => {
        if (printWindow.closed) {
          clearInterval(checkPrintDialogClosed);
        }
      }, 1000);

      // Fallback: close window after 60 seconds if print dialog remains open
      setTimeout(() => {
        if (!printWindow.closed) {
          printWindow.close();
          clearInterval(checkPrintDialogClosed);
        }
      }, 60000);
    } catch (error) {
      console.error('Print error:', error);
      toast.error('Ett fel uppstod vid utskrift');
      printWindow.close();
    }
  };
}