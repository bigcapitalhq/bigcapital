import { PageProperties, PdfFormat } from '@/libs/chromiumly/_types';
import { ChromiumlyHtmlConvert } from './ChromiumlyHtmlConvert.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ChromiumlyTenancy {
  constructor(private htmlConvert: ChromiumlyHtmlConvert) { }

  /**
   * Converts the given HTML content to PDF.
   * @param {string} content
   * @param {PageProperties} properties
   * @param {PdfFormat} pdfFormat
   * @returns {Promise<Buffer>}
   */
  public convertHtmlContent(
    content: string,
    properties?: PageProperties,
    pdfFormat?: PdfFormat
  ) {
    const parsedProperties = {
      margins: { top: 0, bottom: 0, left: 0, right: 0 },
      ...properties,
    }
    return this.htmlConvert.convert(content, parsedProperties, pdfFormat);
  }
}
