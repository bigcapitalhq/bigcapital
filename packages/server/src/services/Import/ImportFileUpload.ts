import { first } from 'lodash';
import { Inject, Service } from 'typedi';
import { snakeCase, upperFirst } from 'lodash';
import XLSX from 'xlsx';
import * as R from 'ramda';
import HasTenancyService from '../Tenancy/TenancyService';
import { trimObject } from './_utils';
const fs = require('fs').promises;

@Service()
export class ImportFileUploadService {
  @Inject()
  private tenancy: HasTenancyService;

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

    const buffer = await fs.readFile(filePath);
    const workbook = XLSX.read(buffer, { type: 'buffer' });

    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    // @todo validate the resource.
    const _resource = upperFirst(snakeCase(resource));

    const exportFile = await Import.query().insert({
      filename,
      importId: filename,
      resource: _resource,
    });
    const columns = this.getColumns(jsonData);

    // @todo return the resource importable columns.
    return {
      export: exportFile,
      columns,
    };
  }

  private getColumns(json: unknown[]) {
    return R.compose(Object.keys, trimObject, first)(json);
  }
}
