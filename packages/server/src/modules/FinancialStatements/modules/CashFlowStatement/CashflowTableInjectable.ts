import { Injectable } from '@nestjs/common';
import { CashFlowTable } from './CashFlowTable';
import { CashFlowStatementService } from './CashFlowService';
import { I18nService } from 'nestjs-i18n';
import {
  ICashFlowStatementQuery,
  ICashFlowStatementTable,
} from './Cashflow.types';

@Injectable()
export class CashflowTableInjectable {
  constructor(
    private readonly cashflowSheet: CashFlowStatementService,
    private readonly i18n: I18nService,
  ) {}

  /**
   * Retrieves the cash flow table.
   * @param {ICashFlowStatementQuery} query - 
   * @returns {Promise<ICashFlowStatementTable>}
   */
  public async table(
    query: ICashFlowStatementQuery,
  ): Promise<ICashFlowStatementTable> {
    const cashflowDOO = await this.cashflowSheet.cashFlow(query);
    const cashflowTable = new CashFlowTable(cashflowDOO, this.i18n);

    return {
      table: {
        columns: cashflowTable.tableColumns(),
        rows: cashflowTable.tableRows(),
      },
      query: cashflowDOO.query,
      meta: cashflowDOO.meta,
    };
  }
}
