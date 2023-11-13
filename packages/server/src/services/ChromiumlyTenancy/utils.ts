import path from 'path';

export const PDF_FILE_SUB_DIR = '/pdf';
export const PDF_FILE_EXPIRE_IN = 40; // ms

export const getPdfFilesStorageDir = (filename: string) => {
  return path.join(PDF_FILE_SUB_DIR, filename);
}