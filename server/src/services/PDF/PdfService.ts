import { Service } from 'typedi';
import puppeteer from 'puppeteer';
import config from 'config';

@Service()
export default class PdfService {

  /**
   * Pdf document.
   * @param content 
   * @returns 
   */
  async pdfDocument(content: string) {
    const browser = await puppeteer.connect({
      browserWSEndpoint: config.puppeteer.browserWSEndpoint,
    });
    const page = await browser.newPage();
    await page.setContent(content);

    const pdf = await page.pdf({ format: 'a4' });

    await browser.close();

    return pdf;
  }
}
