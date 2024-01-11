import { Inject, Service } from 'typedi';
import { PageProperties, PdfFormat } from '@/lib/Chromiumly/_types';
import { ChromiumlyHtmlConvert } from './ChromiumlyHtmlConvert';

@Service()
export class ChromiumlyTenancy {
  @Inject()
  private htmlConvert: ChromiumlyHtmlConvert;

  /**
   * Converts the given HTML content to PDF.
   * @param {string} content
   * @param {PageProperties} properties
   * @param {PdfFormat} pdfFormat
   * @returns {Promise<Buffer>}
   */
  public convertHtmlContent(
    tenantId: number,
    content: string,
    properties?: PageProperties,
    pdfFormat?: PdfFormat
  ) {
    return this.htmlConvert.convert(tenantId, content, properties, pdfFormat);
  }
}
