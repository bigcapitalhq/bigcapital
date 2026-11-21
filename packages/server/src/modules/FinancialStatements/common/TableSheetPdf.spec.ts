import { escapeRegExp } from 'lodash';
import { NegativeAmountPdfCss, TableSheetPdf } from './TableSheetPdf';
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
 * A table with negative amounts, percentages and totals, and a nested account
 * whose name looks like a negative amount.
 */
const negativeTable: ITableData = {
  columns: [
    { key: 'name', label: 'Account name' },
    { key: 'total', label: 'Total' },
    { key: 'percentage', label: '% of column' },
  ],
  rows: [
    {
      rowTypes: ['AGGREGATE'],
      id: 'ASSETS',
      cells: [
        { key: 'name', value: 'Assets' },
        { key: 'total', value: '' },
        { key: 'percentage', value: '' },
      ],
      children: [
        {
          rowTypes: ['ACCOUNT'],
          id: '1001',
          cells: [
            { key: 'name', value: 'Petty Cash' },
            { key: 'total', value: '-$50.00' },
            { key: 'percentage', value: '-%250.00' },
          ],
        },
        {
          rowTypes: ['ACCOUNT'],
          id: '1002',
          cells: [
            { key: 'name', value: '(1,200.00)' },
            { key: 'total', value: '$20.00' },
            { key: 'percentage', value: '%100.00' },
          ],
        },
      ],
    },
    {
      rowTypes: ['TOTAL'],
      id: 'ASSETS',
      cells: [
        { key: 'name', value: 'Total Assets' },
        { key: 'total', value: '-$30.00' },
        { key: 'percentage', value: '-%150.00' },
      ],
    },
  ],
};

/**
 * Renders the table to PDF with the conversion mocked, and returns the HTML
 * that would have been handed to the converter and the conversion options.
 */
const renderPdf = async (
  customCSS?: string,
  showNegativeInRed?: boolean,
  data: ITableData = table,
): Promise<{ html: string; options: Record<string, any> }> => {
  const convertHtmlContent = jest.fn().mockResolvedValue(Buffer.from('%PDF'));
  const tableSheetPdf = new TableSheetPdf({ convertHtmlContent } as any);

  await tableSheetPdf.convertToPdf(
    data,
    'Acme Inc.',
    'Balance Sheet',
    'As 03 Nov 2026',
    customCSS,
    showNegativeInRed,
  );
  const [html, options] = convertHtmlContent.mock.calls[0];

  return { html, options };
};

/**
 * Renders the table to PDF with the conversion mocked, and returns the HTML
 * that would have been handed to the converter.
 */
const renderPdfHtml = async (
  customCSS?: string,
  showNegativeInRed?: boolean,
  data: ITableData = table,
): Promise<string> =>
  (await renderPdf(customCSS, showNegativeInRed, data)).html;

/**
 * Returns the header labels rendered by the PDF template, in order.
 */
const readHeaderLabels = (html: string): string[] =>
  [...html.matchAll(/<th\b[^>]*>(.*?)<\/th>/g)].map((match) => match[1]);

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

  describe('nested columns', () => {
    const nestedColumnsTable: ITableData = {
      columns: [
        { key: 'name', label: 'Account name' },
        {
          key: 'total',
          label: 'Total',
          children: [
            { key: 'previous_year', label: 'Previous year' },
            { key: 'total', label: 'Total' },
          ],
        },
      ],
      rows: [
        {
          cells: [
            { key: 'name', value: 'Assets' },
            { key: 'previous_year', value: '$1,000.00' },
            { key: 'total', value: '$1,200.00' },
          ],
        },
      ],
    };

    it('renders the parent column as a grouped sub-header', async () => {
      const html = await renderPdfHtml(undefined, false, nestedColumnsTable);

      expect(readHeaderLabels(html)).toEqual([
        'Account name',
        'Total',
        'Previous year',
        'Total',
      ]);
      expect(html).toMatch(/<th[^>]*rowspan="2"[^>]*>Account name<\/th>/);
      expect(html).toMatch(/<th[^>]*colspan="2"[^>]*>Total<\/th>/);
    });

    it('keeps a parent column with no children as a leaf', async () => {
      const html = await renderPdfHtml(undefined, false, {
        columns: [
          { key: 'name', label: 'Account name' },
          { key: 'total', label: 'Total', children: [] },
        ],
        rows: [
          {
            cells: [
              { key: 'name', value: 'Assets' },
              { key: 'total', value: '$1,200.00' },
            ],
          },
        ],
      });

      expect(readHeaderLabels(html)).toEqual(['Account name', 'Total']);
      expect(html).not.toContain('colspan');
      expect(html).not.toContain('rowspan');
    });

    it('uses landscape when the leaf columns are more than four', async () => {
      const { options } = await renderPdf(undefined, false, {
        columns: [
          { key: 'name', label: 'Account name' },
          {
            key: 'total',
            label: 'Total',
            children: [
              { key: 'percentage_column', label: '% of column' },
              { key: 'percentage_row', label: '% of row' },
              { key: 'previous_year', label: 'Previous year' },
              { key: 'total', label: 'Total' },
            ],
          },
        ],
        rows: [],
      });

      expect(options).toEqual(expect.objectContaining({ landscape: true }));
    });

    it('stays portrait when the leaf columns are four or fewer', async () => {
      const { options } = await renderPdf();

      expect(options).toEqual(expect.objectContaining({ landscape: false }));
    });
  });

  describe('with "Show negative in red."', () => {
    it('marks negative amounts, percentages and totals', async () => {
      const html = await renderPdfHtml(HtmlTableCustomCss, true, negativeTable);

      expect(
        html.match(
          /<td class="cell--(total|percentage) is-negative-amount[ "]/g,
        ),
      ).toHaveLength(4);
    });

    it('never marks nested name cells that look negative', async () => {
      const html = await renderPdfHtml(HtmlTableCustomCss, true, negativeTable);

      expect(html).not.toMatch(/<td class="cell--name is-negative-amount/);
      expect(html).toContain(
        '<span style="padding-left: 15px;"></span>(1,200.00)',
      );
    });

    it('never marks a top-level label that looks negative', async () => {
      const html = await renderPdfHtml(undefined, true, {
        columns: [
          { key: 'customer_name', label: 'Customer' },
          { key: 'total', label: 'Total' },
        ],
        rows: [
          {
            rowTypes: ['CUSTOMER'],
            id: '7',
            cells: [
              { key: 'customer_name', value: '(1,200.00)' },
              { key: 'total', value: '-$5.00' },
            ],
          },
        ],
      });

      expect(html).not.toMatch(/<td class="cell--customer_name is-negative/);
      expect(html).toMatch(/<td class="cell--total is-negative-amount[ "]/);
    });

    it('never marks free-text columns such as references and descriptions', async () => {
      const html = await renderPdfHtml(undefined, true, {
        columns: [
          { key: 'date', label: 'Date' },
          { key: 'account_name', label: 'Account' },
          { key: 'reference_number', label: 'Reference' },
          { key: 'description', label: 'Description' },
          { key: 'amount', label: 'Amount' },
        ],
        rows: [
          {
            rowTypes: ['TRANSACTION'],
            id: '9',
            cells: [
              { key: 'date', value: '01 Jun 2025' },
              { key: 'account_name', value: '(2024)' },
              { key: 'reference_number', value: '-5' },
              { key: 'description', value: '(3)' },
              { key: 'amount', value: '-$7.00' },
            ],
          },
        ],
      });

      expect(html.match(/is-negative-amount/g)).toHaveLength(2); // td + rule
      expect(html).toMatch(/<td class="cell--amount is-negative-amount[ "]/);
    });

    it('leaves positive amounts unmarked', async () => {
      const html = await renderPdfHtml(HtmlTableCustomCss, true, negativeTable);

      expect(html).toMatch(
        /<td class="cell--total [^"]*"><span>\$20\.00<\/span>/,
      );
      expect(html).not.toMatch(
        /<td class="cell--total is-negative-amount[^"]*"><span>\$20\.00/,
      );
    });

    it('adds the negative colour after the report CSS', async () => {
      const html = await renderPdfHtml(HtmlTableCustomCss, true, negativeTable);

      expect(html).toMatch(
        new RegExp(
          `<style[^>]*>${escapeRegExp(HtmlTableCustomCss)}\\n${escapeRegExp(
            NegativeAmountPdfCss,
          )}</style>`,
        ),
      );
      expect(NegativeAmountPdfCss).toBe(
        'table tbody tr td.is-negative-amount { color: #ac2f33; }',
      );
    });

    it('adds only the colour rule when the report has no custom CSS', async () => {
      const html = await renderPdfHtml(undefined, true, negativeTable);

      expect(html).toMatch(
        new RegExp(`<style[^>]*>${escapeRegExp(NegativeAmountPdfCss)}</style>`),
      );
      expect(html).not.toContain('undefined');
    });

    it('renders exactly as before when the switch is off', async () => {
      const off = await renderPdfHtml(HtmlTableCustomCss, false, negativeTable);

      expect(off).toBe(
        await renderPdfHtml(HtmlTableCustomCss, undefined, negativeTable),
      );
      expect(off).not.toContain('is-negative-amount');
    });
  });
});
