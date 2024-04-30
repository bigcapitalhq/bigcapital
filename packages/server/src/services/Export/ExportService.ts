import { Inject, Service } from 'typedi';
import xlsx from 'xlsx';
import { sanitizeResourceName } from '../Import/_utils';
import ResourceService from '../Resource/ResourceService';
import { ExportableResources } from './ExportResources';
import { ServiceError } from '@/exceptions';
import { Errors } from './common';

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
    const resourceMeta = this.resourceService.getResourceMeta(
      tenantId,
      resource
    );
    const exportable =
      this.exportableResources.registry.getExportable(resource);

    if (!resourceMeta.exportable) {
      throw new ServiceError(Errors.RESOURCE_NOT_EXPORTABLE);
    }
    const data = await exportable.exportable(tenantId, {});

    const exportableColumns = Object.entries(resourceMeta.columns)
      .filter(([_, value]) => value.exportable)
      .map(([key, value]) => ({
        name: value.name,
        type: value.type,
        accessor: value.accessor || key,
      }));

    const workbook = xlsx.utils.book_new();
    const worksheetData = data.map((item) =>
      exportableColumns.map((col) => item[col.accessor])
    );
    worksheetData.unshift(exportableColumns.map((col) => col.name)); // Add header row

    const worksheet = xlsx.utils.aoa_to_sheet(worksheetData);
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Exported Data');

    if (format.toLowerCase() === 'csv') {
      // Convert to CSV using the xlsx package
      return xlsx.write(workbook, { type: 'buffer', bookType: 'csv' });
    } else if (format.toLowerCase() === 'xlsx') {
      // Write to XLSX format
      return xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    }
  }
}
