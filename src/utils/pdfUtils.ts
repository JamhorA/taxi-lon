import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import toast from 'react-hot-toast';

interface PDFOptions {
  title?: string;
  orientation?: 'portrait' | 'landscape';
  filename?: string;
}

export async function generatePDF(elementId: string, options: PDFOptions = {}) {
  const element = document.getElementById(elementId);
  if (!element) {
    toast.error('Kunde inte hitta innehållet för PDF');
    return;
  }

  const toastId = toast.loading('Förbereder PDF...');

  try {
    const { 
      orientation = 'portrait',
      filename = 'dokument.pdf',
      title = 'Löneunderlag'
    } = options;

    // Clone the element to avoid modifying the original
    const clonedElement = element.cloneNode(true) as HTMLElement;
    clonedElement.style.width = '800px'; // Fixed width for better rendering
    clonedElement.style.padding = '40px';
    document.body.appendChild(clonedElement);

    // Ensure all fonts and styles are loaded
    await document.fonts.ready;

    // Wait for any images to load
    await Promise.all(
      Array.from(clonedElement.getElementsByTagName('img')).map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
        });
      })
    );

    toast.loading('Genererar PDF...', { id: toastId });

    const canvas = await html2canvas(clonedElement, {
      scale: 2,
      logging: false,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      windowWidth: 800
    });

    // Remove the cloned element
    document.body.removeChild(clonedElement);

    // A4 dimensions in mm
    const pageWidth = orientation === 'portrait' ? 210 : 297;
    const pageHeight = orientation === 'portrait' ? 297 : 210;

    // Calculate dimensions
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    const aspectRatio = canvas.height / canvas.width;
    const contentHeight = contentWidth * aspectRatio;

    const pdf = new jsPDF({
      orientation,
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    // Add title
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(16);
    pdf.text(title, margin, margin);

    // Add content
    pdf.addImage(
      canvas.toDataURL('image/jpeg', 1.0),
      'JPEG',
      margin,
      margin + 10,
      contentWidth,
      contentHeight,
      undefined,
      'FAST'
    );

    // Save the PDF
    pdf.save(filename);
    toast.success('PDF har skapats', { id: toastId });
  } catch (error) {
    console.error('Error generating PDF:', error);
    toast.error('Kunde inte skapa PDF. Försök igen.', { id: toastId });
    throw error;
  }
}