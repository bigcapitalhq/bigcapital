import fs from 'fs/promises';
import XLSX from 'xlsx';
import bluebird from 'bluebird';
import { Inject, Service } from 'typedi';
import { ImportFileDataValidator } from './ImportFileDataValidator';
import { Knex } from 'knex';
import { ImportInsertError } from './interfaces';
import { AccountsImportable } from './AccountsImportable';
import { ServiceError } from '@/exceptions';

@Service()
export class ImportFileCommon {
  @Inject()
  private importFileValidator: ImportFileDataValidator;

  @Inject()
  private importable: AccountsImportable;

  /**
   * Maps the columns of the imported data based on the provided mapping attributes.
   * @param {Record<string, any>[]} body - The array of data objects to map.
   * @param {ImportMappingAttr[]} map - The mapping attributes.
   * @returns {Record<string, any>[]} - The mapped data objects.
   */
  public parseXlsxSheet(buffer) {
    const workbook = XLSX.read(buffer, { type: 'buffer' });

    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];

    return XLSX.utils.sheet_to_json(worksheet);
  }

  /**
   * Reads the import file.
   * @param {string} filename
   * @returns {Promise<Buffer>}
   */
  public readImportFile(filename: string) {
    return fs.readFile(`public/imports/${filename}`);
  }

  /**
   *
   * @param {number} tenantId -
   * @param {Record<string, any>} importableFields
   * @param {Record<string, any>} parsedData
   * @param {Knex.Transaction} trx
   * @returns
   */
  public import(
    tenantId: number,
    importableFields,
    parsedData: Record<string, any>,
    trx?: Knex.Transaction
  ): Promise<(void | ImportInsertError[])[]> {
    return bluebird.map(
      parsedData,
      async (objectDTO, index: number): Promise<true | ImportInsertError[]> => {
        try {
          // Validate the DTO object before passing it to the service layer.
          await this.importFileValidator.validateData(
            importableFields,
            objectDTO
          );
          try {
            // Run the importable function and listen to the errors.
            await this.importable.importable(tenantId, objectDTO, trx);
          } catch (error) {
            if (error instanceof ServiceError) {
              return [
                {
                  errorCode: 'ValidationError',
                  errorMessage: error.message || error.errorType,
                  rowNumber: index + 1,
                },
              ];
            }
          }
        } catch (errors) {
          return errors.map((er) => ({ ...er, rowNumber: index + 1 }));
        }
      },
      { concurrency: 2 }
    );
  }
}
