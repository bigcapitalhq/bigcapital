import { Inject, Service } from 'typedi';
import { ITransactionsByCustomersFilter, ITransactionsByCustomersTable } from '@/interfaces';
import { TransactionsByCustomersSheet } from './TransactionsByCustomersService';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { TransactionsByCustomersTable } from './TransactionsByCustomersTable';

@Service()
export class TransactionsByCustomersTableInjectable {
  @Inject()
  private transactionsByCustomerService: TransactionsByCustomersSheet;

  @Inject()
  private tenancy: HasTenancyService;

  /**
   * Retrieves the transactions by customers sheet in table format.
   * @param {number} tenantId 
   * @param {ITransactionsByCustomersFilter} filter 
   * @returns {Promise<ITransactionsByCustomersFilter>}
   */
  public async table(
    tenantId: number,
    filter: ITransactionsByCustomersFilter
  ): Promise<ITransactionsByCustomersTable> {
    const i18n = this.tenancy.i18n(tenantId);

    const customersTransactions =
      await this.transactionsByCustomerService.transactionsByCustomers(
        tenantId,
        filter
      );
    const table = new TransactionsByCustomersTable(
      customersTransactions.data,
      i18n
    );
    return {
      table: {
        rows: table.tableRows(),
        columns: table.tableColumns(),
      },
      query: customersTransactions.query,
      meta: customersTransactions.meta
    };
  }
}
