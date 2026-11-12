import {
  ITableCell,
  ITableColumn,
  ITableData,
  ITableRow,
} from '../types/Table.types';
import { FinancialTableStructure } from './FinancialTableStructure';
import { tableClassNames } from '../utils';
import { Injectable } from '@nestjs/common';
import { ChromiumlyTenancy } from '../../ChromiumlyTenancy/ChromiumlyTenancy.service';
import { renderFinancialSheetTemplateHtml } from '@bigcapital/pdf-templates';
import { isNegativeAmount } from '@bigcapital/utils';

/**
 * Colours the cells marked as negative amounts when a report is printed with
 * "Show negative in red." on. The selector outranks the total-row colour
 * some reports set (`table tr.row-type--total td`), and the rule comes after
 * the report's own CSS.
 */
export const NegativeAmountPdfCss =
  'table tbody tr td.is-negative-amount { color: #ac2f33; }';

/**
 * Report columns that hold text (dates, accounts, references, descriptions),
 * whose values must never be coloured even when they look like an amount,
 * such as a reference "-5" or a description "(3)".
 */
const TEXT_COLUMN_KEYS = new Set([
  'date',
  'account',
  'account_name',
  'account_code',
  'reference_type',
  'reference_number',
  'ref_type',
  'description',
  'transaction_type',
  'transaction_number',
  'transaction_id',
  'transactionType',
  'transactionNumber',
]);

/**
 * Detects whether a report cell is a negative amount. The first cell of a row
 * is always its label (account, customer, item…), so it never is.
 * @param {ITableCell} cell - The table cell.
 * @param {number} index - The cell index in its row.
 * @returns {boolean}
 */
const isNegativeAmountCell = (cell: ITableCell, index: number): boolean =>
  index > 0 && !TEXT_COLUMN_KEYS.has(cell.key) && isNegativeAmount(cell.value);

@Injectable()
export class TableSheetPdf {
  /**
   * @param {ChromiumlyTenancy} chromiumlyTenancy - The chromiumly tenancy service.
   */
  constructor(private readonly chromiumlyTenancy: ChromiumlyTenancy) {}

  /**
   * Converts the table data into a PDF format.
   * @param {ITableData} table - The table data to be converted.
   * @param {string} organizationName - The organization name.
   * @param {string} sheetName - The name of the sheet.
   * @param {string} sheetDate - The date of the sheet.
   * @param {string} customCSS - Optional custom CSS to inject.
   * @param {boolean} showNegativeInRed - Whether to show negative amounts in red.
   * @returns A promise that resolves with the PDF conversion result.
   */
  public async convertToPdf(
    table: ITableData,
    organizationName: string,
    sheetName: string,
    sheetDate: string,
    customCSS?: string,
    showNegativeInRed?: boolean,
  ): Promise<Buffer> {
    // Prepare columns and rows for PDF conversion
    const columns = this.tablePdfColumns(table.columns);
    const rows = this.tablePdfRows(table.rows);
    const landscape = columns.length > 4;
    const markNegatives = showNegativeInRed === true;

    // Generate HTML content from the React template
    const htmlContent = renderFinancialSheetTemplateHtml({
      organizationName,
      sheetName,
      sheetDate,
      table: {
        columns: columns.map((col) => ({
          key: col.key,
          label: col.label,
          style: (col as any).style, // style may be added during transformation
        })),
        rows: rows.map((row) => ({
          cells: markNegatives
            ? row.cells.map((cell, index) =>
                isNegativeAmountCell(cell, index)
                  ? { ...cell, classNames: 'is-negative-amount' }
                  : cell,
              )
            : row.cells,
          classNames: row.classNames.join(' '),
        })),
      },
      customCSS: markNegatives
        ? [customCSS, NegativeAmountPdfCss].filter(Boolean).join('\n')
        : customCSS,
    });
    // Convert the HTML content to PDF
    return this.chromiumlyTenancy.convertHtmlContent(htmlContent, {
      margins: { top: 0, bottom: 0, left: 0, right: 0 },
      landscape,
    });
  }

  /**
   * Converts the table columns to pdf columns.
   * @param {ITableColumn[]} columns
   * @returns {ITableColumn[]}
   */
  private tablePdfColumns = (columns: ITableColumn[]): ITableColumn[] => {
    return columns;
  };

  /**
   * Converts the table rows to pdf rows.
   * @param {ITableRow[]} rows - The table rows to be converted.
   * @returns {Array<ITableRow & { classNames: string[] }>} - The converted table rows.
   */
  private tablePdfRows = (
    rows: ITableRow[],
  ): Array<ITableRow & { classNames: string[] }> => {
    const flatNestedTreeRows = (rows: ITableRow[]): ITableRow[] =>
      FinancialTableStructure.flatNestedTree(rows, {
        nestedPrefix: '<span style="padding-left: 15px;"></span>',
      });
    return tableClassNames(flatNestedTreeRows(rows));
  };
}
