import { Inject, Service } from 'typedi';
import * as R from 'ramda';
import { ITableColumn, ITableData, ITableRow } from '@/interfaces';
import { ChromiumlyTenancy } from '@/services/ChromiumlyTenancy/ChromiumlyTenancy';
import { TemplateInjectable } from '@/services/TemplateInjectable/TemplateInjectable';
import { FinancialTableStructure } from './FinancialTableStructure';

@Service()
export class TableSheetPdf {
  @Inject()
  private templateInjectable: TemplateInjectable;

  @Inject()
  private chromiumlyTenancy: ChromiumlyTenancy;

  /**
   * Converts the table to PDF.
   * @param {number} tenantId -
   * @param {IFinancialTable} table -
   * @param {string} sheetName - Sheet name.
   * @param {string} sheetDate - Sheet date.
   */
  public async convertToPdf(
    tenantId: number,
    table: ITableData,
    sheetName: string,
    sheetDate: string
  ) {
    const columns = this.tablePdfColumns(table.columns);
    const rows = this.tablePdfRows(table.rows);
    const htmlContent = await this.templateInjectable.render(
      tenantId,
      'modules/financial-sheet',
      {
        sheetName,
        sheetDate,
        table: { rows, columns },
      }
    );
    return this.chromiumlyTenancy.convertHtmlContent(tenantId, htmlContent, {
      margins: { top: 0, bottom: 0, left: 0, right: 0 },
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
    return R.compose(FinancialTableStructure.flatNestedTree)(rows);
  };
}
