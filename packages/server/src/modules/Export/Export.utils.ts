import { ACCEPT_TYPE } from '@/common/constants/http.constants';
import { ExportFormat } from './common';

export const convertAcceptFormatToFormat = (accept: string): ExportFormat => {
  switch (accept) {
    default:
    case ACCEPT_TYPE.APPLICATION_CSV:
      return ExportFormat.Csv;
    case ACCEPT_TYPE.APPLICATION_PDF:
      return ExportFormat.Pdf;
    case ACCEPT_TYPE.APPLICATION_XLSX:
      return ExportFormat.Xlsx;
  }
};