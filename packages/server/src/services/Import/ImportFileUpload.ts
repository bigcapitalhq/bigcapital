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

@Service()
export class ImportFileUploadService {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private resourceService: ResourceService;

  /**
   * Reads the imported file and stores the import file meta under unqiue id.
   * @param {number} tenantId -
   * @param {string} filePath -
   * @param {string} fileName -
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
    const buffer = await fs.readFile(filePath);
    const workbook = XLSX.read(buffer, { type: 'buffer' });

    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);
    
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
    // @todo return the resource importable columns.
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
