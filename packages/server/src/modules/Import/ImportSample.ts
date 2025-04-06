import XLSX from 'xlsx';
import { ImportableResources } from './ImportableResources';
import { sanitizeResourceName } from './_utils';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ImportSampleService {
  constructor(
    private readonly importable: ImportableResources,
  ) {}

  /**
   * Retrieves the sample sheet of the given resource.
   * @param {string} resource
   * @param {string} format
   * @returns {Buffer | string}
   */
  public sample(
    resource: string,
    format: 'csv' | 'xlsx'
  ): Buffer | string {
    const _resource = sanitizeResourceName(resource);

    const ImportableRegistry = this.importable.registry;
    const importable = ImportableRegistry.getImportable(_resource);

    const data = importable.sampleData();

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    // Determine the output format
    if (format === 'csv') {
      const csvOutput = XLSX.utils.sheet_to_csv(worksheet);
      return csvOutput;
    } else {
      const xlsxOutput = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'buffer',
      });
      return xlsxOutput;
    }
  }
}
