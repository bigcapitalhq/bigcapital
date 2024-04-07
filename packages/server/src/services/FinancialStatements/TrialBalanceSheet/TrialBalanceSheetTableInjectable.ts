import { ITrialBalanceSheetQuery, ITrialBalanceSheetTable } from '@/interfaces';
import { Inject, Service } from 'typedi';
import TrialBalanceSheetService from './TrialBalanceSheetInjectable';
import { TrialBalanceSheetTable } from './TrialBalanceSheetTable';

@Service()
export class TrialBalanceSheetTableInjectable {
  @Inject()
  private sheet: TrialBalanceSheetService;

  /**
   * Retrieves the trial balance sheet table.
   * @param {number} tenantId
   * @param {ITrialBalanceSheetQuery} query
   * @returns {Promise<ITrialBalanceSheetTable>}
   */
  public async table(tenantId: number, query: ITrialBalanceSheetQuery): Promise<ITrialBalanceSheetTable> {
    const trialBalance = await this.sheet.trialBalanceSheet(tenantId, query);
    const table = new TrialBalanceSheetTable(trialBalance.data, query, {});

    return {
      table: {
        columns: table.tableColumns(),
        rows: table.tableRows(),
      },
      meta: trialBalance.meta,
      query: trialBalance.query,
    };
  }
}
