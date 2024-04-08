import FormData from 'form-data';
import { ConverterUtils } from './ConvertUtils';
import { Converter } from './Converter';
import { GotenbergUtils } from './GotenbergUtils';
import { ChromiumRoute, type IConverter, type PageProperties, type PdfFormat } from './_types';

export class UrlConverter extends Converter implements IConverter {
  constructor() {
    super(ChromiumRoute.URL);
  }

  async convert({
    url,
    properties,
    pdfFormat,
  }: {
    url: string;
    properties?: PageProperties;
    pdfFormat?: PdfFormat;
  }): Promise<Buffer> {
    try {
      const _url = new URL(url);
      const data = new FormData();

      if (pdfFormat) {
        data.append('pdfFormat', pdfFormat);
      }
      data.append('url', _url.href);

      if (properties) {
        ConverterUtils.injectPageProperties(data, properties);
      }
      return GotenbergUtils.fetch(this.endpoint, data);
    } catch (error) {
      throw error;
    }
  }
}
