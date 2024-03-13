import { Inject, Service } from 'typedi';
import { first, omit } from 'lodash';
import { ServiceError } from '@/exceptions';
import { ERRORS, getUnmappedSheetColumns } from './_utils';
import HasTenancyService from '../Tenancy/TenancyService';
import { ImportFileCommon } from './ImportFileCommon';
import { ImportFileDataTransformer } from './ImportFileDataTransformer';
import ResourceService from '../Resource/ResourceService';

@Service()
export class ImportFilePreview {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private resource: ResourceService;

  @Inject()
  private importFileCommon: ImportFileCommon;

  @Inject()
  private importFileParser: ImportFileDataTransformer;

  /**
   *
   * - Returns the passed rows and will be in inserted.
   * - Returns the passed rows will be overwritten.
   * - Returns the rows errors from the validation.
   * - Returns the unmapped fields.
   *
   * @param {number} tenantId
   * @param {number} importId
   */
  public async preview(tenantId: number, importId: number) {
    const { Import } = this.tenancy.models(tenantId);

    const importFile = await Import.query()
      .findOne('importId', importId)
      .throwIfNotFound();

    // Throw error if the import file is not mapped yet.
    if (!importFile.isMapped) {
      throw new ServiceError(ERRORS.IMPORT_FILE_NOT_MAPPED);
    }
    const buffer = await this.importFileCommon.readImportFile(
      importFile.filename
    );
    const jsonData = this.importFileCommon.parseXlsxSheet(buffer);

    const importableFields = this.resource.getResourceImportableFields(
      tenantId,
      importFile.resource
    );
    // Prases the sheet json data.
    const parsedData = this.importFileParser.transformSheetData(
      importFile,
      importableFields,
      jsonData
    );
    const knex = this.tenancy.knex(tenantId);
    const trx = await knex.transaction({ isolationLevel: 'read uncommitted' });

    // Runs the importing operation with ability to return errors that will happen.
    const asyncOpers = await this.importFileCommon.import(
      tenantId,
      importableFields,
      parsedData,
      trx
    );
    // Filter out the operations that have successed.
    const successAsyncOpers = asyncOpers.filter((oper) => !oper);
    const errors = asyncOpers.filter((oper) => oper);

    // Rollback all the successed transactions.
    await trx.rollback();

    const header = Object.keys(first(jsonData));
    const mapping = importFile.mappingParsed;

    const unmappedColumns = getUnmappedSheetColumns(header, mapping);
    const totalCount = parsedData.length;

    const createdCount = successAsyncOpers.length;
    const errorsCount = errors.length;
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
