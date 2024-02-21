import { Inject, Service } from 'typedi';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { TransactionsByVendorsTable } from './TransactionsByVendorTable';
import {
  ITransactionsByVendorTable,
  ITransactionsByVendorsFilter,
} from '@/interfaces';
import { TransactionsByVendorsInjectable } from './TransactionsByVendorInjectable';

@Service()
export class TransactionsByVendorTableInjectable {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private transactionsByVendor: TransactionsByVendorsInjectable;

  /**
   * Retrieves the transactions by vendor in table format.
   * @param {number} tenantId
   * @param {ITransactionsByReferenceQuery} query
   * @returns {Promise<ITransactionsByVendorTable>}
   */
  public async table(
    tenantId: number,
    query: ITransactionsByVendorsFilter
  ): Promise<ITransactionsByVendorTable> {
    const i18n = this.tenancy.i18n(tenantId);

    const sheet = await this.transactionsByVendor.transactionsByVendors(
      tenantId,
      query
    );
    const table = new TransactionsByVendorsTable(sheet.data, i18n);

    return {
      table: {
        rows: table.tableRows(),
        columns: table.tableColumns(),
      },
      query,
      meta: sheet.meta,
    };
  }
}
