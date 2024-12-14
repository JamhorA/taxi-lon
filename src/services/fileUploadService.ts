import toast from "react-hot-toast";

export async function handleFileUpload(file: File): Promise<string> {
  try {
    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      throw new Error('Filen är för stor. Maximal storlek är 10MB.');
    }

    // Convert file to base64
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        // For Together AI, we need to convert the base64 to a data URL
        const dataUrl = `data:${file.type};base64,${base64String.split(',')[1]}`;
        resolve(dataUrl);
      };
      reader.onerror = () => {
        reject(new Error('Kunde inte läsa filen'));
      };
      reader.readAsDataURL(file);
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Ett fel uppstod vid filuppladdning";
    toast.error(errorMessage);
    throw error;
  }
}