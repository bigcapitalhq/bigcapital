import { Inject, Service } from 'typedi';
import { Exportable } from '../Export/Exportable';
import { IItemsFilter } from '@/interfaces';
import { ItemsApplication } from './ItemsApplication';

@Service()
export class ItemsExportable extends Exportable {
  @Inject()
  private itemsApplication: ItemsApplication;

  /**
   * Retrieves the accounts data to exportable sheet.
   * @param {number} tenantId
   * @returns
   */
  public exportable(tenantId: number, query: IItemsFilter) {
    const parsedQuery = {
      sortOrder: 'DESC',
      columnSortBy: 'created_at',
      page: 1,
      ...query,
      pageSize: 12,
    } as IItemsFilter;

    return this.itemsApplication
      .getItems(tenantId, parsedQuery)
      .then((output) => output.items);
  }
}
