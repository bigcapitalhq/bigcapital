import { Injectable } from '@nestjs/common';
import { Exportable } from '../Export/Exportable';
import { ItemCategoryApplication } from './ItemCategory.application';
import { IItemCategoriesFilter } from './ItemCategory.interfaces';
import { ExportableService } from '../Export/decorators/ExportableModel.decorator';
import { ItemCategory } from './models/ItemCategory.model';

@Injectable()
@ExportableService({ name: ItemCategory.name })
export class ItemCategoriesExportable extends Exportable {
  constructor(private readonly itemCategoryApp: ItemCategoryApplication) {
    super();
  }

  /**
   * Retrieves the accounts data to exportable sheet.
   * @param {number} tenantId
   * @returns
   */
  public exportable(query: Partial<IItemCategoriesFilter>) {
    const parsedQuery = {
      ...query
    } as IItemCategoriesFilter;

    return this.itemCategoryApp
      .getItemCategories(parsedQuery)
      .then((output) => output.data);
  }
}
