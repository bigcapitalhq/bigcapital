import { Inject, Service } from 'typedi';
import { ExportResourceService } from './ExportService';
import { ExportFormat } from './common';

@Service()
export class ExportApplication {
  @Inject()
  private exportResource: ExportResourceService;

  /**
   * Exports the given resource to csv, xlsx or pdf format.
   * @param {string} reosurce
   * @param {ExportFormat} format
   */
  public export(tenantId: number, resource: string, format: ExportFormat) {
    return this.exportResource.export(tenantId, resource, format);
  }
}
