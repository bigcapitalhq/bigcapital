import { Inject } from 'typedi';
import {
  IGeneralLedgerSheetQuery,
  IGeneralLedgerTableData,
} from '@/interfaces';
import { GeneralLedgerTableInjectable } from './GeneralLedgerTableInjectable';
import { GeneralLedgerExportInjectable } from './GeneralLedgerExport';
import { GeneralLedgerService } from './GeneralLedgerService';
import { GeneralLedgerPdf } from './GeneralLedgerPdf';

export class GeneralLedgerApplication {
  @Inject()
  private GLTable: GeneralLedgerTableInjectable;

  @Inject()
  private GLExport: GeneralLedgerExportInjectable;

  @Inject()
  private GLSheet: GeneralLedgerService;

  @Inject()
  private GLPdf: GeneralLedgerPdf;

  /**
   * Retrieves the G/L sheet in json format.
   * @param {number} tenantId
   * @param {IGeneralLedgerSheetQuery} query
   */
  public sheet(tenantId: number, query: IGeneralLedgerSheetQuery) {
    return this.GLSheet.generalLedger(tenantId, query);
  }

  /**
   * Retrieves the G/L sheet in table format.
   * @param {number} tenantId
   * @param {IGeneralLedgerSheetQuery} query
   * @returns {Promise<IGeneralLedgerTableData>}
   */
  public table(
    tenantId: number,
    query: IGeneralLedgerSheetQuery
  ): Promise<IGeneralLedgerTableData> {
    return this.GLTable.table(tenantId, query);
  }

  /**
   * Retrieves the G/L sheet in xlsx format.
   * @param {number} tenantId
   * @param {IGeneralLedgerSheetQuery} query
   * @returns {}
   */
  public xlsx(
    tenantId: number,
    query: IGeneralLedgerSheetQuery
  ): Promise<Buffer> {
    return this.GLExport.xlsx(tenantId, query);
  }

  /**
   * Retrieves the G/L sheet in csv format.
   * @param {number} tenantId -
   * @param {IGeneralLedgerSheetQuery} query -
   */
  public csv(
    tenantId: number,
    query: IGeneralLedgerSheetQuery
  ): Promise<string> {
    return this.GLExport.csv(tenantId, query);
  }

  /**
   * Retrieves the G/L sheet in pdf format.
   * @param {number} tenantId
   * @param {IGeneralLedgerSheetQuery} query
   * @returns {Promise<Buffer>}
   */
  public pdf(
    tenantId: number,
    query: IGeneralLedgerSheetQuery
  ): Promise<Buffer> {
    return this.GLPdf.pdf(tenantId, query);
  }
}
