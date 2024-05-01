import { Inject, Service } from 'typedi';
import xlsx from 'xlsx';
import { sanitizeResourceName } from '../Import/_utils';
import ResourceService from '../Resource/ResourceService';
import { ExportableResources } from './ExportResources';
import { ServiceError } from '@/exceptions';
import { Errors } from './common';
import { IModelMeta } from '@/interfaces';

@Service()
export class ExportResourceService {
  @Inject()
  private resourceService: ResourceService;

  @Inject()
  private exportableResources: ExportableResources;

  /**
   * Exports the given resource data through csv, xlsx or pdf.
   * @param {number} tenantId - Tenant id.
   * @param {string} resourceName - Resource name.
   * @param {string} format - File format.
   */
  async export(tenantId: number, resourceName: string, format: string = 'csv') {
    const resource = sanitizeResourceName(resourceName);
    const resourceMeta = this.getResourceMeta(tenantId, resource);

    this.validateResourceMeta(resourceMeta);

    const data = await this.getExportableData(tenantId, resource);
    const exportableColumns = this.getExportableColumns(resourceMeta);

    const workbook = this.createWorkbook(data, exportableColumns);

    return this.exportWorkbook(workbook, format);
  }

  /**
   * Retrieves metadata for a specific resource.
   * @param {number} tenantId - The tenant identifier.
   * @param {string} resource - The name of the resource.
   * @returns The metadata of the resource.
   */
  private getResourceMeta(tenantId: number, resource: string) {
    return this.resourceService.getResourceMeta(tenantId, resource);
  }

  /**
   * Validates if the resource metadata is exportable.
   * @param {any} resourceMeta - The metadata of the resource.
   * @throws {ServiceError} If the resource is not exportable or lacks columns.
   */
  private validateResourceMeta(resourceMeta: any) {
    if (!resourceMeta.exportable || !resourceMeta.columns) {
      throw new ServiceError(Errors.RESOURCE_NOT_EXPORTABLE);
    }
  }

  /**
   * Fetches exportable data for a given resource.
   * @param {number} tenantId - The tenant identifier.
   * @param {string} resource - The name of the resource.
   * @returns A promise that resolves to the exportable data.
   */
  private async getExportableData(tenantId: number, resource: string) {
    const exportable =
      this.exportableResources.registry.getExportable(resource);
    return exportable.exportable(tenantId, {});
  }

  /**
   * Extracts columns that are marked as exportable from the resource metadata.
   * @param {IModelMeta} resourceMeta - The metadata of the resource.
   * @returns An array of exportable columns.
   */
  private getExportableColumns(resourceMeta: IModelMeta) {
    return Object.entries(resourceMeta.columns)
      .filter(([_, value]) => value.exportable !== false)
      .map(([key, value]) => ({
        name: value.name,
        type: value.type,
        accessor: value.accessor || key,
      }));
  }

  /**
   * Creates a workbook from the provided data and columns.
   * @param {any[]} data - The data to be included in the workbook.
   * @param {any[]} exportableColumns - The columns to be included in the workbook.
   * @returns The created workbook.
   */
  private createWorkbook(data: any[], exportableColumns: any[]) {
    const workbook = xlsx.utils.book_new();
    const worksheetData = data.map((item) =>
      exportableColumns.map((col) => item[col.accessor])
    );
    worksheetData.unshift(exportableColumns.map((col) => col.name));

    const worksheet = xlsx.utils.aoa_to_sheet(worksheetData);
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Exported Data');
    return workbook;
  }

  /**
   * Exports the workbook in the specified format.
   * @param {any} workbook - The workbook to be exported.
   * @param {string} format - The format to export the workbook in.
   * @returns The exported workbook data.
   */
  private exportWorkbook(workbook: any, format: string) {
    if (format.toLowerCase() === 'csv') {
      return xlsx.write(workbook, { type: 'buffer', bookType: 'csv' });
    } else if (format.toLowerCase() === 'xlsx') {
      return xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    }
  }
}
