import { Inject, Service } from 'typedi';
import { ITrialBalanceSheetQuery, ITrialBalanceSheetTable } from '@/interfaces';
import { TrialBalanceSheetTable } from './TrialBalanceSheetTable';
import TrialBalanceSheetService from './TrialBalanceSheetInjectable';

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
  public async table(
    tenantId: number,
    query: ITrialBalanceSheetQuery
  ): Promise<ITrialBalanceSheetTable> {
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
