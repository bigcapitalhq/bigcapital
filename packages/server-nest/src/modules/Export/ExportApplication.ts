import { Injectable } from '@nestjs/common';
import { ExportResourceService } from './ExportService';
import { ExportFormat } from './common';

@Injectable()
export class ExportApplication {
  /**
   * Constructor method.
   */
  constructor(
    private readonly exportResource: ExportResourceService,
  ) {}

  /**
   * Exports the given resource to csv, xlsx or pdf format.
   * @param {string} reosurce
   * @param {ExportFormat} format
   */
  public export(tenantId: number, resource: string, format: ExportFormat) {
    return this.exportResource.export(tenantId, resource, format);
  }
}
