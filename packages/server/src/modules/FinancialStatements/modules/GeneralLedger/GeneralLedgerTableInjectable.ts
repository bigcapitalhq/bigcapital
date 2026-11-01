import {
  IGeneralLedgerSheetQuery,
  IGeneralLedgerTableData,
} from './GeneralLedger.types';
import { GeneralLedgerService } from './GeneralLedgerService';
import { GeneralLedgerTable } from './GeneralLedgerTable';
import { Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class GeneralLedgerTableInjectable {
  constructor(
    private readonly GLSheet: GeneralLedgerService,
    private readonly i18n: I18nService,
  ) {}

  /**
   * Retrieves the G/L table.
   * @param {IGeneralLedgerSheetQuery} query - general ledger query.
   * @returns {Promise<IGeneralLedgerTableData>}
   */
  public async table(
    query: IGeneralLedgerSheetQuery,
  ): Promise<IGeneralLedgerTableData> {
    const {
      data: sheetData,
      query: sheetQuery,
      meta: sheetMeta,
    } = await this.GLSheet.generalLedger(query);

    const table = new GeneralLedgerTable(
      sheetData,
      sheetQuery,
      sheetMeta,
      this.i18n,
    );

    return {
      table: {
        columns: table.tableColumns(),
        rows: table.tableRows(),
      },
      query: sheetQuery,
      meta: sheetMeta,
    };
  }
}
