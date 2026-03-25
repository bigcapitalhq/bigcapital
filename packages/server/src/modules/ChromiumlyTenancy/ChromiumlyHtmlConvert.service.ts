import { Inject, Injectable } from '@nestjs/common';
import * as path from 'path';
import { promises as fs } from 'fs';
import { PageProperties, PdfFormat } from '@/libs/chromiumly/_types';
import { UrlConverter } from '@/libs/chromiumly/UrlConvert';
import { Chromiumly } from '@/libs/chromiumly/Chromiumly';
import {
  getPdfFilePath,
  getPdfFilesStorageDir,
} from './utils';
import { Document } from './models/Document';
import { TenantModelProxy } from '../System/models/TenantBaseModel';

@Injectable()
export class ChromiumlyHtmlConvert {
  /**
   * @param {TenantModelProxy<typeof Document>} documentModel - Document model.
   */
  constructor(
    @Inject(Document.name)
    private documentModel: TenantModelProxy<typeof Document>,
  ) { }

  /**
   * Write HTML content to temporary file.
   * @param {string} content - HTML content.
   * @returns {Promise<[string, () => Promise<void>]>}
   */
  async writeTempHtmlFile(
    content: string,
  ): Promise<[string, () => Promise<void>]> {
    const filename = `document-print-${Date.now()}.html`;
    const filePath = getPdfFilePath(filename);

    await fs.writeFile(filePath, content);
    await this.documentModel()
      .query()
      .insert({ key: filename, mimeType: 'text/html' });

    const cleanup = async () => {
      await fs.unlink(filePath);
      await this.documentModel().query().where('key', filename).delete();
    };
    return [filename, cleanup];
  }

  /**
   * Converts the given HTML content to PDF.
   * @param {string} html
   * @param {PageProperties} properties
   * @param {PdfFormat} pdfFormat
   * @returns {Array<Buffer>}
   */
  async convert(
    html: string,
    properties?: PageProperties,
    pdfFormat?: PdfFormat,
  ): Promise<Buffer> {
    const [filename, cleanupTempFile] = await this.writeTempHtmlFile(html);
    const fileDir = getPdfFilesStorageDir(filename);

    const url = path.join(Chromiumly.GOTENBERG_DOCS_ENDPOINT, fileDir);
    const urlConverter = new UrlConverter();

    const buffer = await urlConverter.convert({
      url,
      properties,
      pdfFormat,
    });
    await cleanupTempFile();

    return buffer;
  }
}
