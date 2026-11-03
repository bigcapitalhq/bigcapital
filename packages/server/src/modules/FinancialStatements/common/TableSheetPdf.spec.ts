import { escapeRegExp } from 'lodash';
import { TableSheetPdf } from './TableSheetPdf';
import { ITableData } from '../types/Table.types';
import { HtmlTableCustomCss } from '../modules/BalanceSheet/constants';

const table: ITableData = {
  columns: [
    { key: 'name', label: 'Account name' },
    { key: 'total', label: 'Total' },
  ],
  rows: [
    {
      rowTypes: ['AGGREGATE'],
      id: 'ASSETS',
      cells: [
        { key: 'name', value: 'Assets' },
        { key: 'total', value: '$1,000.00' },
      ],
      children: [
        {
          rowTypes: ['ACCOUNT'],
          id: '1001',
          cells: [
            { key: 'name', value: 'Petty Cash' },
            { key: 'total', value: '-$50.00' },
          ],
        },
      ],
    },
    {
      rowTypes: ['TOTAL'],
      id: 'ASSETS',
      cells: [
        { key: 'name', value: 'Total Assets' },
        { key: 'total', value: '$1,000.00' },
      ],
    },
  ],
};

/**
 * Renders the table to PDF with the conversion mocked, and returns the HTML
 * that would have been handed to the converter.
 */
const renderPdfHtml = async (customCSS?: string): Promise<string> => {
  const convertHtmlContent = jest.fn().mockResolvedValue(Buffer.from('%PDF'));
  const tableSheetPdf = new TableSheetPdf({ convertHtmlContent } as any);

  await tableSheetPdf.convertToPdf(
    table,
    'Acme Inc.',
    'Balance Sheet',
    'As 03 Nov 2026',
    customCSS,
  );
  return convertHtmlContent.mock.calls[0][0];
};

describe('TableSheetPdf', () => {
  it('renders the report custom CSS verbatim in a <style> after the template styles', async () => {
    const html = await renderPdfHtml(HtmlTableCustomCss);

    expect(html).toMatch(
      new RegExp(`<style[^>]*>${escapeRegExp(HtmlTableCustomCss)}</style>`),
    );
    expect(html.lastIndexOf('<style data-emotion')).toBeLessThan(
      html.indexOf(HtmlTableCustomCss),
    );
  });

  it('adds no <style> of its own when the report has no custom CSS', async () => {
    const html = await renderPdfHtml();

    // Emotion emits its own <style data-emotion> elements; anything else would
    // come from the template's custom CSS slot.
    expect(html).not.toMatch(/<style(?![^>]*data-emotion)/);
  });

  it('renders row classes space-separated', async () => {
    const html = await renderPdfHtml();

    expect(html).toMatch(/<tr class="row-type--total row-id--assets[ "]/);
    expect(html).not.toMatch(/<tr class="[^"]*,/);
  });

  it('keeps the nested-row spacer and classes for child rows', async () => {
    const html = await renderPdfHtml();

    expect(html).toMatch(/<tr class="row-type--account row-id--1001[ "]/);
    expect(html).toContain(
      '<span style="padding-left: 15px;"></span>Petty Cash',
    );
  });
});
