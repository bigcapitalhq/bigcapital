import { Injectable } from '@nestjs/common';
import { ChromiumlyTenancy } from '../ChromiumlyTenancy/ChromiumlyTenancy.service';
import { renderExportResourceTableTemplateHtml } from '@bigcapital/pdf-templates';
import { mapPdfRows } from './utils';

@Injectable()
export class ExportPdf {
  constructor(
    private readonly chromiumlyTenancy: ChromiumlyTenancy,
  ) { }

  /**
   * Generates the pdf table sheet for the given data and columns.
   * @param {} columns
   * @param {Record<string, string>} data
   * @param {string} sheetTitle
   * @param {string} sheetDescription
   * @returns
   */
  public async pdf(
    columns: { accessor: string; name?: string; style?: string; group?: string }[],
    data: Record<string, any>,
    sheetTitle: string = '',
    sheetDescription: string = ''
  ) {
    const rows = mapPdfRows(columns, data);

    const htmlContent = renderExportResourceTableTemplateHtml({
      table: { rows, columns },
      sheetTitle,
      sheetDescription,
    });
    // Convert the HTML content to PDF
    return this.chromiumlyTenancy.convertHtmlContent(htmlContent, {
      margins: { top: 0.2, bottom: 0.2, left: 0.2, right: 0.2 },
      landscape: true,
    });
  }
}
