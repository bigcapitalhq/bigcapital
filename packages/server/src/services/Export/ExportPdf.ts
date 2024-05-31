import { Inject, Service } from 'typedi';
import { ChromiumlyTenancy } from '../ChromiumlyTenancy/ChromiumlyTenancy';
import { TemplateInjectable } from '../TemplateInjectable/TemplateInjectable';
import { mapPdfRows } from './utils';

@Service()
export class ExportPdf {
  @Inject()
  private templateInjectable: TemplateInjectable;

  @Inject()
  private chromiumlyTenancy: ChromiumlyTenancy;

  /**
   *
   * @param tenantId
   * @param columns
   * @param data
   * @param sheetTitle
   * @param sheetDescription
   * @returns
   */
  public async pdf(
    tenantId: number,
    columns: { accessor: string },
    data: Record<string, any>,
    sheetTitle: string = '',
    sheetDescription: string = ''
  ) {
    const rows = mapPdfRows(columns, data);

    const htmlContent = await this.templateInjectable.render(
      tenantId,
      'modules/export-resource-table',
      {
        table: { rows, columns },
        sheetTitle,
        sheetDescription,
      }
    );
    // Convert the HTML content to PDF
    return this.chromiumlyTenancy.convertHtmlContent(tenantId, htmlContent, {
      margins: { top: 0.2, bottom: 0.2, left: 0.2, right: 0.2 },
      landscape: true,
    });
  }
}
