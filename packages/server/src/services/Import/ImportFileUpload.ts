import { first, values } from 'lodash';
import { Inject, Service } from 'typedi';
import { ServiceError } from '@/exceptions';
import XLSX from 'xlsx';
import * as R from 'ramda';
import HasTenancyService from '../Tenancy/TenancyService';
import { ERRORS, trimObject } from './_utils';
import ResourceService from '../Resource/ResourceService';
import fs from 'fs/promises';
import { IModelMetaField } from '@/interfaces';
import { ImportFileCommon } from './ImportFileCommon';
@Service()
export class ImportFileUploadService {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private resourceService: ResourceService;

  @Inject()
  private importFileCommon: ImportFileCommon;

  /**
   * Reads the imported file and stores the import file meta under unqiue id.
   * @param {number} tenantId - Tenant id.
   * @param {string} resource - Resource name.
   * @param {string} filePath - File path.
   * @param {string} fileName - File name.
   * @returns
   */
  public async import(
    tenantId: number,
    resource: string,
    filePath: string,
    filename: string
  ) {
    const { Import } = this.tenancy.models(tenantId);

    const resourceMeta = this.resourceService.getResourceMeta(
      tenantId,
      resource
    );
    // Throw service error if the resource does not support importing.
    if (!resourceMeta.importable) {
      throw new ServiceError(ERRORS.RESOURCE_NOT_IMPORTABLE);
    }
    // Reads the imported file into buffer.
    const buffer = await this.importFileCommon.readImportFile(filename);

    // Parse the buffer file to array data.
    const jsonData = this.importFileCommon.parseXlsxSheet(buffer);

    const columns = this.getColumns(jsonData);
    const coumnsStringified = JSON.stringify(columns);

    // @todo validate the resource.
    const _resource = this.resourceService.resourceToModelName(resource);

    const exportFile = await Import.query().insert({
      filename,
      importId: filename,
      resource: _resource,
      columns: coumnsStringified,
    });
    const resourceColumns = this.resourceService.getResourceImportableFields(
      tenantId,
      resource
    );
    const resourceColumnsTransformeed = Object.entries(resourceColumns).map(
      ([key, { name }]: [string, IModelMetaField]) => ({ key, name })
    );
    return {
      export: exportFile,
      columns,
      resourceColumns: resourceColumnsTransformeed,
    };
  }

  /**
   * Retrieves the sheet columns from the given sheet data.
   * @param {unknown[]} json
   * @returns {string[]}
   */
  private getColumns(json: unknown[]): string[] {
    return R.compose(Object.keys, trimObject, first)(json);
  }
}
