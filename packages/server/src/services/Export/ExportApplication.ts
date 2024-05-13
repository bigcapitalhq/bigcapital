import { Inject, Service } from 'typedi';
import { ExportResourceService } from './ExportService';

@Service()
export class ExportApplication {
  @Inject()
  private exportResource: ExportResourceService;

  /**
   * Exports the given resource to csv, xlsx or pdf format.
   * @param {string} reosurce
   * @param {string} format
   */
  public export(tenantId: number, resource: string, format: string) {
    return this.exportResource.export(tenantId, resource, format);
  }
}
