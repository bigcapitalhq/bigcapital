import { Inject, Service } from 'typedi';
import { Exportable } from '../Export/Exportable';
import { IAccountsFilter, IAccountsStructureType } from '@/interfaces';
import ItemCategoriesService from './ItemCategoriesService';

@Service()
export class ItemCategoriesExportable extends Exportable {
  @Inject()
  private itemCategoriesApplication: ItemCategoriesService;

  /**
   * Retrieves the accounts data to exportable sheet.
   * @param {number} tenantId
   * @returns
   */
  public exportable(tenantId: number, query: IAccountsFilter) {
    const parsedQuery = {
      sortOrder: 'desc',
      columnSortBy: 'created_at',
      inactiveMode: false,
      ...query,
      structure: IAccountsStructureType.Flat,
    } as IAccountsFilter;

    return this.itemCategoriesApplication
      .getItemCategoriesList(tenantId, parsedQuery, {})
      .then((output) => output.itemCategories);
  }
}
