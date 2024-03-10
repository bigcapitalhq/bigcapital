import { Inject, Service } from 'typedi';
import * as R from 'ramda';
import XLSX from 'xlsx';
import { first, isUndefined } from 'lodash';
import bluebird from 'bluebird';
import HasTenancyService from '../Tenancy/TenancyService';
import { trimObject } from './_utils';
import { ImportMappingAttr, ImportValidationError } from './interfaces';
import { AccountsImportable } from './AccountsImportable';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import UnitOfWork from '../UnitOfWork';
import { Knex } from 'knex';
const fs = require('fs').promises;

@Service()
export class ImportFileProcess {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private importable: AccountsImportable;

  @Inject()
  private uow: UnitOfWork;

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
    mappedDTOs: Record<string, any>
  ): Promise<ImportValidationError[][]> {
    const validateData = async (data, index: number) => {
      const account = { ...data };
      const accountClass = plainToInstance(
        this.importable.validation(),
        account
      );
      const errors = await validate(accountClass);

      if (errors?.length > 0) {
        return errors.map((error) => ({
          index,
          property: error.property,
          constraints: error.constraints,
        }));
      }
      return false;
    };
    const errors = await bluebird.map(mappedDTOs, validateData, {
      concurrency: 20,
    });
    return errors.filter((error) => error !== false);
  }

  /**
   * Transfomees the mapped DTOs.
   * @param DTOs
   * @returns
   */
  private transformDTOs(DTOs) {
    return DTOs.map((DTO) => this.importable.transform(DTO));
  }

  /**
   * Process
   * @param {number} tenantId
   * @param {number} importId
   */
  public async process(
    tenantId: number,
    importId: number,
    settings = { skipErrors: true }
  ) {
    const { Import } = this.tenancy.models(tenantId);

    const importFile = await Import.query()
      .findOne('importId', importId)
      .throwIfNotFound();

    const buffer = await this.readImportFile(importFile.filename);
    const jsonData = this.parseXlsxSheet(buffer);

    const data = this.sanitizeSheetData(jsonData);

    const header = first(data);
    const body = jsonData;

    const mappedDTOs = this.mapSheetColumns(body, importFile.mappingParsed);
    const transformedDTOs = this.transformDTOs(mappedDTOs);

    // Validate the mapped DTOs.
    const errors = await this.validateData(transformedDTOs);

    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      await bluebird.map(
        transformedDTOs,
        (transformedDTO) =>
          this.importable.importable(tenantId, transformedDTO, trx),
        { concurrency: 10 }
      );
    });
  }
}
