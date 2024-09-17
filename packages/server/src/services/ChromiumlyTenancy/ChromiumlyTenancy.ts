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
    const parsedProperties = {
      margins: { top: 0, bottom: 0, left: 0, right: 0 },
      ...properties,
    }
    return this.htmlConvert.convert(tenantId, content, parsedProperties, pdfFormat);
  }
}
