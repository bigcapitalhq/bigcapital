import { ServiceError } from '@/exceptions';
import Multer from 'multer';

export function allowSheetExtensions(req, file, cb) {
  if (
    file.mimetype !== 'text/csv' &&
    file.mimetype !== 'application/vnd.ms-excel' &&
    file.mimetype !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ) {
    cb(new ServiceError('IMPORTED_FILE_EXTENSION_INVALID'));

    return;
  }
  cb(null, true);
}

export const uploadImportFile = Multer({
  dest: './public/imports',
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: allowSheetExtensions,
});
