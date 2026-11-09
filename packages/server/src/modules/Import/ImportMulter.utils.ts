import * as Multer from 'multer';
import * as path from 'path';
import { fromBuffer as fileTypeFromBuffer } from 'file-type';
import { ServiceError } from '../Items/ServiceError';

export const getImportsStoragePath = () => {
  return path.join(global.__static_dirname, `/imports`);
};

export const ALLOWED_SHEET_MIMES = new Set([
  'text/csv',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
]);

export function allowSheetExtensions(req, file, cb) {
  if (!ALLOWED_SHEET_MIMES.has(file.mimetype)) {
    cb(new ServiceError('IMPORTED_FILE_EXTENSION_INVALID'));
    return;
  }
  cb(null, true);
}

// Guards against MIME-type spoofing by inspecting actual file bytes via file-type.
// CSV files have no magic bytes so fileTypeFromBuffer returns undefined for them;
// the Multer layer already validated the MIME type in that case, so undefined is allowed.
export async function validateImportFileMagicBytes(
  buffer: Buffer,
): Promise<void> {
  const detected = await fileTypeFromBuffer(buffer);

  // file-type returns undefined for plain text (CSV) — allow through.
  if (!detected) return;

  if (!ALLOWED_SHEET_MIMES.has(detected.mime)) {
    throw new ServiceError('IMPORTED_FILE_EXTENSION_INVALID');
  }
}

const storage = Multer.diskStorage({
  destination: function (req, file, cb) {
    const path = getImportsStoragePath();
    cb(null, path);
  },
  filename: function (req, file, cb) {
    // Add the creation timestamp to clean up temp files later.
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix);
  },
});

export const uploadImportFileMulterOptions = {
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: allowSheetExtensions,
};
