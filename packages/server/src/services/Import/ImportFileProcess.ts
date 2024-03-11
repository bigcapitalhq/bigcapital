import { Inject, Service } from 'typedi';
import * as R from 'ramda';
import XLSX from 'xlsx';
import { first, isUndefined } from 'lodash';
import bluebird from 'bluebird';
import fs from 'fs/promises';
import { Knex } from 'knex';
import HasTenancyService from '../Tenancy/TenancyService';
import { ERRORS, convertFieldsToYupValidation, trimObject } from './_utils';
import { ImportMappingAttr, ImportValidationError } from './interfaces';
import { AccountsImportable } from './AccountsImportable';
import UnitOfWork from '../UnitOfWork';
import { ServiceError } from '@/exceptions';
import ResourceService from '../Resource/ResourceService';


@Service()
export class ImportFileProcess {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private importable: AccountsImportable;

  @Inject()
  private uow: UnitOfWork;

  @Inject()
  private resourceService: ResourceService;

  /**
   * Reads the import file.
   * @param {string} filename
   * @returns {Promise<Buffer>}
   */
  public readImportFile(filename: string) {
    return fs.readFile(`public/imports/${filename}`);
  }

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
   * Sanitizes the data in the imported sheet by trimming object keys.
   * @param json - The JSON data representing the imported sheet.
   * @returns {string[][]} - The sanitized data with trimmed object keys.
   */
  public sanitizeSheetData(json) {
    return R.compose(R.map(Object.keys), R.map(trimObject))(json);
  }

  /**
   * Maps the columns of the imported data based on the provided mapping attributes.
   * @param {Record<string, any>[]} body - The array of data objects to map.
   * @param {ImportMappingAttr[]} map - The mapping attributes.
   * @returns {Record<string, any>[]} - The mapped data objects.
   */
  private mapSheetColumns(
    body: Record<string, any>[],
    map: ImportMappingAttr[]
  ): Record<string, any>[] {
    return body.map((item) => {
      const newItem = {};
      map
        .filter((mapping) => !isUndefined(item[mapping.from]))
        .forEach((mapping) => {
          newItem[mapping.to] = item[mapping.from];
        });
      return newItem;
    });
  }

  /**
   * Validates the given mapped DTOs and returns errors with their index.
   * @param {Record<string, any>} mappedDTOs
   * @returns {Promise<ImportValidationError[][]>}
   */
  private async validateData(
    tenantId: number,
    resource: string,
    mappedDTOs: Record<string, any>
  ): Promise<ImportValidationError[][]> {
    const importableFields = this.resourceService.getResourceImportableFields(
      tenantId,
      resource
    );
    const YupSchema = convertFieldsToYupValidation(importableFields);

    const validateData = async (data, index: number) => {
      const _data = { ...data };

      try {
        await YupSchema.validate(_data, { abortEarly: false });
        return { index, data: _data, errors: [] };
      } catch (validationError) {
        const errors = validationError.inner.map((error) => ({
          path: error.params.path,
          label: error.params.label,
          message: error.errors,
        }));
        return { index, data: _data, errors };
      }
    };
    const errors = await bluebird.map(mappedDTOs, validateData, {
      concurrency: 20,
    });
    return errors.filter((error) => error !== false);
  }

  /**
   * Transformes the mapped DTOs.
   * @param DTOs
   * @returns
   */
  private transformDTOs(DTOs) {
    return DTOs.map((DTO) => this.importable.transform(DTO));
  }

  /**
   * Processes the import file sheet through the resource service.
   * @param {number} tenantId
   * @param {number} importId
   * @returns {Promise<void>}
   */
  public async process(tenantId: number, importId: number) {
    const { Import } = this.tenancy.models(tenantId);

    const importFile = await Import.query()
      .findOne('importId', importId)
      .throwIfNotFound();

    // Throw error if the import file is not mapped yet.
    if (!importFile.isMapped) {
      throw new ServiceError(ERRORS.IMPORT_FILE_NOT_MAPPED);
    }
    const buffer = await this.readImportFile(importFile.filename);
    const jsonData = this.parseXlsxSheet(buffer);

    const data = this.sanitizeSheetData(jsonData);

    const header = first(data);
    const body = jsonData;

    const mappedDTOs = this.mapSheetColumns(body, importFile.mappingParsed);
    const transformedDTOs = this.transformDTOs(mappedDTOs);

    // Validate the mapped DTOs.
    const rowsWithErrors = await this.validateData(
      tenantId,
      importFile.resource,
      transformedDTOs
    );
    // Runs the importing under UOW envirement.
    await this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      await bluebird.map(
        rowsWithErrors,
        (rowWithErrors) => {
          if (rowWithErrors.errors.length === 0) {
            return this.importable.importable(
              tenantId,
              rowWithErrors.data,
              trx
            );
          }
        },
        { concurrency: 10 }
      );
    });
    // Deletes the imported file after importing success./
    await this.deleteImportFile(tenantId, importFile)
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
