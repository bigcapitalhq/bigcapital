import { Inject, Service } from 'typedi';
import BalanceSheetStatementService from './BalanceSheetInjectable';
import BalanceSheetTable from './BalanceSheetTable';
import { IBalanceSheetQuery, IBalanceSheetTable } from '@/interfaces';
import HasTenancyService from '@/services/Tenancy/TenancyService';

@Service()
export class BalanceSheetTableInjectable {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private balanceSheetService: BalanceSheetStatementService;

  /**
   * Retrieves the balance sheet in table format.
   * @param {number} tenantId
   * @param {number} query
   * @returns {Promise<IBalanceSheetTable>}
   */
  public async table(
    tenantId: number,
    filter: IBalanceSheetQuery
  ): Promise<IBalanceSheetTable> {
    const i18n = this.tenancy.i18n(tenantId);

    const { data, query, meta } = await this.balanceSheetService.balanceSheet(
      tenantId,
      filter
    );
    const table = new BalanceSheetTable(data, query, i18n);

    return {
      table: {
        columns: table.tableColumns(),
        rows: table.tableRows(),
      },
      query,
      meta,
    };
  }
}
