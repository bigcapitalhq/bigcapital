import { ACCEPT_TYPE } from '@/interfaces/Http';
import { ExportFormat } from '@/services/Export/common';

export const convertAcceptFormatToFormat = (accept: string): ExportFormat => {
  switch (accept) {
    case ACCEPT_TYPE.APPLICATION_CSV:
      return ExportFormat.Csv;
    case ACCEPT_TYPE.APPLICATION_PDF:
      return ExportFormat.Pdf;
    case ACCEPT_TYPE.APPLICATION_XLSX:
      return ExportFormat.Xlsx;
  }
};
