import * as XLSX from 'xlsx';
import { sanitizeResourceName } from './_utils';
import { Injectable } from '@nestjs/common';
import { getImportableService } from './decorators/Import.decorator';
import { ImportableRegistry } from './ImportableRegistry';

@Injectable()
export class ImportSampleService {
  constructor(
    private readonly importableRegistry: ImportableRegistry,
  ) {

  }
  /**
   * Retrieves the sample sheet of the given resource.
   * @param {string} resource
   * @param {string} format
   * @returns {Buffer | string}
   */
  public async sample(
    resource: string,
    format: 'csv' | 'xlsx'
  ): Promise<Buffer | string> {
    const _resource = sanitizeResourceName(resource);
    const importable = await this.importableRegistry.getImportable(_resource);

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
