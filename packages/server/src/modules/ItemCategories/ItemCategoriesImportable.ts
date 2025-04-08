import { Importable } from '../Import/Importable';
import { Knex } from 'knex';
import { ItemCategoriesSampleData } from './constants';
import { Injectable } from '@nestjs/common';
import { CreateItemCategoryDto } from './dtos/ItemCategory.dto';
import { ItemCategoryApplication } from './ItemCategory.application';

@Injectable()
export class ItemCategoriesImportable extends Importable {
  constructor(private readonly itemCategoriesApp: ItemCategoryApplication) {
    super();
  }

  /**
   * Importing to create new item category service.
   * @param {CreateItemCategoryDto} createDTO 
   * @param {Knex.Transaction} trx
   */
  public async importable(
    createDTO: CreateItemCategoryDto,
    trx?: Knex.Transaction,
  ) {
    await this.itemCategoriesApp.createItemCategory(createDTO, trx);
  }

  /**
   * Item categories sample data used to download sample sheet file.
   */
  public sampleData(): any[] {
    return ItemCategoriesSampleData;
  }
}
