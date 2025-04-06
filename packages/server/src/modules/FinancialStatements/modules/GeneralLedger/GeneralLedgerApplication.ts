import {
  IGeneralLedgerSheetQuery,
  IGeneralLedgerTableData,
} from './GeneralLedger.types';
import { GeneralLedgerTableInjectable } from './GeneralLedgerTableInjectable';
import { GeneralLedgerExportInjectable } from './GeneralLedgerExport';
import { GeneralLedgerService } from './GeneralLedgerService';
import { GeneralLedgerPdf } from './GeneralLedgerPdf';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GeneralLedgerApplication {
  constructor(
    private readonly GLTable: GeneralLedgerTableInjectable,
    private readonly GLExport: GeneralLedgerExportInjectable,
    private readonly GLSheet: GeneralLedgerService,
    private readonly GLPdf: GeneralLedgerPdf,
  ) {}

  /**
   * Retrieves the G/L sheet in json format.
   * @param {IGeneralLedgerSheetQuery} query
   */
  public sheet(query: IGeneralLedgerSheetQuery) {
    return this.GLSheet.generalLedger(query);
  }

  /**
   * Retrieves the G/L sheet in table format.
   * @param {IGeneralLedgerSheetQuery} query
   * @returns {Promise<IGeneralLedgerTableData>}
   */
  public table(
    query: IGeneralLedgerSheetQuery,
  ): Promise<IGeneralLedgerTableData> {
    return this.GLTable.table(query);
  }

  /**
   * Retrieves the G/L sheet in xlsx format.
   * @param {IGeneralLedgerSheetQuery} query
   * @returns {Promise<Buffer>}
   */
  public xlsx(
    query: IGeneralLedgerSheetQuery,
  ): Promise<Buffer> {
    return this.GLExport.xlsx(query);
  }

  /**
   * Retrieves the G/L sheet in csv format.
   * @param {IGeneralLedgerSheetQuery} query -
   * @returns {Promise<string>}
   */
  public csv(
    query: IGeneralLedgerSheetQuery,
  ): Promise<string> {
    return this.GLExport.csv(query);
  }

  /**
   * Retrieves the G/L sheet in pdf format.
   * @param {IGeneralLedgerSheetQuery} query
   * @returns {Promise<Buffer>}
   */
  public pdf(
    query: IGeneralLedgerSheetQuery,
  ): Promise<Buffer> {
    return this.GLPdf.pdf(query);
  }
}
