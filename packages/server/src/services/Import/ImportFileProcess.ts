import { Inject, Service } from 'typedi';
import { chain } from 'lodash';
import { Knex } from 'knex';
import { ServiceError } from '@/exceptions';
import {
  ERRORS,
  getSheetColumns,
  getUnmappedSheetColumns,
  readImportFile,
} from './_utils';
import { ImportFileCommon } from './ImportFileCommon';
import { ImportFileDataTransformer } from './ImportFileDataTransformer';
import ResourceService from '../Resource/ResourceService';
import UnitOfWork from '../UnitOfWork';
import { ImportFilePreviewPOJO } from './interfaces';
import { Import } from '@/system/models';

@Service()
export class ImportFileProcess {
  @Inject()
  private resource: ResourceService;

  @Inject()
  private importCommon: ImportFileCommon;

  @Inject()
  private importParser: ImportFileDataTransformer;

  @Inject()
  private uow: UnitOfWork;

  /**
   * Preview the imported file results before commiting the transactions.
   * @param {number} tenantId
   * @param {number} importId
   * @returns {Promise<ImportFilePreviewPOJO>}
   */
  public async import(
    tenantId: number,
    importId: number,
    trx?: Knex.Transaction
  ): Promise<ImportFilePreviewPOJO> {
    const importFile = await Import.query()
      .findOne('importId', importId)
      .where('tenantId', tenantId)
      .throwIfNotFound();

    // Throw error if the import file is not mapped yet.
    if (!importFile.isMapped) {
      throw new ServiceError(ERRORS.IMPORT_FILE_NOT_MAPPED);
    }
    // Read the imported file.
    const buffer = await readImportFile(importFile.filename);
    const sheetData = this.importCommon.parseXlsxSheet(buffer);
    const header = getSheetColumns(sheetData);

    const resource = importFile.resource;
    const resourceFields = this.resource.getResourceFields2(tenantId, resource);

    // Runs the importing operation with ability to return errors that will happen.
    const [successedImport, failedImport, allData] =
      await this.uow.withTransaction(
        tenantId,
        async (trx: Knex.Transaction) => {
          // Prases the sheet json data.
          const parsedData = await this.importParser.parseSheetData(
            tenantId,
            importFile,
            resourceFields,
            sheetData,
            trx
          );
          const [successedImport, failedImport] =
            await this.importCommon.import(
              tenantId,
              importFile,
              parsedData,
              trx
            );
          return [successedImport, failedImport, parsedData];
        },
        trx
      );
    const mapping = importFile.mappingParsed;
    const errors = chain(failedImport)
      .map((oper) => oper.error)
      .flatten()
      .value();

    const unmappedColumns = getUnmappedSheetColumns(header, mapping);
    const totalCount = allData.length;

    const createdCount = successedImport.length;
    const errorsCount = failedImport.length;
    const skippedCount = errorsCount;

    return {
      resource,
      createdCount,
      skippedCount,
      totalCount,
      errorsCount,
      errors,
      unmappedColumns: unmappedColumns,
      unmappedColumnsCount: unmappedColumns.length,
    };
  }
}
