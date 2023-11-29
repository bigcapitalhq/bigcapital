import { Inject, Service } from 'typedi';
import ProfitLossSheetService from './ProfitLossSheetService';
import { ProfitLossSheetTable } from './ProfitLossSheetTable';
import { IProfitLossSheetQuery, IProfitLossSheetTable } from '@/interfaces';
import HasTenancyService from '@/services/Tenancy/TenancyService';

@Service()
export class ProfitLossSheetTableInjectable {
  @Inject()
  private profitLossSheet: ProfitLossSheetService;

  @Inject()
  private tenancy: HasTenancyService;

  /**
   * Retrieves the profit/loss sheet in table format.
   * @param {number} tenantId
   * @param {IProfitLossSheetQuery} filter
   * @returns {Promise<IProfitLossSheetTable>}
   */
  public async table(
    tenantId: number,
    filter: IProfitLossSheetQuery
  ): Promise<IProfitLossSheetTable> {
    const i18n = this.tenancy.i18n(tenantId);

    const { data, query, meta } = await this.profitLossSheet.profitLossSheet(
      tenantId,
      filter
    );
    const table = new ProfitLossSheetTable(data, query, i18n);

    return {
      table: {
        rows: table.tableRows(),
        columns: table.tableColumns(),
      },
      query,
      meta,
    };
  }
}
