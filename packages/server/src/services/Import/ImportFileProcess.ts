import { ServiceError } from '@/exceptions';
import { Knex } from 'knex';
import { chain } from 'lodash';
import { Inject, Service } from 'typedi';
import ResourceService from '../Resource/ResourceService';
import HasTenancyService from '../Tenancy/TenancyService';
import UnitOfWork from '../UnitOfWork';
import { ImportFileCommon } from './ImportFileCommon';
import { ImportFileDataTransformer } from './ImportFileDataTransformer';
import { ERRORS, getSheetColumns, getUnmappedSheetColumns } from './_utils';
import { ImportFilePreviewPOJO } from './interfaces';

@Service()
export class ImportFileProcess {
  @Inject()
  private tenancy: HasTenancyService;

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
  public async import(tenantId: number, importId: number, trx?: Knex.Transaction): Promise<ImportFilePreviewPOJO> {
    const { Import } = this.tenancy.models(tenantId);

    const importFile = await Import.query().findOne('importId', importId).throwIfNotFound();

    // Throw error if the import file is not mapped yet.
    if (!importFile.isMapped) {
      throw new ServiceError(ERRORS.IMPORT_FILE_NOT_MAPPED);
    }
    // Read the imported file.
    const buffer = await this.importCommon.readImportFile(importFile.filename);
    const sheetData = this.importCommon.parseXlsxSheet(buffer);
    const header = getSheetColumns(sheetData);

    const resourceFields = this.resource.getResourceFields2(
      tenantId,
      importFile.resource
    );
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
