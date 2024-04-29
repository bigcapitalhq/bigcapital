import { Inject, Service } from 'typedi';
import xlsx from 'xlsx';
import { sanitizeResourceName } from '../Import/_utils';
import ResourceService from '../Resource/ResourceService';
import { ExportableResources } from './ExportResources';

@Service()
export class ExportResourceService {
  @Inject()
  private resourceService: ResourceService;

  @Inject()
  private exportableResources: ExportableResources;

  /**
   *
   * @param {number} tenantId
   * @param {string} resourceName
   * @param {string} format
   */
  async export(tenantId: number, resourceName: string, format: string = 'csv') {
    const resource = sanitizeResourceName(resourceName);
    const resourceMeta = this.resourceService.getResourceMeta(
      tenantId,
      resource
    );
    const exportable =
      this.exportableResources.registry.getExportable(resource);

    const data = await exportable.exportable(tenantId, {});

    const exportableColumns = [
      {
        label: 'Account Normal',
        accessor: 'accountNormalFormatted',
      },
      {
        label: 'Account Type',
        accessor: 'accountTypeFormatted',
      },
    ];

    const workbook = xlsx.utils.book_new();
    const worksheetData = data.map((item) =>
      exportableColumns.map((col) => item[col.accessor])
    );
    worksheetData.unshift(exportableColumns.map((col) => col.label)); // Add header row
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
