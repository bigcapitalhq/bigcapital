import * as R from 'ramda';
import { ITableColumn, ITableData, ITableRow } from './types/Table.types';
import { FinancialTableStructure } from './common/FinancialTableStructure';
import { tableClassNames } from './utils';
import { Injectable } from '@nestjs/common';
import { TemplateInjectable } from '../TemplateInjectable/TemplateInjectable.service';
import { ChromiumlyTenancy } from '../ChromiumlyTenancy/ChromiumlyTenancy.service';

@Injectable()
export class TableSheetPdf {
  constructor(
    private readonly templateInjectable: TemplateInjectable,
    private readonly chromiumlyTenancy: ChromiumlyTenancy,
  ) {}

  /**
   * Converts the table data into a PDF format.
   * @param {ITableData} table - The table data to be converted.
   * @param {string} sheetName - The name of the sheet.
   * @param {string} sheetDate - The date of the sheet.
   * @returns A promise that resolves with the PDF conversion result.
   */
  public async convertToPdf(
    table: ITableData,
    sheetName: string,
    sheetDate: string,
    customCSS?: string,
  ): Promise<Buffer> {
    // Prepare columns and rows for PDF conversion
    const columns = this.tablePdfColumns(table.columns);
    const rows = this.tablePdfRows(table.rows);

    const landscape = columns.length > 4;

    // Generate HTML content from the template
    const htmlContent = await this.templateInjectable.render(
      'modules/financial-sheet',
      {
        table: { rows, columns },
        sheetName,
        sheetDate,
        customCSS,
      },
    );
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
   * @param {ITableRow[]} rows -
   * @returns {ITableRow[]}
   */
  private tablePdfRows = (rows: ITableRow[]): ITableRow[] => {
    const curriedFlatNestedTree = R.curry(
      FinancialTableStructure.flatNestedTree,
    );
    const flatNestedTree = curriedFlatNestedTree(R.__, {
      nestedPrefix: '<span style="padding-left: 15px;"></span>',
    });
    return R.compose(tableClassNames, flatNestedTree)(rows);
  };
}
