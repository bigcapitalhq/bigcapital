import { Inject, Service } from 'typedi';
import { TableSheetPdf } from '../TableSheetPdf';
import { GeneralLedgerTableInjectable } from './GeneralLedgerTableInjectable';
import { IGeneralLedgerSheetQuery } from '@/interfaces';
import { HtmlTableCustomCss } from './constants';

@Service()
export class GeneralLedgerPdf {
  @Inject()
  private generalLedgerTable: GeneralLedgerTableInjectable;

  @Inject()
  private tableSheetPdf: TableSheetPdf;

  /**
   * Converts the general ledger sheet table to pdf.
   * @param {number} tenantId - Tenant ID.
   * @param {IGeneralLedgerSheetQuery} query -
   * @returns {Promise<Buffer>}
   */
  public async pdf(
    tenantId: number,
    query: IGeneralLedgerSheetQuery
  ): Promise<Buffer> {
    const table = await this.generalLedgerTable.table(tenantId, query);

    return this.tableSheetPdf.convertToPdf(
      tenantId,
      table.table,
      table.meta.sheetName,
      table.meta.formattedDateRange,
      HtmlTableCustomCss
    );
  }
}
