import fs from 'fs/promises';
import XLSX from 'xlsx';
import bluebird from 'bluebird';
import * as R from 'ramda';
import { Inject, Service } from 'typedi';
import { first } from 'lodash';
import { ImportFileDataValidator } from './ImportFileDataValidator';
import { Knex } from 'knex';
import {
  ImportInsertError,
  ImportOperError,
  ImportOperSuccess,
} from './interfaces';
import { AccountsImportable } from './AccountsImportable';
import { ServiceError } from '@/exceptions';
import { trimObject } from './_utils';
import { ImportableResources } from './ImportableResources';
import ResourceService from '../Resource/ResourceService';
import HasTenancyService from '../Tenancy/TenancyService';

@Service()
export class ImportFileCommon {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private importFileValidator: ImportFileDataValidator;

  @Inject()
  private importable: ImportableResources;

  @Inject()
  private resource: ResourceService;

  /**
   * Maps the columns of the imported data based on the provided mapping attributes.
   * @param {Record<string, any>[]} body - The array of data objects to map.
   * @param {ImportMappingAttr[]} map - The mapping attributes.
   * @returns {Record<string, any>[]} - The mapped data objects.
   */
  public parseXlsxSheet(buffer: Buffer): Record<string, unknown>[] {
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
   * @param {string} resourceName - Resource name.
   * @param {Record<string, any>} parsedData -
   * @param {Knex.Transaction} trx
   * @returns
   */
  public async import(
    tenantId: number,
    resourceName: string,
    parsedData: Record<string, any>[],
    trx?: Knex.Transaction
  ): Promise<[ImportOperSuccess[], ImportOperError[]]> {
    const importableFields = this.resource.getResourceImportableFields(
      tenantId,
      resourceName
    );
    const ImportableRegistry = this.importable.registry;
    const importable = ImportableRegistry.getImportable(resourceName);

    const success: ImportOperSuccess[] = [];
    const failed: ImportOperError[] = [];

    const importAsync = async (objectDTO, index: number): Promise<void> => {
      try {
        // Validate the DTO object before passing it to the service layer.
        await this.importFileValidator.validateData(
          importableFields,
          objectDTO
        );
        try {
          // Run the importable function and listen to the errors.
          const data = await importable.importable(tenantId, objectDTO, trx);
          success.push({ index, data });
        } catch (err) {
          if (err instanceof ServiceError) {
            const error = [
              {
                errorCode: 'ValidationError',
                errorMessage: err.message || err.errorType,
                rowNumber: index + 1,
              },
            ];
            failed.push({ index, error });
          }
        }
      } catch (errors) {
        const error = errors.map((er) => ({ ...er, rowNumber: index + 1 }));
        failed.push({ index, error });
      }
    };
    await bluebird.map(parsedData, importAsync, { concurrency: 2 });

    return [success, failed];
  }

  /**
   * Retrieves the sheet columns from the given sheet data.
   * @param {unknown[]} json
   * @returns {string[]}
   */
  public parseSheetColumns(json: unknown[]): string[] {
    return R.compose(Object.keys, trimObject, first)(json);
  }

  /**
   * Deletes the imported file from the storage and database.
   * @param {number} tenantId
   * @param {} importFile
   */
  private async deleteImportFile(tenantId: number, importFile: any) {
    const { Import } = this.tenancy.models(tenantId);

    // Deletes the import row.
    await Import.query().findById(importFile.id).delete();

    // Deletes the imported file.
    await fs.unlink(`public/imports/${importFile.filename}`);
  }
}
