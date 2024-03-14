import { Inject, Service } from 'typedi';
import { chain } from 'lodash';
import { Knex } from 'knex';
import { ServiceError } from '@/exceptions';
import { ERRORS, getSheetColumns, getUnmappedSheetColumns } from './_utils';
import HasTenancyService from '../Tenancy/TenancyService';
import { ImportFileCommon } from './ImportFileCommon';
import { ImportFileDataTransformer } from './ImportFileDataTransformer';
import ResourceService from '../Resource/ResourceService';
import UnitOfWork from '../UnitOfWork';
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
  public async import(
    tenantId: number,
    importId: number,
    trx?: Knex.Transaction
  ): Promise<ImportFilePreviewPOJO> {
    const { Import } = this.tenancy.models(tenantId);

    const importFile = await Import.query()
      .findOne('importId', importId)
      .throwIfNotFound();

    // Throw error if the import file is not mapped yet.
    if (!importFile.isMapped) {
      throw new ServiceError(ERRORS.IMPORT_FILE_NOT_MAPPED);
    }
    // Read the imported file.
    const buffer = await this.importCommon.readImportFile(importFile.filename);
    const sheetData = this.importCommon.parseXlsxSheet(buffer);
    const header = getSheetColumns(sheetData);

    const importableFields = this.resource.getResourceImportableFields(
      tenantId,
      importFile.resource
    );
    // Prases the sheet json data.
    const parsedData = this.importParser.parseSheetData(
      importFile,
      importableFields,
      sheetData
    );
    // Runs the importing operation with ability to return errors that will happen.
    const [successedImport, failedImport] = await this.uow.withTransaction(
      tenantId,
      (trx: Knex.Transaction) =>
        this.importCommon.import(
          tenantId,
          importFile.resource,
          parsedData,
          trx
        ),
      trx
    );
    const mapping = importFile.mappingParsed;
    const errors = chain(failedImport)
      .map((oper) => oper.error)
      .flatten()
      .value();

    const unmappedColumns = getUnmappedSheetColumns(header, mapping);
    const totalCount = parsedData.length;

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
