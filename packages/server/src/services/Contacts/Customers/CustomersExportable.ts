import { Inject, Service } from 'typedi';
import { IItemsFilter } from '@/interfaces';
import { CustomersApplication } from './CustomersApplication';
import { Exportable } from '@/services/Export/Exportable';
import { EXPORT_SIZE_LIMIT } from '@/services/Export/constants';

@Service()
export class CustomersExportable extends Exportable {
  @Inject()
  private customersApplication: CustomersApplication;

  /**
   * Retrieves the accounts data to exportable sheet.
   * @param {number} tenantId
   * @returns
   */
  public exportable(tenantId: number, query: IItemsFilter) {
    const parsedQuery = {
      sortOrder: 'DESC',
      columnSortBy: 'created_at',
      ...query,
      page: 1,
      pageSize: EXPORT_SIZE_LIMIT,
    } as IItemsFilter;

    return this.customersApplication
      .getCustomers(tenantId, parsedQuery)
      .then((output) => output.customers);
  }
}
