import { Inject, Service } from 'typedi';
import { IItemsFilter } from '@/interfaces';
import { Exportable } from '@/services/Export/Exportable';
import { VendorsApplication } from './VendorsApplication';
import { EXPORT_SIZE_LIMIT } from '@/services/Export/constants';

@Service()
export class VendorsExportable extends Exportable {
  @Inject()
  private vendorsApplication: VendorsApplication;

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

    return this.vendorsApplication
      .getVendors(tenantId, parsedQuery)
      .then((output) => output.vendors);
  }
}
