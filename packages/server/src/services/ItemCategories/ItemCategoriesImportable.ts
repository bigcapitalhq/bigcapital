import { IItemCategoryOTD } from '@/interfaces';
import { Knex } from 'knex';
import { Inject, Service } from 'typedi';
import { Importable } from '../Import/Importable';
import ItemCategoriesService from './ItemCategoriesService';
import { ItemCategoriesSampleData } from './constants';

@Service()
export class ItemCategoriesImportable extends Importable {
  @Inject()
  private itemCategoriesService: ItemCategoriesService;

  /**
   * Importing to create new item category service.
   * @param {number} tenantId
   * @param {any} createDTO
   * @param {Knex.Transaction} trx
   */
  public async importable(tenantId: number, createDTO: IItemCategoryOTD, trx?: Knex.Transaction) {
    await this.itemCategoriesService.newItemCategory(tenantId, createDTO, {}, trx);
  }

  /**
   * Item categories sample data used to download sample sheet file.
   */
  public sampleData(): any[] {
    return ItemCategoriesSampleData;
  }
}
