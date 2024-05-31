import { Inject, Service } from 'typedi';
import path from 'path';
import { promises as fs } from 'fs';
import { PageProperties, PdfFormat } from '@/lib/Chromiumly/_types';
import { UrlConverter } from '@/lib/Chromiumly/UrlConvert';
import HasTenancyService from '../Tenancy/TenancyService';
import { Chromiumly } from '@/lib/Chromiumly/Chromiumly';
import {
  PDF_FILE_EXPIRE_IN,
  getPdfFilePath,
  getPdfFilesStorageDir,
} from './utils';

@Service()
export class ChromiumlyHtmlConvert {
  @Inject()
  private tenancy: HasTenancyService;

  /**
   * Write HTML content to temporary file.
   * @param {number} tenantId - Tenant id.
   * @param {string} content - HTML content.
   * @returns {Promise<[string, () => Promise<void>]>}
   */
  async writeTempHtmlFile(
    tenantId: number,
    content: string
  ): Promise<[string, () => Promise<void>]> {
    const { Document } = this.tenancy.models(tenantId);

    const filename = `document-print-${Date.now()}.html`;
    const filePath = getPdfFilePath(filename);

    await fs.writeFile(filePath, content);
    await Document.query().insert({ key: filename, mimeType: 'text/html' });
    const cleanup = async () => {
      await fs.unlink(filePath);
      await Document.query().where('key', filename).delete();
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
    tenantId: number,
    html: string,
    properties?: PageProperties,
    pdfFormat?: PdfFormat
  ): Promise<Buffer> {
    const [filename, cleanupTempFile] = await this.writeTempHtmlFile(
      tenantId,
      html
    );
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
