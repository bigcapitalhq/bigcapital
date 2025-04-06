import { chain } from 'lodash';
import { Knex } from 'knex';
import { ERRORS, getUnmappedSheetColumns, readImportFile } from './_utils';
import { ImportFileCommon } from './ImportFileCommon';
import { ImportFileDataTransformer } from './ImportFileDataTransformer';
import { ImportFilePreviewPOJO } from './interfaces';
import { parseSheetData } from './sheet_utils';
import { Injectable } from '@nestjs/common';
import { ResourceService } from '../Resource/ResourceService';
import { UnitOfWork } from '../Tenancy/TenancyDB/UnitOfWork.service';
import { ServiceError } from '../Items/ServiceError';

@Injectable()
export class ImportFileProcess {
  constructor(
    private readonly resource: ResourceService,
    private readonly importCommon: ImportFileCommon,
    private readonly importParser: ImportFileDataTransformer,
    private readonly uow: UnitOfWork,
  ) {}

  /**
   * Preview the imported file results before commiting the transactions.
   * @param {number} tenantId
   * @param {number} importId
   * @returns {Promise<ImportFilePreviewPOJO>}
   */
  public async import(
    importId: string,
    trx?: Knex.Transaction,
  ): Promise<ImportFilePreviewPOJO> {
    const importFile = await Import.query()
      .findOne('importId', importId)
      .where('tenantId', tenantId)
      .throwIfNotFound();

    // Throw error if the import file is not mapped yet.
    if (!importFile.isMapped) {
      throw new ServiceError(ERRORS.IMPORT_FILE_NOT_MAPPED);
    }
    // Read the imported file and parse the given buffer to get columns
    // and sheet data in json format.
    const buffer = await readImportFile(importFile.filename);
    const [sheetData, sheetColumns] = parseSheetData(buffer);

    const resource = importFile.resource;
    const resourceFields = this.resource.getResourceFields2(resource);

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
            trx,
          );
          const [successedImport, failedImport] =
            await this.importCommon.import(
              tenantId,
              importFile,
              parsedData,
              trx,
            );
          return [successedImport, failedImport, parsedData];
        },
        trx,
      );
    const mapping = importFile.mappingParsed;
    const errors = chain(failedImport)
      .map((oper) => oper.error)
      .flatten()
      .value();

    const unmappedColumns = getUnmappedSheetColumns(sheetColumns, mapping);
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
