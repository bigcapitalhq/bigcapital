import { constants, PathLike, createReadStream, promises } from 'node:fs';
import FormData from 'form-data';
import { ConverterUtils } from './ConvertUtils';
import { Converter } from './Converter';
import { GotenbergUtils } from './GotenbergUtils';
import { IConverter, PageProperties } from './_types';
import { ChromiumRoute, PdfFormat } from './_types';

export class HtmlConverter extends Converter implements IConverter {
  constructor() {
    super(ChromiumRoute.HTML);
  }

  async convert({
    html,
    properties,
    pdfFormat,
  }: {
    html: PathLike;
    properties?: PageProperties;
    pdfFormat?: PdfFormat;
  }): Promise<Buffer> {
    try {
      await promises.access(html, constants.R_OK);
      const data = new FormData();
      if (pdfFormat) {
        data.append('pdfFormat', pdfFormat);
      }
      data.append('index.html', createReadStream(html));
      if (properties) {
        ConverterUtils.injectPageProperties(data, properties);
      }
      return GotenbergUtils.fetch(this.endpoint, data);
    } catch (error) {
      throw error;
    }
  }
}
