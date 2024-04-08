import { promises as fs } from 'node:fs';
import path from 'node:path';
import { Chromiumly } from '@/lib/Chromiumly/Chromiumly';
import { UrlConverter } from '@/lib/Chromiumly/UrlConvert';
import { PageProperties, PdfFormat } from '@/lib/Chromiumly/_types';
import { Inject, Service } from 'typedi';
import HasTenancyService from '../Tenancy/TenancyService';
import { PDF_FILE_EXPIRE_IN, getPdfFilesStorageDir } from './utils';

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
  async writeTempHtmlFile(tenantId: number, content: string): Promise<[string, () => Promise<void>]> {
    const { Attachment } = this.tenancy.models(tenantId);

    const filename = `document-${Date.now()}.html`;
    const storageDir = getPdfFilesStorageDir(filename);
    const filePath = path.join(process.env.APP_STORAGE_DIR, storageDir);

    await fs.writeFile(filePath, content);
    await Attachment.query().insert({
      key: filename,
      path: storageDir,
      expire_in: PDF_FILE_EXPIRE_IN, // ms
      extension: 'html',
    });
    const cleanup = async () => {
      await fs.unlink(filePath);
      await Attachment.query().where('key', filename).delete();
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
  async convert(tenantId: number, html: string, properties?: PageProperties, pdfFormat?: PdfFormat): Promise<Buffer> {
    const [filename, cleanupTempFile] = await this.writeTempHtmlFile(tenantId, html);
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
