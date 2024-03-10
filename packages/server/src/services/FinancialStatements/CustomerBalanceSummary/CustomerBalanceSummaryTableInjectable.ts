import { Inject, Service } from 'typedi';
import { CustomerBalanceSummaryService } from './CustomerBalanceSummaryService';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import {
  ICustomerBalanceSummaryQuery,
  ICustomerBalanceSummaryTable,
} from '@/interfaces';
import { CustomerBalanceSummaryTable } from './CustomerBalanceSummaryTableRows';

@Service()
export class CustomerBalanceSummaryTableInjectable {
  @Inject()
  private customerBalanceSummaryService: CustomerBalanceSummaryService;

  @Inject()
  private tenancy: HasTenancyService;

  /**
   * Retrieves the customer balance sheet in table format.
   * @param {number} tenantId
   * @param {ICustomerBalanceSummaryQuery} filter
   * @returns {Promise<ICustomerBalanceSummaryTable>}
   */
  public async table(
    tenantId: number,
    filter: ICustomerBalanceSummaryQuery
  ): Promise<ICustomerBalanceSummaryTable> {
    const i18n = this.tenancy.i18n(tenantId);
    const { data, query, meta } =
      await this.customerBalanceSummaryService.customerBalanceSummary(
        tenantId,
        filter
      );
    const table = new CustomerBalanceSummaryTable(data, filter, i18n);

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
